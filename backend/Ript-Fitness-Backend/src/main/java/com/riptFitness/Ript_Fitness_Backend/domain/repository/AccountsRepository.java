package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;

import org.springframework.transaction.annotation.Transactional;


public interface AccountsRepository extends JpaRepository <AccountsModel, Long> { 
	
	// Query that saves an AccountsModel object into the accounts_model table given that the user enters a username, password, and email
	@Modifying
    @Query(value = "INSERT INTO accounts_model (username, password, email, loginDate) VALUES (:username, :password, :email, :loginDate)", nativeQuery = true)
    void saveAccountModel(@Param("username") String username, @Param("password") String password, @Param("email") String email, @Param("loginDate") LocalDateTime loginDate);
	
	//public AccountsModel saveAccountModel(String username, String password, String email, LocalDateTime loginDate);
	
	// ---------------------------------------------------------------------------------------------------------

	// Query which returns true or false depending on whether the given username is in the accounts_model database table
	//public boolean existsByUsername(String username); // (your query will replace this method)
	@Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END FROM accounts_model WHERE username = :username", nativeQuery = true)
	Long existsByUsername(@Param("username") String username);

	
	
	// ---------------------------------------------------------------------------------------------------------
    
	// Query that gets the ID based off of the username that is entered in the login page from the accounts_model table in DB
    @Query(value = "SELECT id FROM accounts_model WHERE username = :username", nativeQuery = true)
    Optional<Long> findIdByUsername(@Param("username") String username);
    

    // ---------------------------------------------------------------------------------------------------------
    
    // Query that resets 'lastLogin' in the database every time that a login has been made (UPDATE) based off of username.
    @Modifying // This is neccesary because we are modifying the database instead of creating something new
    @Transactional // This is required for modifying queries
    @Query(value = "UPDATE accounts_model SET last_login = :lastLogin WHERE username = :username", nativeQuery = true)
    void updateLoginDate(@Param("username") String username, @Param("lastLogin") LocalDateTime lastLogin);
    
    
    
    //@Query("")
    //void updateLoginDate(@Param("username") String username, @Param("lastLogin") LocalDateTime lastLogin);

  
    
    
}