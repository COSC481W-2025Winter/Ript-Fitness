package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.FriendRequest;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long>{

	
	// Takes in fromAccountId and toAccountId and returns the Status row if a relationship exists between the 2
	@Query(value = "SELECT f.status FROM FriendRequest f WHERE f.fromAccountId = :fromAccountID AND f.toAccountId = :toAccountId")
	Optional<String> getStatus(@Param("fromAccountId") Long fromAccountId, @Param("toAccountId") Long toAccountID);
	

}
