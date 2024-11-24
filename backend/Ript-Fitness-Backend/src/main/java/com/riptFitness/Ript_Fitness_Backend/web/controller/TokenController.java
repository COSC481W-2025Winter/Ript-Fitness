package com.riptFitness.Ript_Fitness_Backend.web.controller;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.TokenValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/token")
public class TokenController {

    @Autowired
    private TokenValidationService tokenValidationService;

    @PostMapping("/validate")
    public ResponseEntity<TokenValidationService.TokenValidationResponse> validateToken(@RequestBody String token) {
        TokenValidationService.TokenValidationResponse response = tokenValidationService.validateToken(token);
        return ResponseEntity.ok(response);
    }
}
