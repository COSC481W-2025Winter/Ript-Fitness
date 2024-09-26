package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;

import jakarta.transaction.Transactional;


public interface AccountsRepository extends JpaRepository <AccountsModel, Long> { 
	
	// Q1. I need a query that saves an AccountsModel object into the accounts_model table given that the user enteres a username, password, and email
	public AccountsModel saveAccountModel(String username, String password, String email, LocalDateTime loginDate);
	
	// ---------------------------------------------------------------------------------------------------------

	// Q2. I need a query to be written for the below method which returns true or false depending on wether the given username is in the accounts_model database table
	public boolean existsByUsername(String username); // (your query will replace this method)
	
	// ---------------------------------------------------------------------------------------------------------
    
	// Q3. I need a query here that gets the ID based off of the username that is entered in the login page from the accounts_model table in DB
    @Query("")
    Optional<Long> findIdByUsername(@Param("username") String username);

    // ---------------------------------------------------------------------------------------------------------
    
    // Q4. I need a query that resets 'lastLogin' in the database every time that a login has been made (UPDATE) based off of username.
    @Modifying // This is neccesary because we are modifying the database instead of creating something new
    @Transactional // This is required for modifying queries
    @Query("")
    void updateLoginDate(@Param("username") String username, @Param("lastLogin") LocalDateTime lastLogin);

}