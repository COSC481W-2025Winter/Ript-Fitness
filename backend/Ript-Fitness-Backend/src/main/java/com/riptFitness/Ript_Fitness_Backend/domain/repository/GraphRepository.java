package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Graph;

public interface GraphRepository extends JpaRepository<Graph, Long>{
	@Query("SELECT g FROM Graph g WHERE g.account.id = :accountId AND g.isDeleted = false")
	Optional<ArrayList<Graph>> getGraphsFromCurrentlyLoggedInUser(@Param("accountId") Long accountId);
	
	@Query("SELECT g FROM Graph g WHERE g.title = :title AND g.account.id = :accountId AND g.isDeleted = false")
	Optional<Graph> findByTitle(@Param("title") String title, @Param("accountId") Long accountId);
}
