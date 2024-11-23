package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.FriendRequest;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.FriendRequestRepository;

@Service
public class FriendsService {
	
	private FriendRequestRepository friendRequestRepository;

	private AccountsRepository accountsRepository;

	private AccountsService accountsService;

	public FriendsService(FriendRequestRepository friendRequestRepository, AccountsRepository accountsRepository, AccountsService accountsService) {
		this.friendRequestRepository = friendRequestRepository;
		this.accountsRepository = accountsRepository;
		this.accountsService = accountsService;
	}

	//Parameter "id" refers to the ID of the friend to be added by the currently logged in user
	public String addFriend(Long id) {
		Long currentlyLoggedInUserId = accountsService.getLoggedInUserId();
		
		if(currentlyLoggedInUserId == id)
			throw new RuntimeException("The ID in the path can't be the same as the currently logged in user.");
		
		AccountsModel currentlyLoggedInUser = accountsRepository.findById(currentlyLoggedInUserId).get();

		Optional<AccountsModel> optionalUserToBeAddedToFriendsList = accountsRepository.findById(id);

		if(optionalUserToBeAddedToFriendsList.isEmpty())
			throw new RuntimeException("An account with the ID of the parameter in the path variable, " + id + ", does not exist in the Account database.");

		AccountsModel userToBeAddedToFriendsList = optionalUserToBeAddedToFriendsList.get();
		
		if(currentlyLoggedInUser.getFriends().contains(userToBeAddedToFriendsList) && userToBeAddedToFriendsList.getFriends().contains(currentlyLoggedInUser))
			throw new RuntimeException("The currently logged in user is already friends with the user with id = " + id);

		currentlyLoggedInUser.getFriends().add(userToBeAddedToFriendsList);
		userToBeAddedToFriendsList.getFriends().add(currentlyLoggedInUser);

		accountsRepository.save(currentlyLoggedInUser);
		accountsRepository.save(userToBeAddedToFriendsList);

		return "The currently logged in user has successfully added the user with ID = " + id + " to their friend's list.";
	}

	public ArrayList<String> getFriendsListOfCurrentlyLoggedInUser(){
		Long currentlyLoggedInUserId = accountsService.getLoggedInUserId();		
		AccountsModel currentlyLoggedInAccount = accountsRepository.findById(currentlyLoggedInUserId).get();
		
		ArrayList<String> listOfUsernamesInCurrentlyLoggedInUsersFriendsList = new ArrayList<String>();
		
		for(AccountsModel accountOfFriend: currentlyLoggedInAccount.getFriends()) {
			listOfUsernamesInCurrentlyLoggedInUsersFriendsList.add(accountOfFriend.getUserProfile().getUsername());
		}
		
		return listOfUsernamesInCurrentlyLoggedInUsersFriendsList;
	}
	
	public ArrayList<String> getFriendsList(Long accountId){
		Optional<AccountsModel> optionalAccount = accountsRepository.findById(accountId);
		
		if(optionalAccount.isEmpty())
			throw new RuntimeException("The account with ID = " + accountId + " could not be found in the AccountsModel database table.");
		
		AccountsModel account = optionalAccount.get();
		
		ArrayList<String> listOfUsernamesInAccountsFriendsList = new ArrayList<String>();
		
		for(AccountsModel accountOfFriend : account.getFriends()) {
			listOfUsernamesInAccountsFriendsList.add(accountOfFriend.getUsername());
		}
		
		return listOfUsernamesInAccountsFriendsList;
	}
	
	public String deleteFriend(Long id) {
		Long currentlyLoggedInUserId = accountsService.getLoggedInUserId();
		
		if(currentlyLoggedInUserId == id) 
			throw new RuntimeException("The ID in the path can't be the same as the currently logged in user.");
		
		AccountsModel currentlyLoggedInUser = accountsRepository.findById(currentlyLoggedInUserId).get();

		Optional<AccountsModel> optionalUserToBeDeletedFromFriendsList = accountsRepository.findById(id);

		if(optionalUserToBeDeletedFromFriendsList.isEmpty())
			throw new RuntimeException("An account with the ID of the parameter in the path variable, " + id + ", does not exist in the Account database.");

		AccountsModel userToBeDeletedFromFriendsList = optionalUserToBeDeletedFromFriendsList.get();

		boolean removedSuccessfullyFromCurrentlyLoggedInUser = currentlyLoggedInUser.getFriends().remove(userToBeDeletedFromFriendsList);
		boolean removedSuccessfullyFromUserWithIdInParameter = userToBeDeletedFromFriendsList.getFriends().remove(currentlyLoggedInUser);
		
		//Both users are friends with each other, delete their relationship in the FriendRequest database table, and take each of them out of the other's friend's list in the AccountsModel database table
		if(removedSuccessfullyFromCurrentlyLoggedInUser || removedSuccessfullyFromUserWithIdInParameter) {
			FriendRequest fromRequest = friendRequestRepository.findByAccountIdOfFromAccountAndAccountIdOfToAccount(currentlyLoggedInUserId, id).get();
			FriendRequest toRequest = friendRequestRepository.findByAccountIdOfFromAccountAndAccountIdOfToAccount(id, currentlyLoggedInUserId).get();
			
			friendRequestRepository.delete(fromRequest);
			friendRequestRepository.delete(toRequest);
			
			accountsRepository.save(currentlyLoggedInUser);
			accountsRepository.save(userToBeDeletedFromFriendsList);
		}
		else {
			throw new RuntimeException("The currently logged in user is not friends with the user with ID = " + id + ". No changes were made to the database with this HTTP request.");
		}
		
		return "The currently logged in user has successfully deleted the user with ID = " + id + " from their friend's list.";
	}
}