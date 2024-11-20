package com.riptFitness.Ript_Fitness_Backend.web.controller;

import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.FriendsService;

@RestController
@RequestMapping("/friends")
public class FriendsController {

	FriendsService friendsService;

	public FriendsController(FriendsService friendsService) {
		this.friendsService = friendsService;
	}

	@PostMapping("/addFriend/{id}")
	public ResponseEntity<String> addFriend(@PathVariable Long id){
		String returnedString = friendsService.addFriend(id);
		return new ResponseEntity<>(returnedString, HttpStatus.CREATED);
	}

	@GetMapping("/getFriendsListOfCurrentlyLoggedInUser")
	public ResponseEntity<ArrayList<String>> getFriendsListOfCurrentlyLoggedInUser(){
		ArrayList<String> returnedListOfUsernames = friendsService.getFriendsListOfCurrentlyLoggedInUser();
		return new ResponseEntity<>(returnedListOfUsernames, HttpStatus.OK);
	}
	
	@DeleteMapping("/deleteFriend/{id}")
	public ResponseEntity<String> deleteFriend(@PathVariable Long id){
		String returnedString = friendsService.deleteFriend(id);
		return new ResponseEntity<>(returnedString, HttpStatus.OK);
	}
}