package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.riptFitness.Ript_Fitness_Backend.domain.model.WorkoutData;

public interface WorkoutDataRepository extends JpaRepository <WorkoutData, Long> {

	List<WorkoutData> findByAccountId(Long currentUserId);
	
	List<WorkoutData> findByAccountIdAndExerciseName(Long currentUserId, String exerciseName);
}
