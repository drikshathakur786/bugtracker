package com.drikshathakur.bugtracker.dto.response;

import com.drikshathakur.bugtracker.entity.User;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private UUID id;
    private String name;
    private String description;
    private String ownerName;
    private String ownerEmail;
    private LocalDateTime createdAt;
}