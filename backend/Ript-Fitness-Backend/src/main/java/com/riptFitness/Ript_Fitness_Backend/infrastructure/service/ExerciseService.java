package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.util.ArrayList;
import java.util.List;

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
	public ExerciseService(ExerciseRepository exerciseRepository, AccountsService accountsService,
			AccountsRepository accountsRepository) {
		this.exerciseRepository = exerciseRepository;
		this.accountsService = accountsService;
		this.accountsRepository = accountsRepository;
	}
	
	// Method to get a list of all excersises from logged in user:
	public List<ExerciseDto> getExercisesFromCurrentUser() {
		Long currentUserId = accountsService.getLoggedInUserId();
		
		List<ExerciseModel> listOfExercises = exerciseRepository.findByAccountIdAndNotDeleted(currentUserId);
		
		List<ExerciseDto> listOfExercises2 = new ArrayList<>();
		for(ExerciseModel exercise : listOfExercises) {
			ExerciseDto exercise2 = ExerciseMapper.INSTANCE.convertToDto(exercise);
			listOfExercises2.add(exercise2);
		}
		
		return listOfExercises2;
	}

	// Method to add a new exercise:
	public ExerciseDto addExercise(ExerciseDto exerciseDto) {
		// Get the ID of the user that is trying to add the exercise:
		Long currentUserId = accountsService.getLoggedInUserId();

		// Retrieve the account associated with the current user
		AccountsModel account = accountsRepository.findById(currentUserId)
				.orElseThrow(() -> new RuntimeException("Account not found"));

		// Convert DTO to model
		ExerciseModel newExercise = ExerciseMapper.INSTANCE.convertToModel(exerciseDto);

		// Set the account in the ExerciseModel
		newExercise.setAccount(account);

		// Save the exercise to the database:
		exerciseRepository.save(newExercise);

		// Convert the saved entity back to DTO and return
		return ExerciseMapper.INSTANCE.convertToDto(newExercise);
	}

	// Method to delete an exercise:
	public ExerciseDto deleteExercise(Long exerciseId) {
		// Get the account ID using JWT:
		Long currentUserId = accountsService.getLoggedInUserId();

		// Get a List exercises that are associated with that user, try to match the
		// exercise ID that was given:
		List<ExerciseModel> exercisesToDelete = exerciseRepository.findByAccountIdAndNotDeleted(currentUserId);

		// Given a list of exercises associated with currently logged in user, mark the
		// exercise deleted if the 'exerciseId' matches exercise_id in DB:
		ExerciseModel deletedExercise = null;
		for (ExerciseModel exercise : exercisesToDelete) {
			Long currentExerciseId = exercise.getExerciseId();
			if (currentExerciseId.equals(exerciseId)) {
				// Set deleted to true
				exercise.setIsDeleted(true);
				deletedExercise = exercise;
				// Save the model in the database
				exerciseRepository.save(exercise);
				break;
			}
		}

		// If no exercise was found to delete, throw an exception or return a message:
		if (deletedExercise == null) {
			throw new RuntimeException(
					"Exercise not found for the current user, or the exercises has already been deleted.");
		}
		
		return ExerciseMapper.INSTANCE.convertToDto(deletedExercise);
	}

	// Method to edit the reps on an exercise:
	public ExerciseDto editReps(Long exerciseId, int setNumber, int newNumberOfReps) {
		// Since the exercise_id is unique; we do not need to worry about who is logged
		// in:
		ExerciseModel exerciseToEditReps = exerciseRepository.findById(exerciseId)
				.orElseThrow(() -> new RuntimeException("Exercise not found"));
		if (setNumber > exerciseToEditReps.sets) {
			throw new RuntimeException("The set that you are attempting to edit does not exist");
		}
		// Edit the reps given the set number: EXAMPLE: Given that we have 3 sets and
		// reps = [1, 2, 3], then we pass in (exerciseId, 2, 4), reps will be [1, 4, 3]
		List<Integer> repsCopy = exerciseToEditReps.getReps();
		repsCopy.set(setNumber - 1, newNumberOfReps);
		exerciseToEditReps.setReps(repsCopy);
		exerciseRepository.save(exerciseToEditReps);
		// Convert to Dto:
		ExerciseDto editedExercise = ExerciseMapper.INSTANCE.convertToDto(exerciseToEditReps);
		return editedExercise;
	}

	// Method to edit the number of sets:
	public ExerciseDto editSets(Long exerciseId, int newNumberOfSets) {
		ExerciseModel exerciseToEditSets = exerciseRepository.findById(exerciseId)
				.orElseThrow(() -> new RuntimeException("Exercise not found"));
		// Set the sets:
		exerciseToEditSets.setSets(newNumberOfSets);
		exerciseRepository.save(exerciseToEditSets);
		// Convert to Dto:
		ExerciseDto editedExercise = ExerciseMapper.INSTANCE.convertToDto(exerciseToEditSets);
		return editedExercise;
	}
	
	// Method to edit exercise name:
	public ExerciseDto editExerciseName(Long exerciseId, String newExerciseName) {
		// Find the exercise:
		ExerciseModel exerciseToEditName = exerciseRepository.findById(exerciseId)
				.orElseThrow(() -> new RuntimeException("Exercise not found"));
		// Set the name of the exercise to the new exercise name:
		exerciseToEditName.setNameOfExercise(newExerciseName);
		// Save the exercise in the database:
		exerciseRepository.save(exerciseToEditName);
		// Covert to DTO and return teh object:
		ExerciseDto editedExercise = ExerciseMapper.INSTANCE.convertToDto(exerciseToEditName);
		return editedExercise;
	}
	
 
	public List<ExerciseDto> findByKeyword(String keyword) {
		// Get the currently logged in user ID:
		Long currentUser = accountsService.getLoggedInUserId();
		// Get a list of exercises from that ID:
		List<ExerciseModel> exercises = exerciseRepository.findByAccountIdAndNotDeleted(currentUser);
		// For each loop that iterates through a list of exercises that have account_id reference that matches above ID:
		List<ExerciseDto> similarExercises = new ArrayList<>();
		for(ExerciseModel exercise : exercises) {
			// if the exercise name has a substring of keyword in it; append it to the similar list
			if(exercise.getNameOfExercise().toLowerCase().contains(keyword.toLowerCase())) {
				// Convert to DTO:
				ExerciseDto exercisesDto = ExerciseMapper.INSTANCE.convertToDto(exercise);
				similarExercises.add(exercisesDto);
			}
		}
		// Return the list of similar exercises:
		return similarExercises;
	}
}
