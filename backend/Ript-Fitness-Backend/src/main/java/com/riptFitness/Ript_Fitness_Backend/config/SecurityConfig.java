package com.riptFitness.Ript_Fitness_Backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final Environment environment;

    public SecurityConfig(JwtUtil jwtUtil, UserDetailsService userDetailsService, Environment environment) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.environment = environment;
    }

    @Bean
    public JwtRequestFilter jwtRequestFilter() {
        return new JwtRequestFilter(jwtUtil, userDetailsService);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        if (isTestProfileActive()) {
            http.csrf().disable()
                .authorizeRequests().anyRequest().permitAll(); // Allow all requests for test profile
        } else {
            http.csrf(csrf -> csrf.disable())  // Disable CSRF for simplicity
                .authorizeRequests(requests -> requests
                    .requestMatchers("/accounts/createNewAccount", "/accounts/login").permitAll()  // Permit unauthenticated access to these endpoints
                    .anyRequest().authenticated()  // All other requests require authentication
                )
                .addFilterBefore(jwtRequestFilter(), UsernamePasswordAuthenticationFilter.class);  // Add JWT filter before UsernamePasswordAuthenticationFilter
        }
        return http.build();
    }

    private boolean isTestProfileActive() {
        String[] activeProfiles = environment.getActiveProfiles();
        return Arrays.asList(activeProfiles).contains("test");
    }
}



