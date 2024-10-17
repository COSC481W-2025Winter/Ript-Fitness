package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.transaction.annotation.Transactional;

import com.riptFitness.Ript_Fitness_Backend.domain.model.ExerciseModel;

public interface ExerciseRepository extends JpaRepository <ExerciseModel, Long> {
	
}


