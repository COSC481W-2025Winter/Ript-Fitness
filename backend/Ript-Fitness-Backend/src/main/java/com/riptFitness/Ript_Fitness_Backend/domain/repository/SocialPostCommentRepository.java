package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Day;
import com.riptFitness.Ript_Fitness_Backend.domain.model.SocialPostComment;

public interface SocialPostCommentRepository extends JpaRepository <SocialPostComment, Long>{

	@Override
	@Query("SELECT s FROM SocialPostComment s WHERE s.id = :id AND s.isDeleted = false")
	Optional<SocialPostComment> findById(@Param("id") Long id);

}
