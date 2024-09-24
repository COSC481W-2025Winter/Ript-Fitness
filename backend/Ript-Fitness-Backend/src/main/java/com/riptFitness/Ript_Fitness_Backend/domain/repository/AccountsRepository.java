package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;


public interface AccountsRepository extends JpaRepository <AccountsModel, Long> { 
	
	// Q1. I need a query that saves an AccountsModel object into the accounts_model table given that the user enteres a username, password, and email
	public AccountsModel saveAccountModel(String username, String password, String email);
	
	// ---------------------------------------------------------------------------------------------------------

	// Q2. I need a query to be written for the below method which returns true or false depending on wether the given username is in the accounts_model database table
	public boolean existsByUsername(String username); // (your query will replace this method)
	
	// ---------------------------------------------------------------------------------------------------------
    
	// Q3. I need a query here that gets the ID based off of the username that is entered in the login page from the accounts_model table in DB
    @Query("")
    Optional<Long> findIdByUsername(@Param("username") String username);

}