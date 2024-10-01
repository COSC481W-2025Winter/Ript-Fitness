package com.riptFitness.Ript_Fitness_Backend.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Streak {
	
	//defines the primary key of the table
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	
	//defines the columns in the table
	public int currentSt;
	public int offDays;
	public int goal;
}
