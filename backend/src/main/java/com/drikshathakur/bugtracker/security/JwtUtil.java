package com.drikshathakur.bugtracker.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Reads the secret key from application.properties
    @Value("${app.jwt.secret}")
    private String secret;

    // Reads the expiration time from application.properties (86400000ms = 24h)
    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    // Converts the secret string into a cryptographic Key object
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generates a JWT token for a given email
    // The email is stored as the "subject" of the token
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)           // who this token is for
                .setIssuedAt(new Date())      // when it was created
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs)) // when it expires
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // sign it so it can't be faked
                .compact();
    }

    // Extracts the email from a token
    // This is how we know WHO is making a request
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    // Checks if the token is still valid (not expired, not tampered with)
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token); // throws exception if invalid
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}