package com.drikshathakur.bugtracker.controller;

import com.drikshathakur.bugtracker.dto.request.LoginRequest;
import com.drikshathakur.bugtracker.dto.request.RegisterRequest;
import com.drikshathakur.bugtracker.dto.response.AuthResponse;
import com.drikshathakur.bugtracker.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.drikshathakur.bugtracker.entity.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/auth")  // full path: /api/auth
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // @Valid triggers the Bean Validation annotations on RegisterRequest
    // If validation fails, Spring automatically returns 400 Bad Request
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response); // 201 Created
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response); // 200 OK
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(@AuthenticationPrincipal User user) {
        // @AuthenticationPrincipal automatically pulls the logged-in user
        // from the SecurityContext that our JwtAuthFilter set
        return ResponseEntity.ok(
                AuthResponse.builder()
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build()
        );
    }
}