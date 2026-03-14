package com.drikshathakur.bugtracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddCommentRequest {

    @NotBlank(message = "Comment content cannot be empty")
    private String content;
}