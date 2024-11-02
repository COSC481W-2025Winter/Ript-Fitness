package com.riptFitness.Ript_Fitness_Backend.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.UserProfileService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.UserDto;

@RestController
@RequestMapping("/userProfile") // base URL for all user profile endpoints
public class UserProfileController {

	private final UserProfileService userProfileService;

	public UserProfileController(UserProfileService userProfileService) {
		this.userProfileService = userProfileService;
	}

	private String getUsernameFromContext() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return authentication.getName(); // Username from JWT token
	}

	@PostMapping("/addUser")
	public ResponseEntity<UserDto> addUser(@RequestBody UserDto userDto) {
	    String username = getUsernameFromContext(); // Get username from the authenticated user
	    UserDto savedUserObject = userProfileService.addUser(userDto, username);
	    return new ResponseEntity<>(savedUserObject, HttpStatus.CREATED);
	}

	// GET localhost:8080/userProfile/getUserProfile
	@GetMapping("/getUserProfile")
	public ResponseEntity<UserDto> getUserProfile() {
		String username = getUsernameFromContext();
		UserDto returnedUserObject = userProfileService.getUserByUsername(username);
		return ResponseEntity.ok(returnedUserObject);
	}

	// PUT localhost:8080/userProfile/updateUserProfile
	@PutMapping("/updateUserProfile")
	public ResponseEntity<UserDto> updateUserProfile(@RequestBody UserDto userDto) {
		String username = getUsernameFromContext();
		UserDto updatedUserObject = userProfileService.updateUserByUsername(username, userDto);
		return ResponseEntity.ok(updatedUserObject);
	}

	// DELETE localhost:8080/userProfile/deleteUserProfile
	@DeleteMapping("/deleteUserProfile")
	public ResponseEntity<UserDto> deleteUserProfile() {
		String username = getUsernameFromContext();
		UserDto deletedUserObject = userProfileService.softDeleteUserByUsername(username);
		return ResponseEntity.ok(deletedUserObject);
	}
}
