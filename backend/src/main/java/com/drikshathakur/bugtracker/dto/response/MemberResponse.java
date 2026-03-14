package com.drikshathakur.bugtracker.dto.response;

import com.drikshathakur.bugtracker.entity.User;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberResponse {
    private UUID id;
    private String name;
    private String email;
    private User.Role role;
    private LocalDateTime joinedAt;
}