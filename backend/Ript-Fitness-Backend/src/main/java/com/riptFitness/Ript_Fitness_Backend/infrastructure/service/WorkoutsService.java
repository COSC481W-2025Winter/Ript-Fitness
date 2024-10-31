package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.ExerciseMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.mapper.WorkoutsMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.ExerciseModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Workouts;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.WorkoutsRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.ExerciseDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutsDto;

@Service
public class WorkoutsService {

	private WorkoutsRepository workoutsRepository;
	private final AccountsRepository accountsRepository;
	private final AccountsService accountsService;

	public WorkoutsService(WorkoutsRepository workoutsRepository, AccountsService accountsService,
			AccountsRepository accountsRepository) {
		this.workoutsRepository = workoutsRepository;
		this.accountsService = accountsService;
		this.accountsRepository = accountsRepository;
	}

	// Method adds a new Workout.
	public WorkoutsDto addWorkout(WorkoutsDto workoutsDto) {

		Workouts newWorkout = WorkoutsMapper.INSTANCE.toWorkouts(workoutsDto);
		// gets the current user's id and associates it with the workout or it throws an
		// exception
		Long currentUserId = accountsService.getLoggedInUserId();
		AccountsModel account = accountsRepository.findById(currentUserId)
				.orElseThrow(() -> new RuntimeException("Account not found"));

		newWorkout.setAccount(account);

		// Set the account and workout reference for each exercise in the workout
		if (newWorkout.getExercises() != null) {
			newWorkout.getExercises().forEach(exercise -> {
				exercise.setAccount(account); // Set the account for each exercise
			});
		}

		workoutsRepository.save(newWorkout);
		return WorkoutsMapper.INSTANCE.toWorkoutsDto(newWorkout);
	}

	// Retrieve a single workout object based on a workout Id
	@Transactional
	public WorkoutsDto getWorkout(Long workoutId) {
		Optional<Workouts> optionalWrkout = workoutsRepository.findById(workoutId);
		if (optionalWrkout.isEmpty()) {
			throw new RuntimeException("No workout found with id = " + workoutId);
		}
		Workouts workout = optionalWrkout.get();
		return WorkoutsMapper.INSTANCE.toWorkoutsDto(workout);

	}

	// Retrieves a list of workouts that have the foreign key of the current user
	public List<WorkoutsDto> getUsersWorkouts() {
		Long currentUserId = accountsService.getLoggedInUserId();
		AccountsModel account = accountsRepository.findById(currentUserId)
				.orElseThrow(() -> new RuntimeException("Account not found"));
		List<Workouts> workouts = workoutsRepository.findByAccountId(currentUserId);

		return WorkoutsMapper.INSTANCE.toListWorkoutsDto(workouts);
	}

	// updates a specific workouts row in the workouts table and returns the
	// updatedWorkout object
	@Transactional
	public WorkoutsDto updateWorkout(Long workoutId, WorkoutsDto workoutsDto) {
		Optional<Workouts> optWorkout = workoutsRepository.findById(workoutId);
		if (optWorkout.isEmpty()) {
			throw new RuntimeException("no workout found with id = " + workoutId);
		}
		Workouts workoutToBeUpdated = optWorkout.get();

		// Update basic workout properties
	    WorkoutsMapper.INSTANCE.updateWorkoutRowFromDto(workoutsDto, workoutToBeUpdated);

	    // Handle exercises
	    List<ExerciseModel> existingExercises = workoutToBeUpdated.getExercises();
	    
	    // Clear the existing exercises to avoid transient references
	    if (existingExercises != null) {
	        existingExercises.clear();
	    } else {
	        existingExercises = new ArrayList<>();
	    }

	    // Add or update exercises from the DTO
	    if (workoutsDto.getExercises() != null) {
	        for (ExerciseDto exerciseDto : workoutsDto.getExercises()) {
	            ExerciseModel exercise = new ExerciseModel();
	            exercise.setNameOfExercise(exerciseDto.getNameOfExercise());
	            exercise.setReps(exerciseDto.getReps());
	            exercise.setSets(exerciseDto.getSets());
	            exercise.setAccount(workoutToBeUpdated.getAccount()); // Set the managed account
	            existingExercises.add(exercise);
	        }
	    }

	    workoutToBeUpdated.setExercises(existingExercises);

		// Save the updated workout entity
		workoutToBeUpdated = workoutsRepository.save(workoutToBeUpdated);
		return WorkoutsMapper.INSTANCE.toWorkoutsDto(workoutToBeUpdated);
	}

	public WorkoutsDto deleteWorkout(Long workoutId) {
		Optional<Workouts> optWorkoutToBeDeleted = workoutsRepository.findById(workoutId);

		if (optWorkoutToBeDeleted.isEmpty()) {
			throw new RuntimeException("Workouts object not found in database with id = " + workoutId);
		}
		Workouts workoutToBeDeleted = optWorkoutToBeDeleted.get();
		workoutToBeDeleted.isDeleted = true;
		workoutsRepository.save(workoutToBeDeleted);
		return WorkoutsMapper.INSTANCE.toWorkoutsDto(workoutToBeDeleted);
	}

}
