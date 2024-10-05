package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Streak;

public interface StreakRepository extends JpaRepository <Streak, Long> {
	

}
