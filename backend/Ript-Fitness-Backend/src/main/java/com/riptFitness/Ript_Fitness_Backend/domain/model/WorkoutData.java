package com.riptFitness.Ript_Fitness_Backend.domain.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity // Creates a database table with the name below and the columns equal to the variable
@Table(name = "workouts")
public class WorkoutData {

	@Id //Declares this variable the primary key in the table
	@GeneratedValue(strategy = GenerationType.IDENTITY) //Auto-increments the id
	private Long dataId;
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountsModel account;

	
	private String exerciseName;
	private List<Integer> reps;
	private List<Integer> weight;	
	private boolean isDeleted = false;
	
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
	public AccountsModel getAccount() {
		return account;
	}
	public void setAccount(AccountsModel account) {
		this.account = account;
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
