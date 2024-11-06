package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.WorkoutsMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.ExerciseModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Workouts;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.ExerciseRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.WorkoutsRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutsDto;

@Service
public class WorkoutsService {

	private WorkoutsRepository workoutsRepository;
	private final AccountsRepository accountsRepository;
	private final ExerciseRepository exerciseRepository;
	private final AccountsService accountsService;
	private final ExerciseService exerciseService;

	public WorkoutsService(WorkoutsRepository workoutsRepository, AccountsService accountsService,
			ExerciseService exerciseService, AccountsRepository accountsRepository,
			ExerciseRepository exerciseRepository) {
		this.workoutsRepository = workoutsRepository;
		this.accountsService = accountsService;
		this.accountsRepository = accountsRepository;
		this.exerciseService = exerciseService;
		this.exerciseRepository = exerciseRepository;
	}

	@Transactional
	public WorkoutsDto addWorkout(WorkoutsDto workoutsDto) {
	    Long currentUserId = accountsService.getLoggedInUserId();
	    AccountsModel account = accountsRepository.findById(currentUserId)
	            .orElseThrow(() -> new RuntimeException("Account not found"));

	    Workouts newWorkout = new Workouts();
	    newWorkout.name = workoutsDto.getName();
	    newWorkout.setAccount(account);

	    if (workoutsDto.getExerciseIds() != null) {
	        List<ExerciseModel> exercises = workoutsDto.getExerciseIds().stream()
	                .map(id -> exerciseRepository.findById(id)
	                        .orElseThrow(() -> new RuntimeException("Exercise not found with ID: " + id)))
	                .collect(Collectors.toList());
	        newWorkout.setExercises(exercises);
	    }

	    workoutsRepository.save(newWorkout);

	    // Fetch the workout again with exercises initialized
	    Workouts savedWorkout = workoutsRepository.findById(newWorkout.workoutsId)
	            .orElseThrow(() -> new RuntimeException("Workout not found after saving"));

	    // Initialize the exercises collection
	    savedWorkout.getExercises().size(); // Forces initialization

	    // Return the mapped savedWorkout instead of newWorkout
	    return WorkoutsMapper.INSTANCE.toWorkoutsDto(savedWorkout);
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

	// Retrieve a single workout object based on a workout Id
	/*
	 * @Transactional public WorkoutsDto updateWorkout(Long workoutId, WorkoutsDto
	 * workoutsDto) { Optional<Workouts> optWorkout =
	 * workoutsRepository.findById(workoutId); if (optWorkout.isEmpty()) { throw new
	 * RuntimeException("no workout found with id = " + workoutId); } Workouts
	 * workoutToBeUpdated = optWorkout.get();
	 * 
	 * // Update basic workout properties
	 * WorkoutsMapper.INSTANCE.updateWorkoutRowFromDto(workoutsDto,
	 * workoutToBeUpdated);
	 * 
	 * // Handle exercises List<ExerciseModel> existingExercises =
	 * workoutToBeUpdated.getExercises();
	 * 
	 * // Clear the existing exercises to avoid transient references if
	 * (existingExercises != null) { existingExercises.clear(); } else {
	 * existingExercises = new ArrayList<>(); }
	 * 
	 * // Add or update exercises from the DTO if (workoutsDto.getExercises() !=
	 * null) { for (ExerciseDto exerciseDto : workoutsDto.getExercises()) {
	 * ExerciseModel exercise = new ExerciseModel();
	 * exercise.setNameOfExercise(exerciseDto.getNameOfExercise());
	 * exercise.setReps(exerciseDto.getReps());
	 * exercise.setSets(exerciseDto.getSets());
	 * exercise.setAccount(workoutToBeUpdated.getAccount()); // Set the managed
	 * account existingExercises.add(exercise); } }
	 * 
	 * workoutToBeUpdated.setExercises(existingExercises);
	 * 
	 * // Save the updated workout entity workoutToBeUpdated =
	 * workoutsRepository.save(workoutToBeUpdated); return
	 * WorkoutsMapper.INSTANCE.toWorkoutsDto(workoutToBeUpdated); }
	 */

	public WorkoutsDto updateWorkout(Long workoutId, WorkoutsDto workoutsDto) {
		Optional<Workouts> optWorkout = workoutsRepository.findById(workoutId);
		if (optWorkout.isEmpty()) {
			throw new RuntimeException("no workout found with id = " + workoutId);
		}
		Workouts workoutToBeUpdated = optWorkout.get();

		// Update basic workout properties
		workoutToBeUpdated.name = workoutsDto.getName();

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
