package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.util.List;

//Dto is same as the model but doesn't need the @ 
public class WorkoutsDto {
	public Long workoutsId;
	public String name;
	private List<ExerciseDto> exercises;
	public boolean isDeleted = false;
	
	
	public List<ExerciseDto> getExercises() {
		return exercises;
	}
	public void setExercises(List<ExerciseDto> exercises) {
		this.exercises = exercises;
	}
	
	
}
