package com.drikshathakur.bugtracker.repository;

import com.drikshathakur.bugtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// JpaRepository gives you free methods: save(), findById(), findAll(), delete(), etc.
// The two type parameters are: <EntityClass, PrimaryKeyType>
@Repository
public interface UserRepository extends JpaRepository<User, java.util.UUID> {

    // Spring Data JPA reads this method name and auto-generates the SQL:
    // SELECT * FROM users WHERE email = ?
    // You don't write any SQL — the method name IS the query
    Optional<User> findByEmail(String email);

    // Generates: SELECT COUNT(*) > 0 FROM users WHERE email = ?
    // Used during registration to check if email is already taken
    boolean existsByEmail(String email);
}