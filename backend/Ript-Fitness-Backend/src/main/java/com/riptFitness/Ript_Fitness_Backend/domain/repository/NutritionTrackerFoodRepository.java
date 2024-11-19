package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.Optional;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Food;

public interface NutritionTrackerFoodRepository extends JpaRepository<Food, Long> {	
//Queries needed: 
	//Optional<Food> findByName(String foodName): Looks in database for a "Name" equal to "foodName". Returns Optional<Food> object equal to that row if exists. Returns empty Optional<Food> object if it does not exist in DB.
	//Food save(Food foodModel): Saves foodModel to "Food" database table
	
	//findByName currently isn't used, will be kept in Repository class in case anything changes
	//@Query("SELECT f FROM Food f WHERE f.name = :name AND f.isDeleted = false")
	//Optional<Food> findByName(String name);
	
	@Override
	@Query("SELECT f FROM Food f WHERE f.id = :id AND f.isDeleted = false")
	Optional<Food> findById(@Param("id")Long id);
	
	@Query("SELECT f FROM Food f WHERE f.accountId = :accountId AND f.isDeleted = false")
	Optional<ArrayList<Food>> getFoodsFromAccountId(@Param("accountId") Long accountId);
}
