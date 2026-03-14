package com.drikshathakur.bugtracker.dto.request;

import com.drikshathakur.bugtracker.entity.Bug;
import lombok.Data;
import java.util.UUID;

// All fields are optional — only provided fields get updated
// This is why we use wrapper types (String, not string primitive)
@Data
public class UpdateBugRequest {
    private String title;
    private String description;
    private Bug.Status status;
    private Bug.Severity severity;
    private Bug.Priority priority;
    private Bug.Type type;
    private UUID assigneeId;
}