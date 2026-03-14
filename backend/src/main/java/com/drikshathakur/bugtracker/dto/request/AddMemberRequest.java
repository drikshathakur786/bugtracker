package com.drikshathakur.bugtracker.dto.request;

import com.drikshathakur.bugtracker.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddMemberRequest {

    @NotBlank
    @Email
    private String email;  // we add members by email

    @NotNull
    private User.Role role;
}