package com.riptFitness.Ript_Fitness_Backend.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        int saltLength = 16;      // Salt length in bytes
        int hashLength = 32;      // Hash length in bytes
        int parallelism = 1;      // Currently, parallelism is not supported and must be 1
        int memory = 1 << 13;     // Memory costs (e.g., 8 KB)
        int iterations = 3;       // Number of iterations

        return new Argon2PasswordEncoder(saltLength, hashLength, parallelism, memory, iterations);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF protection since we're not using sessions
            .csrf(csrf -> csrf.disable())
            // Configure authorization rules
            .authorizeHttpRequests(authorize -> authorize
                // Allow unauthenticated access to these endpoints
                .requestMatchers("/accounts/createNewAccount", "/accounts/login").permitAll()
                // Require authentication for all other requests
                .anyRequest().authenticated()
            )
            // Disable session management for stateless REST APIs
            .sessionManagement(session -> session.disable());

        return http.build();
    }
}
