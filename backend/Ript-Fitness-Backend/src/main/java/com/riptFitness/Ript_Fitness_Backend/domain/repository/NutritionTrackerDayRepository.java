package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Day;

public interface NutritionTrackerDayRepository extends JpaRepository<Day, Long>{
	//Queries needed: 
		//Optional<Day> findById(Long dayId): Looks in database for an ID equal to "dayId". Returns Optional<Day> object equal to that row if exists. Returns empty Optional<Day> object if it does not exist in DB.
		//Day save(Day dayModel): Saves dayModel to "Dahy" database table
}
