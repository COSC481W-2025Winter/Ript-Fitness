package com.riptFitness.Ript_Fitness_Backend.web.controller;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.AccountsService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.AccountsDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.LoginRequestDto;

@RestController // Always put this at he top of the controller class
@RequestMapping("/accounts") // Put this underneath the RestController annotation
public class AccountsController {
	
	public AccountsService accountsService;
	
	public AccountsController(AccountsService accountsService) {
		this.accountsService = accountsService;
	}
	
	// Below is a POST for adding a new object (account) to a database:
	@PostMapping("/createNewAccount")
	public ResponseEntity<AccountsDto> createNewAccount(@RequestBody AccountsDto accountsDto) {
		// Create a new account; createNewAccount() method handles error logic
		AccountsDto newAccountDto = accountsService.createNewAccount(accountsDto);
		return new ResponseEntity<>(newAccountDto, HttpStatus.CREATED);
	}
	
	// Below is a Get for verifying login details
	@GetMapping("/login")
    public ResponseEntity<AccountsDto> login(@RequestBody LoginRequestDto loginRequest) {
        // Extract username and password from the request body
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        LocalDateTime lastLogin = loginRequest.getlastLogin();
        // Attempt to log into the specified account
        AccountsDto accountToLogin = accountsService.logIntoAccount(username, password, lastLogin);
        return new ResponseEntity<>(accountToLogin, HttpStatus.OK);
    }
	
	
	
}






















