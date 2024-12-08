package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.WorkoutData;

public interface WorkoutDataRepository extends JpaRepository<WorkoutData, Long> {

	// Looks in WorkoutData table for a record with the inputed ID and that is not
	// deleted. If found, Return the row. If not return empty Optional object
	@Override
	@Query("SELECT i FROM WorkoutData i WHERE i.dataId = :dataId AND i.isDeleted = false")
	Optional<WorkoutData> findById(@Param("dataId") Long dataId);

	// Looks for all workoutData with the Id of the current user and returns a list of
	// all that user's workout data
	@Query("SELECT i FROM WorkoutData i WHERE i.account.id = :currentUserId AND i.isDeleted = false ORDER BY i.dataId DESC")
	List<WorkoutData> findByAccountId(@Param("currentUserId") Long currentUserId);

	List<WorkoutData> findByAccountIdAndExerciseName(Long currentUserId, String exerciseName);
}
