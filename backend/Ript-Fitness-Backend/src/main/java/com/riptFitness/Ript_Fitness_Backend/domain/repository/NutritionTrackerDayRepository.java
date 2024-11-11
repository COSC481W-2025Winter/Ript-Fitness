package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Day;


public interface NutritionTrackerDayRepository extends JpaRepository<Day, Long>{
	@Override
	@Query("SELECT d FROM Day d WHERE d.id = :id AND d.isDeleted = false")
	Optional<Day> findById(@Param("id")Long id);
	
	@Query("SELECT d.id FROM Day d WHERE d.account.id = :accountId AND d.isDeleted = false ORDER BY d.id desc")
	Optional<ArrayList<Long>> getDayIdsFromAccountId(@Param("accountId") Long accountId, @Param("start") int start, @Param("end") int end);
	
}
