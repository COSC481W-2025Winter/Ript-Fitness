package com.riptFitness.Ript_Fitness_Backend.infrastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.AccountsService;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.FriendsService;

public class FriendsServiceTest {

	@Mock
	private AccountsRepository accountsRepository;
	
	@Mock
	private AccountsService accountsService;
	
	@InjectMocks
	private FriendsService friendsService;
	
	private AccountsModel currentlyLoggedInUser;
	private AccountsModel friendOfCurrentlyLoggedInUser;
	
	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
		
		currentlyLoggedInUser = new AccountsModel();
		friendOfCurrentlyLoggedInUser = new AccountsModel();
		
		currentlyLoggedInUser.setFriends(new ArrayList<AccountsModel>());
		friendOfCurrentlyLoggedInUser.setFriends(new ArrayList<AccountsModel>());
	}
	
	@Test
	void testAddFriendValid() {
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(accountsRepository.findById(1L)).thenReturn(Optional.of(currentlyLoggedInUser));
		when(accountsRepository.findById(2L)).thenReturn(Optional.of(friendOfCurrentlyLoggedInUser));
		
		String result = friendsService.addFriend(2L);
		
		assertNotNull(result);
		assertEquals(result, "The currently logged in user with ID = 1 has successfully added the user with ID = 2 to their friend's list.");
	}
	
	@Test
	void testAddFriendInvalidRequestAccountWithIdEqualToPathVariableDoesNotExist() {
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(accountsRepository.findById(1L)).thenReturn(Optional.of(currentlyLoggedInUser));
		when(accountsRepository.findById(2L)).thenReturn(Optional.empty());

		RuntimeException exceptionThrown = assertThrows(RuntimeException.class, () -> {
			friendsService.addFriend(2L);
		});
		
		assertEquals(exceptionThrown.getMessage(), "An account with the ID of the parameter in the path variable, 2, does not exist in the Account database.");
	}
	
	@Test
	void testAddFriendInvalidRequestBothAccountsAreAlreadyFriendsWithEachOther() {
		currentlyLoggedInUser.setFriends(List.of(friendOfCurrentlyLoggedInUser));
		friendOfCurrentlyLoggedInUser.setFriends(List.of(currentlyLoggedInUser));
		
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(accountsRepository.findById(1L)).thenReturn(Optional.of(currentlyLoggedInUser));
		when(accountsRepository.findById(2L)).thenReturn(Optional.of(friendOfCurrentlyLoggedInUser));
		
		RuntimeException exceptionThrown = assertThrows(RuntimeException.class, () -> {
			friendsService.addFriend(2L);
		});
		
		assertEquals(exceptionThrown.getMessage(), "The currently logged in user is already friends with the user with id = 2");
	}
	
	@Test
	void testGetFriendsListOfCurrentlyLoggedInUserValidRequest() {
		friendOfCurrentlyLoggedInUser.setUserProfile(new UserProfile());
		friendOfCurrentlyLoggedInUser.getUserProfile().setUsername("nHalash");
		currentlyLoggedInUser.setFriends(List.of(friendOfCurrentlyLoggedInUser));
		
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(accountsRepository.findById(1L)).thenReturn(Optional.of(currentlyLoggedInUser));

		ArrayList<String> result = friendsService.getFriendsListOfCurrentlyLoggedInUser();
		
		assertNotNull(result);
		assertEquals(result.get(0), "nHalash");
	}
	
	@Test
	void testDeleteFriendValidRequest() {
		ArrayList<AccountsModel> currentlyLoggedInUsersFriends = new ArrayList<>(List.of(friendOfCurrentlyLoggedInUser));
		ArrayList<AccountsModel> friendsOfTheOtherUser = new ArrayList<>(List.of(currentlyLoggedInUser));
		currentlyLoggedInUser.setFriends(currentlyLoggedInUsersFriends);
		friendOfCurrentlyLoggedInUser.setFriends(friendsOfTheOtherUser);
		
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(accountsRepository.findById(1L)).thenReturn(Optional.of(currentlyLoggedInUser));
		when(accountsRepository.findById(2L)).thenReturn(Optional.of(friendOfCurrentlyLoggedInUser));
		
		String result = friendsService.deleteFriend(2L);
		
		assertNotNull(result);
		assertEquals(result, "The currently logged in user with ID = 1 has successfully deleted the user with ID = 2 from their friend's list.");
	}
	
	@Test
	void testDeleteFriendInvalidRequestAccountWithIdEqualToPathVariableDoesNotExist() {
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(accountsRepository.findById(1L)).thenReturn(Optional.of(currentlyLoggedInUser));
		when(accountsRepository.findById(2L)).thenReturn(Optional.empty());

		RuntimeException exceptionThrown = assertThrows(RuntimeException.class, () -> {
			friendsService.deleteFriend(2L);
		});
		
		assertEquals(exceptionThrown.getMessage(), "An account with the ID of the parameter in the path variable, 2, does not exist in the Account database.");
	}
	
	@Test
	void testDeleteFriendInvalidRequestAccountsAreNotAlreadyFriendsWithEachOther() {
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(accountsRepository.findById(1L)).thenReturn(Optional.of(currentlyLoggedInUser));
		when(accountsRepository.findById(2L)).thenReturn(Optional.of(friendOfCurrentlyLoggedInUser));
		
		RuntimeException exceptionThrown = assertThrows(RuntimeException.class, () -> {
			friendsService.deleteFriend(2L);
		});
		
		assertEquals(exceptionThrown.getMessage(), "The currently logged in user is not friends with the user with ID = 2. No changes were made to the database with this HTTP request.");
	}
}
