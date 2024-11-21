package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;

@Service
public class FriendsService {

	private AccountsRepository accountsRepository;

	private AccountsService accountsService;

	public FriendsService(AccountsRepository accountsRepository, AccountsService accountsService) {
		this.accountsRepository = accountsRepository;
		this.accountsService = accountsService;
	}

	//Parameter "id" refers to the ID of the friend to be added by the currently logged in user
	public String addFriend(Long id) {
		Long currentlyLoggedInUserId = accountsService.getLoggedInUserId();
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
			listOfUsernamesInCurrentlyLoggedInUsersFriendsList.add(accountOfFriend.getUserProfile().username);
		}
		
		return listOfUsernamesInCurrentlyLoggedInUsersFriendsList;
	}
	
	public String deleteFriend(Long id) {
		Long currentlyLoggedInUserId = accountsService.getLoggedInUserId();
		AccountsModel currentlyLoggedInUser = accountsRepository.findById(currentlyLoggedInUserId).get();

		Optional<AccountsModel> optionalUserToBeDeletedFromFriendsList = accountsRepository.findById(id);

		if(optionalUserToBeDeletedFromFriendsList.isEmpty())
			throw new RuntimeException("An account with the ID of the parameter in the path variable, " + id + ", does not exist in the Account database.");

		AccountsModel userToBeDeletedFromFriendsList = optionalUserToBeDeletedFromFriendsList.get();

		boolean removedSuccessfullyFromCurrentlyLoggedInUser = currentlyLoggedInUser.getFriends().remove(userToBeDeletedFromFriendsList);
		boolean removedSuccessfullyFromUserWithIdInParameter = userToBeDeletedFromFriendsList.getFriends().remove(currentlyLoggedInUser);
		
		if(removedSuccessfullyFromCurrentlyLoggedInUser || removedSuccessfullyFromUserWithIdInParameter) {
			accountsRepository.save(currentlyLoggedInUser);
			accountsRepository.save(userToBeDeletedFromFriendsList);
		}
		else {
			throw new RuntimeException("The currently logged in user is not friends with the user with ID = " + id + ". No changes were made to the database with this HTTP request.");
		}
		
		return "The currently logged in user has successfully deleted the user with ID = " + id + " from their friend's list.";
	}
}