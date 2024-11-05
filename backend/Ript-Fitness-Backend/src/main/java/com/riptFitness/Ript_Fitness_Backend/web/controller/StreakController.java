package com.riptFitness.Ript_Fitness_Backend.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

	@PutMapping("/updateStreak")
	public ResponseEntity<StreakDto> updateStreak(){
		StreakDto updatedStreak = streakService.updateStreak();
		return ResponseEntity.ok(updatedStreak);
	}
	
	@GetMapping("/getStreak")
	public ResponseEntity<StreakDto> getStreak(){
		StreakDto returnedStreak = streakService.getStreak();
		return ResponseEntity.ok(returnedStreak);
	}
	
}
