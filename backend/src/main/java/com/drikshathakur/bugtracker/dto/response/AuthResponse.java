package com.drikshathakur.bugtracker.dto.response;

import com.drikshathakur.bugtracker.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// This is what we send BACK to the client after login/register
// Never send the User entity directly — it would expose passwordHash!
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;      // the JWT token
    private String name;
    private String email;
    private User.Role role;
}