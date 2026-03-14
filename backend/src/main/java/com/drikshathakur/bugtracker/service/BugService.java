package com.drikshathakur.bugtracker.service;

import com.drikshathakur.bugtracker.dto.request.AddCommentRequest;
import com.drikshathakur.bugtracker.dto.request.CreateBugRequest;
import com.drikshathakur.bugtracker.dto.request.UpdateBugRequest;
import com.drikshathakur.bugtracker.dto.response.AuditLogResponse;
import com.drikshathakur.bugtracker.dto.response.BugResponse;
import com.drikshathakur.bugtracker.dto.response.CommentResponse;
import com.drikshathakur.bugtracker.entity.*;
import com.drikshathakur.bugtracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BugService {

    private final BugRepository bugRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public BugResponse createBug(CreateBugRequest request, User currentUser) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Bug.BugBuilder builder = Bug.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                // New bugs always start as OPEN
                .status(Bug.Status.OPEN)
                .severity(request.getSeverity())
                .priority(request.getPriority())
                .reporter(currentUser)
                .project(project);

        // If assigneeId provided, look up and assign
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            builder.assignee(assignee);
        }

        Bug saved = bugRepository.save(builder.build());
        return mapToResponse(saved);
    }

    public List<BugResponse> getBugs(UUID projectId, Bug.Status status,
                                     Bug.Severity severity, UUID assigneeId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Get all bugs for the project then filter in memory
        // For a larger app you'd use JpaSpecificationExecutor for DB-level filtering
        return bugRepository.findByProject(project)
                .stream()
                .filter(b -> status == null || b.getStatus() == status)
                .filter(b -> severity == null || b.getSeverity() == severity)
                .filter(b -> assigneeId == null ||
                        (b.getAssignee() != null && b.getAssignee().getId().equals(assigneeId)))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BugResponse getBugById(UUID bugId) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new RuntimeException("Bug not found"));
        return mapToResponse(bug);
    }

    @Transactional
    public BugResponse updateBug(UUID bugId, UpdateBugRequest request, User currentUser) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new RuntimeException("Bug not found"));

        // Track status change for audit log
        if (request.getStatus() != null && request.getStatus() != bug.getStatus()) {
            // Save audit log entry automatically
            AuditLog log = AuditLog.builder()
                    .bug(bug)
                    .changedBy(currentUser)
                    .action("STATUS_CHANGED")
                    .oldValue(bug.getStatus().name())
                    .newValue(request.getStatus().name())
                    .build();
            auditLogRepository.save(log);
            bug.setStatus(request.getStatus());
        }

        // Track assignee change for audit log
        if (request.getAssigneeId() != null) {
            User newAssignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));

            String oldAssignee = bug.getAssignee() != null ?
                    bug.getAssignee().getEmail() : "unassigned";

            AuditLog log = AuditLog.builder()
                    .bug(bug)
                    .changedBy(currentUser)
                    .action("ASSIGNEE_CHANGED")
                    .oldValue(oldAssignee)
                    .newValue(newAssignee.getEmail())
                    .build();
            auditLogRepository.save(log);
            bug.setAssignee(newAssignee);
        }

        // Update other fields if provided
        if (request.getTitle() != null) bug.setTitle(request.getTitle());
        if (request.getDescription() != null) bug.setDescription(request.getDescription());
        if (request.getSeverity() != null) bug.setSeverity(request.getSeverity());
        if (request.getPriority() != null) bug.setPriority(request.getPriority());
        if (request.getType() != null) bug.setType(request.getType());

        return mapToResponse(bugRepository.save(bug));
    }

    @Transactional
    public void deleteBug(UUID bugId) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new RuntimeException("Bug not found"));
        bugRepository.delete(bug);
    }

    @Transactional
    public CommentResponse addComment(UUID bugId, AddCommentRequest request, User currentUser) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new RuntimeException("Bug not found"));

        Comment comment = Comment.builder()
                .bug(bug)
                .author(currentUser)
                .content(request.getContent())
                .build();

        Comment saved = commentRepository.save(comment);
        return CommentResponse.builder()
                .id(saved.getId())
                .content(saved.getContent())
                .authorName(saved.getAuthor().getName())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public List<CommentResponse> getComments(UUID bugId) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new RuntimeException("Bug not found"));

        return commentRepository.findByBugOrderByCreatedAtAsc(bug)
                .stream()
                .map(c -> CommentResponse.builder()
                        .id(c.getId())
                        .content(c.getContent())
                        .authorName(c.getAuthor().getName())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<AuditLogResponse> getAuditLog(UUID bugId) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new RuntimeException("Bug not found"));

        return auditLogRepository.findByBugOrderByTimestampAsc(bug)
                .stream()
                .map(log -> AuditLogResponse.builder()
                        .id(log.getId())
                        .action(log.getAction())
                        .oldValue(log.getOldValue())
                        .newValue(log.getNewValue())
                        .changedByName(log.getChangedBy().getName())
                        .timestamp(log.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }

    private BugResponse mapToResponse(Bug bug) {
        return BugResponse.builder()
                .id(bug.getId())
                .title(bug.getTitle())
                .description(bug.getDescription())
                .type(bug.getType())
                .status(bug.getStatus())
                .severity(bug.getSeverity())
                .priority(bug.getPriority())
                .reporterName(bug.getReporter().getName())
                .assigneeName(bug.getAssignee() != null ? bug.getAssignee().getName() : null)
                .assigneeEmail(bug.getAssignee() != null ? bug.getAssignee().getEmail() : null)
                .projectId(bug.getProject().getId())
                .projectName(bug.getProject().getName())
                .createdAt(bug.getCreatedAt())
                .updatedAt(bug.getUpdatedAt())
                .build();
    }
}