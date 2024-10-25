package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.ExerciseModel;

public interface ExerciseRepository extends JpaRepository <ExerciseModel, Long> {
	
	// Query to retrieve a list of type exercises by account_id where isDeleted is false
    @Query("")
    List<ExerciseModel> findByAccountIdAndNotDeleted(Long currentUserId);
    
    // Query to retrieve an account model (someones account) given a current user Id that is obtained via JWT token
    @Query("")
    Optional<ExerciseModel> findById(Long currentUserId);
}


