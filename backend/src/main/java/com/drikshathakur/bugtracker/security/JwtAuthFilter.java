package com.drikshathakur.bugtracker.security;

import com.drikshathakur.bugtracker.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// OncePerRequestFilter guarantees this filter runs exactly once per request
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Step 1: Get the Authorization header from the request
        // It should look like: "Bearer eyJhbGci..."
        String authHeader = request.getHeader("Authorization");

        // Step 2: If there's no Authorization header or it doesn't start with "Bearer ",
        // skip this filter entirely and continue the chain
        // This allows public routes like /auth/register to work without a token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 3: Extract just the token part (remove "Bearer " prefix)
        String token = authHeader.substring(7);

        // Step 4: Validate the token
        if (!jwtUtil.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 5: Extract the email from the token
        String email = jwtUtil.extractEmail(token);

        // Step 6: Load the user from the database using the email
        // Only proceed if user exists AND not already authenticated
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            userRepository.findByEmail(email).ifPresent(user -> {

                // Step 7: Create an authentication object with the user's role
                // Spring Security uses "ROLE_" prefix convention
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                user,  // the principal (who is logged in)
                                null,  // credentials (null because JWT handles this)
                                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                        );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Step 8: Tell Spring Security this request is authenticated
                // This is what makes @PreAuthorize and role checks work later
                SecurityContextHolder.getContext().setAuthentication(authToken);
            });
        }

        // Step 9: Continue to the next filter / controller
        filterChain.doFilter(request, response);
    }
}