package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.JwtUtil;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.SecurityConfig;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.FriendsService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.FriendsController;

@WebMvcTest(FriendsController.class)
@ActiveProfiles("test")
@Import(SecurityConfig.class)
public class FriendsControllerTest {

	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private static FriendsService friendsService;
	
	@MockBean
	private JwtUtil jwtUtil;
	
	@MockBean
	private UserDetailsService userDetailsService;
	
	@AfterAll
	public static void tearDown() {
		reset(friendsService);
	}
	
	@Test
	public void testAddFriendValidRequest() throws Exception {
		when(friendsService.addFriend(any(Long.class))).thenReturn("The currently logged in user with ID = 14 has successfully added the user with ID = 4 to their friend's list.");
	
		mockMvc.perform(post("/friends/addFriend/4")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isCreated())
				.andExpect(content().string("The currently logged in user with ID = 14 has successfully added the user with ID = 4 to their friend's list."))
				.andReturn();
	}
	
	@Test
	public void testAddFriendInvalidRequestNoPathVariable() throws Exception {
		mockMvc.perform(post("/friends/addFriend"))
				.andExpect(status().isInternalServerError());
			
	}
	
	@Test
	public void testGetFriendsListOfCurrentlyLoggedInUserValidRequest() throws Exception {
		ArrayList<String> returnedArrayList = new ArrayList<>(List.of("cpichle1", "nHalash"));
		
		when(friendsService.getFriendsListOfCurrentlyLoggedInUser()).thenReturn(returnedArrayList);
		
		mockMvc.perform(get("/friends/getFriendsListOfCurrentlyLoggedInUser")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isOk())
                .andExpect(content().json("[\"cpichle1\", \"nHalash\"]"))
                .andReturn();
	}
	
	@Test
	public void testGetFriendsValidRequest() throws Exception {
		ArrayList<String> returnedArrayList = new ArrayList<>(List.of("cpichle1", "nHalash"));

		when(friendsService.getFriendsList(2L)).thenReturn(returnedArrayList);
		
		mockMvc.perform(get("/friends/getFriendsList/2")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isOk())
                .andExpect(content().json("[\"cpichle1\", \"nHalash\"]"))
                .andReturn();
	}
	
	@Test
	public void testDeleteFriendValidRequest() throws Exception {
		when(friendsService.deleteFriend(any(Long.class))).thenReturn("The currently logged in user with ID = 14 has successfully deleted the user with ID = 4 from their friend's list.");
		
		mockMvc.perform(delete("/friends/deleteFriend/4")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isOk())
				.andExpect(content().string("The currently logged in user with ID = 14 has successfully deleted the user with ID = 4 from their friend's list."))
				.andReturn();
	}
}
