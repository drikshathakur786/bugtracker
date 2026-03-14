package com.drikshathakur.bugtracker.service;

import com.drikshathakur.bugtracker.dto.request.AddMemberRequest;
import com.drikshathakur.bugtracker.dto.request.CreateProjectRequest;
import com.drikshathakur.bugtracker.dto.response.MemberResponse;
import com.drikshathakur.bugtracker.dto.response.ProjectResponse;
import com.drikshathakur.bugtracker.entity.Project;
import com.drikshathakur.bugtracker.entity.ProjectMember;
import com.drikshathakur.bugtracker.entity.User;
import com.drikshathakur.bugtracker.repository.ProjectMemberRepository;
import com.drikshathakur.bugtracker.repository.ProjectRepository;
import com.drikshathakur.bugtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request, User currentUser) {
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(currentUser)
                .build();

        Project saved = projectRepository.save(project);

        // Automatically add the creator as an ADMIN member of the project
        ProjectMember member = ProjectMember.builder()
                .project(saved)
                .user(currentUser)
                .role(User.Role.ADMIN)
                .build();
        projectMemberRepository.save(member);

        return mapToResponse(saved);
    }

    public List<ProjectResponse> getProjectsForUser(User currentUser) {
        return projectRepository.findAllProjectsForUser(currentUser)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(UUID projectId, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return mapToResponse(project);
    }

    @Transactional
    public MemberResponse addMember(UUID projectId, AddMemberRequest request, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Only the project owner can add members
        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the project owner can add members");
        }

        User userToAdd = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        // Check if already a member
        if (projectMemberRepository.existsByProjectAndUser(project, userToAdd)) {
            throw new RuntimeException("User is already a member of this project");
        }

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(userToAdd)
                .role(request.getRole())
                .build();

        ProjectMember saved = projectMemberRepository.save(member);
        return mapToMemberResponse(saved);
    }

    public List<MemberResponse> getMembers(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return projectMemberRepository.findByProject(project)
                .stream()
                .map(this::mapToMemberResponse)
                .collect(Collectors.toList());
    }

    // Helper method to convert Project entity → ProjectResponse DTO
    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .ownerName(project.getOwner().getName())
                .ownerEmail(project.getOwner().getEmail())
                .createdAt(project.getCreatedAt())
                .build();
    }

    // Helper method to convert ProjectMember entity → MemberResponse DTO
    private MemberResponse mapToMemberResponse(ProjectMember member) {
        return MemberResponse.builder()
                .id(member.getId())
                .name(member.getUser().getName())
                .email(member.getUser().getEmail())
                .role(member.getRole())
                .joinedAt(member.getJoinedAt())
                .build();
    }
}