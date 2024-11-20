package com.riptFitness.Ript_Fitness_Backend.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.FriendRequestService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.FriendRequestDto;

@RestController
@RequestMapping("/friendRequest")
public class FriendRequestController {

	private FriendRequestService friendRequestService;
	
	public FriendRequestController(FriendRequestService friendRequestService) {
		this.friendRequestService = friendRequestService;
	}
	
	@PostMapping("/send")
	public ResponseEntity<FriendRequestDto> sendRequest(@RequestBody FriendRequestDto friendRequestDto){
		FriendRequestDto savedFriendRequestDto = friendRequestService.sendRequest(friendRequestDto);
		return new ResponseEntity<>(savedFriendRequestDto, HttpStatus.CREATED);
	}
	
	@GetMapping("/getStatus/{toAccountId}")
	public ResponseEntity<String> getStatus(@PathVariable Long toAccountId){
		String returnedStatusString = friendRequestService.getStatus(toAccountId);
		return new ResponseEntity<>(returnedStatusString, HttpStatus.OK);
	}
	
	@PutMapping("/respond")
	public ResponseEntity<FriendRequestDto> respondToRequest(@RequestBody FriendRequestDto friendRequestDto){
		FriendRequestDto savedFriendRequestDto = friendRequestService.respondToRequest(friendRequestDto);
		return new ResponseEntity<>(savedFriendRequestDto, HttpStatus.OK);
	}
}
