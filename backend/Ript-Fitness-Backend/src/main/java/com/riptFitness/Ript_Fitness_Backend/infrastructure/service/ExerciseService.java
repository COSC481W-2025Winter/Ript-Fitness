package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.ExerciseMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.ExerciseModel;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.ExerciseRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.ExerciseDto;

@Service // This annotation tells Spring to manage this class as a service bean
public class ExerciseService {
	// Create an instance of the repository layer & accounts service layer:
	private final ExerciseRepository exerciseRepository;
	private final AccountsRepository accountsRepository;
	private final AccountsService accountsService;
	
	// Constructor:
	public ExerciseService(ExerciseRepository exerciseRepository, AccountsService accountsService, AccountsRepository accountsRepository) {
		this.exerciseRepository = exerciseRepository;
		this.accountsService = accountsService;
		this.accountsRepository = accountsRepository;
	}

	
	
	// Method to add a new exercise:
	public ExerciseDto addExercise(ExerciseDto exerciseDto) {
	    // Convert DTO to model
	    ExerciseModel newExercise = ExerciseMapper.INSTANCE.convertToModel(exerciseDto);

	    // Get the ID of the user that is trying to add the exercise:
	    Long currentUserId = accountsService.getLoggedInUserId();

	    // Retrieve the account associated with the current user
	    AccountsModel account = accountsRepository.findById(currentUserId)
	        .orElseThrow(() -> new RuntimeException("Account not found"));

	    // Set the account in the ExerciseModel
	    newExercise.setAccount(account);

	    // Save the exercise to the database:
	    exerciseRepository.save(newExercise);

	    // Convert the saved entity back to DTO and return
	    return ExerciseMapper.INSTANCE.convertToDto(newExercise);
	}




}
