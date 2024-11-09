package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.JwtUtil;
import com.riptFitness.Ript_Fitness_Backend.domain.mapper.AccountsMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Streak;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.StreakRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.AccountsDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.LoginRequestDto;

@Service
public class AccountsService {
	// Create an instance of the repository layer:
	@Autowired
	public AccountsRepository accountsRepository;
	@Autowired
	public StreakRepository streakRepository;
	private final PasswordEncoder passwordEncoder;
	@Autowired
	private JwtUtil jwtUtil;

	// Constructor:
	public AccountsService(AccountsRepository accountsRepository, StreakRepository streakRepository,
			PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
		this.accountsRepository = accountsRepository;
		this.streakRepository = streakRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtUtil = jwtUtil;
	}

	// Method to retrieve the logged-in user's ID
	public Long getLoggedInUserId() {
		// Get the principal (logged-in user) from the security context
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		if (principal instanceof UserDetails) {
			String username = ((UserDetails) principal).getUsername(); // Get the logged-in user's username

			// Query the AccountsRepository to get the user based on the username
			AccountsModel account = accountsRepository.findByUsername(username)
					.orElseThrow(() -> new RuntimeException("User not found with username: " + username));

			// Return the ID of the logged-in user
			return account.getId();
		} else {
			throw new RuntimeException("No authenticated user found.");
		}
	}

	@Transactional
	public String updatePassword(String currentPassword, String newPassword) {
		// Get the associated account:
		AccountsModel accountsModel = accountsRepository.findById(getLoggedInUserId())
				.orElseThrow(() -> new RuntimeException("Account not found!"));
		
		// Check to see if the current password doesnt match the one in the DB:
		if(!passwordEncoder.matches(currentPassword, accountsModel.getPassword())) {
			throw new RuntimeException("Current password does not match");
		}
		
		// Encode the password:
		String encodedPassword = passwordEncoder.encode(newPassword);

		// Set the password:
		accountsModel.setPassword(encodedPassword);

		// Save the model:
		accountsRepository.save(accountsModel);
		
		// Generate a JWT token and return it
		String token = jwtUtil.generateToken(accountsModel.getUsername());
		System.out.println("Password change succesfull for: " + accountsModel.getUsername());
		
		// Return the token:
		return token;
	}

	// Below is the logic for creating an account:
	public String createNewAccount(AccountsDto accountsDto) {
		// Convert DTO to model:
		AccountsModel accountsModel = AccountsMapper.INSTANCE.convertToModel(accountsDto);
		// Get the username:
		String username = accountsModel.getUsername();
		// Get the email:
		String email = accountsModel.getEmail();
		// Check to see if the username already exists:
		Long usernameCount = accountsRepository.existsByUsername(username);
		// Check to see if the email is already in use:
		Long emailCount = accountsRepository.existsByEmail(email);
		if (usernameCount > 0 || emailCount > 0) {
			// If the username or email alrteady exists, we need to throw an error code:
			throw new RuntimeException("Username is already taken.");
		}
		else {
			// If the username or email does not exist; allow the user to create an account.
			// Encode and set password:
			String rawPassword = accountsModel.getPassword();
			String encodedPassword = passwordEncoder.encode(rawPassword);
			accountsModel.setPassword(encodedPassword);
			// Encode and set email.
			String rawEmail = accountsModel.getEmail();
			String encodedEmail = passwordEncoder.encode(rawEmail);
			accountsModel.setEmail(encodedEmail);
			accountsRepository.save(accountsModel);

			// creating a corresponding streak for the account
			Streak streak = new Streak();
			streak.account = accountsModel; // Associate the streak with the account
			streak.currentSt = 0; // Initialize streak count to 0
			streak.prevLogin = LocalDateTime.now();
			streakRepository.save(streak);

		}
		// Generate a JWT token for the newly created account:
		String token = jwtUtil.generateToken(username);

		// Return the token as the response:
		return token;
	}

	// Method to get account details:
	@Transactional
	public String logIntoAccount(LoginRequestDto loginRequest) {
		// Extract username and password from the request body
		String username = loginRequest.getUsername();
		String password = loginRequest.getPassword();
		LocalDateTime lastLogin = loginRequest.getlastLogin();

		// Get the ID via username
		Optional<Long> optionalId = accountsRepository.findIdByUsername(username);

		// Check if the optional has something in it with .isPresent()
		if (optionalId.isPresent()) {
			// Store the ID in a variable to be used later
			Long id = optionalId.get();

			// Retrieve the account using the ID
			AccountsModel possibleAccount = accountsRepository.findById(id)
					.orElseThrow(() -> new RuntimeException("Username does not exist."));
			// Verify the password using Argon2
			String encodedPassword = possibleAccount.getPassword();
			boolean passwordMatches = passwordEncoder.matches(password, encodedPassword);

			// Verify the password
			if (passwordMatches) {
				// Update the login date:
				accountsRepository.updateLoginDate(username, lastLogin);

				// Generate a JWT token and return it
				String token = jwtUtil.generateToken(username);
				System.out.println("Login successful for user: " + username);
				return token;

			} else {
				System.out.println("Incorrect password for user: " + username);
				throw new RuntimeException("Incorrect password.");
			}
		} else {
			throw new RuntimeException("Username does not exist.");
		}

	}

}