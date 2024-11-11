package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.util.List;

public class WorkoutDataDto {
	
	private Long dataId;
	private String exerciseName;
	private List<Integer>  reps;
	private List<Integer> weight;
	private boolean isDeleted = false;
	private Long accountId;
	public Long getDataId() {
		return dataId;
	}
	public void setDataId(Long dataId) {
		this.dataId = dataId;
	}
	public String getExerciseName() {
		return exerciseName;
	}
	public void setExerciseName(String exerciseName) {
		this.exerciseName = exerciseName;
	}
	public boolean isDeleted() {
		return isDeleted;
	}
	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}
	public Long getAccountId() {
		return accountId;
	}
	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}
	public List<Integer> getReps() {
		return reps;
	}
	public void setReps(List<Integer> reps) {
		this.reps = reps;
	}
	public List<Integer> getWeight() {
		return weight;
	}
	public void setWeight(List<Integer> weight) {
		this.weight = weight;
	}
	
	

}
