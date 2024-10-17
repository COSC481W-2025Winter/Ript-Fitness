package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.ExerciseMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.ExerciseModel;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.ExerciseRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.ExerciseDto;

public class ExerciseService {
	// Create an instance of the repository layer & accounts service layer:
	private final ExerciseRepository exerciseRepository;
	private final AccountsService accountsService;
	
	// Constructor:
	public ExerciseService(ExerciseRepository exerciseRepository, AccountsService accountsService) {
		this.exerciseRepository = exerciseRepository;
		this.accountsService = accountsService;
	}

	
	
	
	// Service method to add (create) an exercise
	public ExerciseDto addExercise(ExerciseDto exerciseDto) {
		// Convert DTO to model
		ExerciseModel newExercise = ExerciseMapper.INSTANCE.convertToModel(exerciseDto);
		
		// Get the ID of the user that is trying to add the exercise:
		Long currentUserId = accountsService.getLoggedInUserId();
		
		// Set the reference to the users account ID to the new exercise:
		newExercise.setAccountReferenceId(currentUserId);
		
		
		
		
		
		
		
		
		return null;
	}

}
