package com.riptFitness.Ript_Fitness_Backend.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.StreakService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.StreakDto;

@RestController
@RequestMapping("/streak")
public class StreakController {
	
	public StreakService streakService;
	
	public StreakController(StreakService streakService) {
		this.streakService = streakService;
	}

	@PutMapping("/updateStreak/{id}")
	public ResponseEntity<StreakDto> updateStreak(@PathVariable Long id){
		StreakDto updatedStreak = streakService.updateStreak(id);
		return ResponseEntity.ok(updatedStreak);
	}
	
	@GetMapping("/getStreak/{id}")
	public ResponseEntity<StreakDto> getStreak(@PathVariable Long id){
		StreakDto returnedStreak = streakService.getStreak(id);
		return ResponseEntity.ok(returnedStreak);
	}
	
}
