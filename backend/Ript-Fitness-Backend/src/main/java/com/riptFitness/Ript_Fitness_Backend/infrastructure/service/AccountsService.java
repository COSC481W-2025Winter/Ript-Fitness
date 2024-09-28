package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.AccountsMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.AccountsDto;

@Service 
public class AccountsService {
	// Create an instance of the repository layer:
	@Autowired
	public AccountsRepository accountsRepository;
	
	// Constructor:
	public AccountsService(AccountsRepository accountsRepository) {
		this.accountsRepository = accountsRepository;
	}

	
	
	// List of methods that we need for the Create an account / Log in page:
	//	1. Create a new account
	//		- Check to see if an account with the user name that the user is attempting to make an account with already exits.
	//		- If the user name is already in use, display a message to either login or try another name
	//		- If the user name is "free" allow user to create the account
	
	//  2. Log in page
	//		- Ask for a user name and a password, check if the user name exists.
	//		- If user name exists, check password. If password matches, allow log in.
	//		- If the password does not match, display a error message.
	//		- If user name does not exist, display a message that it does not exist. Ask if they would like to create an account with that user name
	
	
	// Below is the logic for creating an account:
	public AccountsDto createNewAccount(AccountsDto accountsDto) {
		// Convert DTO to model:
		AccountsModel accountsModel = AccountsMapper.INSTANCE.convertToModel(accountsDto);
		// Get the username:
		String username = accountsModel.getUsername();
		// Check to see if the username already exists:
		boolean usernameExists = accountsRepository.existsByUsername(username);
		if (usernameExists) {
		    // If the username exists, we need to throw an error code:
			throw new RuntimeException("The username: '" + username + "' already has an account associated with it");
		} else {
		// If the username does not exist; allow the user to create an account:
			accountsRepository.save(accountsModel);
		}
		return AccountsMapper.INSTANCE.convertToDto(accountsModel);
	}
	
	
	
	
	// Method to get account details:
	public AccountsDto logIntoAccount(String username, String password, LocalDateTime lastLogin) {
	    // Get the ID via username
	    Optional<Long> optionalId = accountsRepository.findIdByUsername(username);
	    
	    // Check if the optional has something in it with .isPresent()
	    if (optionalId.isPresent()) {
	    	// Store the ID in a variable to be used later
	        Long id = optionalId.get();

	        // Retrieve the account using the ID
	        AccountsModel possibleAccount = accountsRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Account with username: '" 
	            							  + username + "' does not exist..."));
	        // Verify the password
	        if (possibleAccount.getPassword().equals(password)) {
	        	// Update the login date:
	        	accountsRepository.updateLoginDate(username, lastLogin);
	        	// Convert to DTO:
	            System.out.println("Login successful for user: " + username);
	            return AccountsMapper.INSTANCE.convertToDto(possibleAccount);
	        } else {
	            System.out.println("Incorrect password for user: " + username);
	            throw new RuntimeException("The password: '" + password + "' is incorrect");
	        }
	    } else {
	    	throw new RuntimeException("Account with username: '" 
					  + username + "' does not exist...");
	    }
	}

}
























