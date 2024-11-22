package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.FriendRequest;
import com.riptFitness.Ript_Fitness_Backend.domain.model.RequestStatus;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long>{
	//Takes in fromAccountId and toAccountId and returns the Status row if a relationship exists between the 2
	@Query(value = "SELECT f.status FROM FriendRequest f WHERE f.accountIdOfFromAccount = :fromAccountId AND f.accountIdOfToAccount = :toAccountId")
	Optional<RequestStatus> getStatus(@Param("fromAccountId") Long fromAccountId, @Param("toAccountId") Long toAccountId);
	
	//Returns true if a relationship exists between the Accounts associated with fromAccountId and toAccountId in the Friend Request database table
	boolean existsByAccountIdOfFromAccountAndAccountIdOfToAccount(Long fromAccountId, Long toAccountId);
	
	//Returns a FriendRequest object representing the row in the Friend Request table with the Accounts associated with fromAccountId and toAccountId (returns null if a relationship doesn't exist)
	Optional<FriendRequest> findByAccountIdOfFromAccountAndAccountIdOfToAccount(Long fromAccountId, Long toAccountId);

	//Takes in a fromAccountId and a status String, and returns the toAccountId column of all rows with the Account associated with fromAccountId AND the status equal to the parameter String
	@Query(value = "SELECT f.accountIdOfToAccount FROM FriendRequest f WHERE f.accountIdOfFromAccount = :fromAccountId AND f.status = :status")
	ArrayList<Long> getToAccountFromFromAccountAndStatus(@Param("fromAccountId") Long fromAccountId, @Param("status") RequestStatus status);
}
