package com.drikshathakur.bugtracker.service;

import com.drikshathakur.bugtracker.dto.request.LoginRequest;
import com.drikshathakur.bugtracker.dto.request.RegisterRequest;
import com.drikshathakur.bugtracker.dto.response.AuthResponse;
import com.drikshathakur.bugtracker.entity.User;
import com.drikshathakur.bugtracker.repository.UserRepository;
import com.drikshathakur.bugtracker.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
// @RequiredArgsConstructor generates a constructor for all final fields
// This is how Spring injects dependencies (called Constructor Injection)
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        // Check if email is already taken
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Build a new User entity from the request data
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                // NEVER store plain password — always hash it with BCrypt
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        // Save to database
        userRepository.save(user);

        // Generate JWT token for immediate login after registration
        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by email — throw error if not found
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // BCrypt's matches() hashes the input and compares to stored hash
        // We never "decrypt" the password — we just hash and compare
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}