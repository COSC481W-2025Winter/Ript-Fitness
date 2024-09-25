package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Food;

public interface NutritionTrackerFoodRepository extends JpaRepository<Food, Long> {	
//Queries needed: 
	//Optional<Food> findByName(String foodName): Looks in database for a "Name" equal to "foodName". Returns Optional<Food> object equal to that row if exists. Returns empty Optional<Food> object if it does not exist in DB.
	//Food save(Food foodModel): Saves foodModel to "Food" database table
}
