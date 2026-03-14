package com.drikshathakur.bugtracker.dto.response;

import com.drikshathakur.bugtracker.entity.Bug;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BugResponse {
    private UUID id;
    private String title;
    private String description;
    private Bug.Type type;
    private Bug.Status status;
    private Bug.Severity severity;
    private Bug.Priority priority;
    private String reporterName;
    private String assigneeName;
    private String assigneeEmail;
    private UUID projectId;
    private String projectName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}