package com.riptFitness.Ript_Fitness_Backend.domain.model;

import org.springframework.data.annotation.Id;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;


// TODO: Add the following fields to the class:
// - ExerciseID (auto incerment) *
// - sets *
// - reps *
// - weight *
// - nameOfExercise *
// - reference_user_id *
// - refernce_workout_id (set after the workout has been set) * 
@Entity
@Table(name = "exercise_model")
public class ExerciseModel {
	
	@Id // Primary Key (ID for exercise object)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long exerciseId;
	
	public int sets;
	public int reps;
	// private int weight; Not sure what to do with this yet; may use later.
	public String nameOfExercise;
	
	// Reference to the users account (to get the ID of the account)
	@ManyToOne
	@JoinColumn(name = "account_id") // Creates a foriegn key column in the exercise table
	public Long accountReferenceId; // Reference to the account that owns this exercise
	
	// We also will need a reference to the workout model: (UNCOMMENT BELOW ONCE CHRIS IS DONE)
	//@ManyToOne
	//@JoinColumn(name = "workout_id")
	//public WorkoutModel workout;

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

	public int getReps() {
		return reps;
	}

	public void setReps(int reps) {
		this.reps = reps;
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

	


	
	

}
