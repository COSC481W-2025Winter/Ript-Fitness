package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Workouts;

public class ExerciseDto {

	public Long exerciseId;
	public int sets;
	public List<Integer> reps; // List to store the number of reps per set
	public boolean isDeleted = false; // False to start because true means the exercisde is deleted.
	private List<Integer> weight;
	public String nameOfExercise;
	private String description;
    private int exerciseType;

	// Reference to the users account (AccountsModel)
	public Long accountReferenceId; // Reference to the account that owns this exercise

	// We also will need a reference to the workout model: (UNCOMMENT BELOW ONCE
	// CHRIS IS DONE) Note: for Nate, Uncommenting this cause a infinite loop in a
	// return statement.
	// public Workouts workout;

	// Getters and Setters
	public String getDescription() {
    	return description;
    }
    
    public void setDescription(String description) {
    	this.description = description;
    }
    
    public int getExerciseType() {
    	return exerciseType;
    }
    
    public void setExerciseType(int exerciseType) {
    	this.exerciseType = exerciseType;
    }
    
	public Long getExerciseId() {
		return exerciseId;
	}

	public void setExerciseId(Long exerciseId) {
		this.exerciseId = exerciseId;
	}

	public int getSets() {
		return sets;
	}

	public void setSets(int sets) {
		this.sets = sets;
	}

	public List<Integer> getReps() {
		return reps;
	}

	public void setReps(List<Integer> reps) {
		this.reps = reps;
	}

	@JsonProperty("weight")
	public List<Integer> getWeight() {
		return weight;
	}

	@JsonProperty("weight")
	public void setWeight(List<Integer> weight) {
		this.weight = weight;
	}

	public String getNameOfExercise() {
		return nameOfExercise;
	}

	public void setNameOfExercise(String nameOfExercise) {
		this.nameOfExercise = nameOfExercise;
	}

	public Long getAccountReferenceId() {
		return accountReferenceId;
	}

	public void setAccountReferenceId(Long accountReferenceId) {
		this.accountReferenceId = accountReferenceId;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

	// Optional WorkoutId field
	// public Long getWorkoutId() {
	// return workoutId;
	// }

	// public void setWorkoutId(Long workoutId) {
	// this.workoutId = workoutId;
	// }
}