package com.riptFitness.Ript_Fitness_Backend.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

	@GetMapping("streak")
	public ResponseEntity<StreakDto> getStreak(@RequestBody StreakDto streakDto){
		StreakDto streak = streakService.getStreak(streakDto);
		return new ResponseEntity<>(streak, HttpStatus.OK);
	}
}
