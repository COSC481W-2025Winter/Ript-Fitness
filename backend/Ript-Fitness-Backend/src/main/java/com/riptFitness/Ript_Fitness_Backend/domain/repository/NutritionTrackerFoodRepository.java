package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Food;

import jakarta.transaction.Transactional;

public interface NutritionTrackerFoodRepository extends JpaRepository<Food, Long> {	
//Queries needed: 
	//Optional<Food> findByName(String foodName): Looks in database for a "Name" equal to "foodName". Returns Optional<Food> object equal to that row if exists. Returns empty Optional<Food> object if it does not exist in DB.
	//Food save(Food foodModel): Saves foodModel to "Food" database table
	
	//findByName currently isn't used, will be kept in Repository class in case anything changes
	@Query("SELECT f FROM Food f WHERE f.name = :name AND f.isDeleted = false")
	Optional<Food> findByName(String name);
	
	 @Modifying
	 @Transactional
	 @Query(value = "INSERT INTO Food (calories, carbs, fat, isDeleted, multiplier, name, protein) VALUES (:calories, :carbs, :fat, :isDeleted, :multiplier, :name, :protein)", nativeQuery = true)
	 void save(@Param("calories") double calories, @Param("carbs") double carbs, @Param("fat") double fat, @Param("isDeleted") boolean isDeleted, @Param("multiplier") double multiplier, @Param("name") String name, @Param("protein") double protein);
	
	
}
