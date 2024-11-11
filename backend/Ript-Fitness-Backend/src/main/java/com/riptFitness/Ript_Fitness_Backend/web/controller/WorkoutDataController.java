package com.riptFitness.Ript_Fitness_Backend.web.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.WorkoutDataService;

@RestController
@RequestMapping("/workoutData")
public class WorkoutDataController {

	public WorkoutDataService workoutDataService;
	
	public WorkoutDataController(WorkoutDataService workoutDataService) {
		this.workoutDataService = workoutDataService;
	}
	
	
}
