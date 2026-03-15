package com.drikshathakur.bugtracker.service;

import com.drikshathakur.bugtracker.dto.response.AnalyticsSummaryResponse;
import com.drikshathakur.bugtracker.entity.Bug;
import com.drikshathakur.bugtracker.entity.Project;
import com.drikshathakur.bugtracker.repository.BugRepository;
import com.drikshathakur.bugtracker.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final BugRepository bugRepository;
    private final ProjectRepository projectRepository;

    public AnalyticsSummaryResponse getSummary(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        List<Bug> bugs = bugRepository.findByProject(project);

        // Count bugs by status using streams
        long total = bugs.size();
        long open = bugs.stream().filter(b -> b.getStatus() == Bug.Status.OPEN).count();
        long inProgress = bugs.stream().filter(b -> b.getStatus() == Bug.Status.IN_PROGRESS).count();
        long inReview = bugs.stream().filter(b -> b.getStatus() == Bug.Status.IN_REVIEW).count();
        long closed = bugs.stream().filter(b -> b.getStatus() == Bug.Status.CLOSED).count();

        // Group by severity: {"CRITICAL": 2, "HIGH": 5, ...}
        Map<String, Long> bySeverity = bugs.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getSeverity().name(),
                        Collectors.counting()
                ));

        // Group by type: {"BUG": 5, "TASK": 3, ...}
        Map<String, Long> byType = bugs.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getType().name(),
                        Collectors.counting()
                ));

        return AnalyticsSummaryResponse.builder()
                .totalBugs(total)
                .openBugs(open)
                .inProgressBugs(inProgress)
                .inReviewBugs(inReview)
                .closedBugs(closed)
                .bugsBySeverity(bySeverity)
                .bugsByType(byType)
                .build();
    }

    public List<Map<String, Object>> getByAssignee(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        List<Bug> bugs = bugRepository.findByProject(project);

        // Group bugs by assignee name
        // Bugs with no assignee are grouped under "Unassigned"
        Map<String, Long> grouped = bugs.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getAssignee() != null ? b.getAssignee().getName() : "Unassigned",
                        Collectors.counting()
                ));

        // Convert to list of maps for easy JSON serialization
        // [{"name": "Driksha", "count": 3}, {"name": "Unassigned", "count": 2}]
        return grouped.entrySet().stream()
                .map(e -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", e.getKey());
                    item.put("count", e.getValue());
                    return item;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getByStatus(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        List<Bug> bugs = bugRepository.findByProject(project);

        // Return count for each status in a fixed order
        List<Map<String, Object>> result = new ArrayList<>();
        for (Bug.Status status : Bug.Status.values()) {
            long count = bugs.stream()
                    .filter(b -> b.getStatus() == status)
                    .count();
            Map<String, Object> item = new HashMap<>();
            item.put("status", status.name().replace("_", " "));
            item.put("count", count);
            result.add(item);
        }
        return result;
    }
}