package com.riptFitness.Ript_Fitness_Backend.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class TestModel {
	
	@Id	//This means this is the primary key of the TestModel database table
	public Long id;
	
	public String firstName;
	public String lastName;
}
