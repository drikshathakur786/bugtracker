package com.drikshathakur.bugtracker.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private UUID id;
    private String action;
    private String oldValue;
    private String newValue;
    private String changedByName;
    private LocalDateTime timestamp;
}