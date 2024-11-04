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
	@Override
	@Query("SELECT d FROM Day d WHERE d.id = :id AND d.isDeleted = false")
	Optional<Day> findById(@Param("id")Long id);
	
	@Query("SELECT d.id FROM Day d WHERE d.accountId = :accountId AND d.isDeleted = false")
	Optional<ArrayList<Long>> getPostsFromAccountId(@Param("accountId") Long accountId);
}
