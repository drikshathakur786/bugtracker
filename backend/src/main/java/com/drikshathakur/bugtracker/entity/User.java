package com.drikshathakur.bugtracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

// @Entity tells JPA "this class maps to a database table"
// Without this, JPA completely ignores the class
@Entity
// @Table lets us specify the exact table name in the DB
// By default JPA would use the class name "User" but "users" is cleaner
@Table(name = "users")
// Lombok annotations — these auto-generate boilerplate code:
// @Data = generates getters, setters, toString, equals, hashCode
// @Builder = lets you create objects like User.builder().name("x").build()
// @NoArgsConstructor = generates empty constructor (required by JPA)
// @AllArgsConstructor = generates constructor with all fields
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    // AUTO generates a UUID automatically when you save a new User
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    // unique = true creates a UNIQUE constraint on this column in the DB
    // This means two users can't register with the same email
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    // We never store plain passwords — always store the BCrypt hash
    // We name it passwordHash in Java but map to password_hash in DB
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    // @Enumerated tells JPA to store the enum as a String ("ADMIN", "DEVELOPER")
    // not as a number (0, 1, 2) — STRING is safer because adding enum values
    // won't break existing data
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // @PrePersist runs this method automatically just before saving to DB
    // This ensures createdAt is always set without you having to do it manually
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // The Role enum lives inside the User class — it's only used here
    public enum Role {
        ADMIN, DEVELOPER, TESTER
    }
}