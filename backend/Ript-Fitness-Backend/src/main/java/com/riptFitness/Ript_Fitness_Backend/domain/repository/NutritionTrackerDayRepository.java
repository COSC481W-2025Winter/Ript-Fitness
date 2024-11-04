package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Day;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Food;

import jakarta.transaction.Transactional;

public interface NutritionTrackerDayRepository extends JpaRepository<Day, Long>{
	//Queries needed: 
		//Optional<Day> findById(Long dayId): Looks in database for an ID equal to "dayId". Returns Optional<Day> object equal to that row if exists. Returns empty Optional<Day> object if it does not exist in DB.
		//Day save(Day dayModel): Saves dayModel to "Dahy" database table
	
	@Override
	@Query("SELECT d FROM Day d WHERE d.id = :id AND d.isDeleted = false")
	Optional<Day> findById(@Param("id")Long id);
	
	 @Modifying
	 @Transactional
	 @Query(value = "INSERT INTO Day (calories, foodIdsInFoodsEatenInDayList, foodsEatenInDay, isDeleted, totalCarbs, totalFat, totalProtein, totalWaterConsumed) VALUES (:calories, :foodIdsInFoodsEatenInDayList, :foodsEatenInDay, :id, :isDeleted, :totalCarbs, :totalFat, :totalProtein, :totalWaterConsumed)", nativeQuery = true)
	 void save(@Param("calories") double calories, 
			   @Param("totalCarbs") double totalCarbs,
			   @Param("totalProtein") double totalProtein,
			   @Param("totalFat") double totalFat,
			   @Param("isDeleted") boolean isDeleted, 
			   @Param("totalWaterConsumed") int totalWaterConsumed,
			   @Param("foodIdsInFoodsEatenInDayList") List<Long> foodIdsInFoodsEatenInDayList); 
			   //@Param("foodsEatenInDay") int foodsEatenInDay);
	

}
