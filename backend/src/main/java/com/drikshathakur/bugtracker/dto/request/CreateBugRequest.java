package com.drikshathakur.bugtracker.dto.request;

import com.drikshathakur.bugtracker.entity.Bug;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.UUID;

@Data
public class CreateBugRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    private String description;

    @NotNull
    private Bug.Type type;

    @NotNull
    private Bug.Severity severity;

    @NotNull
    private Bug.Priority priority;

    @NotNull(message = "Project ID is required")
    private UUID projectId;

    // Optional — bug can be unassigned initially
    private UUID assigneeId;
}