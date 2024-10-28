package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.ExerciseModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;

public interface ExerciseRepository extends JpaRepository <ExerciseModel, Long> {
	
	// Query to retrieve a list of type exercises by account_id where isDeleted is false
    @Query("SELECT e FROM ExerciseModel e WHERE e.currentUserId = :currentUserId AND e.isDeleted = false")
    List<ExerciseModel> findByAccountIdAndNotDeleted(@Param("currentUserId") Long currentUserId);
    
    // Query to retrieve an account model (someones account) given a current user Id that is obtained via JWT token
    @Query("SELECT a FROM AccountsModel a WHERE a.id = :currentUserId")
    Optional<ExerciseModel> findById(@Param("currentUserId") Long currentUserId);
    
}


