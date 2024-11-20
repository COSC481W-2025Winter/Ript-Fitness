package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.FriendRequestRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.FriendRequestDto;

@Service
public class FriendRequestService {

	private FriendRequestRepository friendRequestRepository;
	
	private AccountsRepository accountsRepository;
	
	private AccountsService accountsService;
	
	public FriendRequestService(FriendRequestRepository friendRequestRepository, AccountsRepository accountsRepository, AccountsService accountsService) {
		this.friendRequestRepository = friendRequestRepository;
		this.accountsRepository = accountsRepository;
		this.accountsService = accountsService;
	}
	
	public FriendRequestDto sendRequest(FriendRequestDto friendRequestDto) {
		return friendRequestDto;
	}
	
	public String getStatus(Long toAccountId) {
		Long currentlyLoggedInUserId = accountsService.getLoggedInUserId();
		AccountsModel currentlyLoggedInUser = accountsRepository.findById(currentlyLoggedInUserId).get();
		
		Optional<AccountsModel> optionalToAccountUser = accountsRepository.findById(toAccountId);
		
		if(optionalToAccountUser.isEmpty())
			throw new RuntimeException("The Account with ID = " + toAccountId + " does not exist in the database.");
		
		AccountsModel toAccountUser = optionalToAccountUser.get();
		
		String status = null; // = friendRequestRepository.getStatus(currentlyLoggedInUserId, toAccountId);
		
		return status;
	}
	
	public FriendRequestDto respondToRequest(FriendRequestDto friendRequestDto) {
		return friendRequestDto;
	}
}
