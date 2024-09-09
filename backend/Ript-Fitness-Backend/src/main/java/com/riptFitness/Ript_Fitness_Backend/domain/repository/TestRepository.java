package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.riptFitness.Ript_Fitness_Backend.domain.model.TestModel;

// The Jpa Repository has CRUD methods such as save(), delete() and findById()

// "<TestModel, Long>" represent the type that the repository will handle (TestModel) and the type of the 
//		primary key (Long). Each TestModel can be uniquely identified by a Long ID.


public interface TestRepository extends JpaRepository <TestModel, Long> { 
	//Put database stuff in here!

}
