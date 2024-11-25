package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class TokenValidationService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService; // Assuming you have a user details service

    // Method to validate the token and return its status
    public TokenValidationResponse validateToken(String token) {
        if (token == null || token.isEmpty()) {
            return new TokenValidationResponse(false, "Token is required");
        }

        String username = jwtUtil.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (userDetails == null) {
            return new TokenValidationResponse(false, "Invalid token");
        }

        boolean isExpired = jwtUtil.isTokenExpired(token);
        return new TokenValidationResponse(!isExpired, isExpired ? "Token is expired" : "Token is valid");
    }

    // Response class to encapsulate the token validation response
    public static class TokenValidationResponse {
        private boolean valid;
        private String message;

        public TokenValidationResponse(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }
    }
}
