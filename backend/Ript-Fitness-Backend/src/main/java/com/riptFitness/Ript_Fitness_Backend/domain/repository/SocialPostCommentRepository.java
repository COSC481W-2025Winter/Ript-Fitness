package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Day;
import com.riptFitness.Ript_Fitness_Backend.domain.model.SocialPostComment;

public interface SocialPostCommentRepository extends JpaRepository <SocialPostComment, Long>{

	@Override
	@Query("SELECT d FROM Day d WHERE d.id = :id AND d.isDeleted = false")
	Optional<SocialPostComment> findById(@Param("socialPostCommentId") Long socialPostCommentId);

}
