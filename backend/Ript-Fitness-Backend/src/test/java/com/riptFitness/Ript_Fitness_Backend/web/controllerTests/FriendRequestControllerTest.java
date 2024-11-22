package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.RequestStatus;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.JwtUtil;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.SecurityConfig;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.FriendRequestService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.FriendRequestController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.FriendRequestDto;

@WebMvcTest(FriendRequestController.class)
@ActiveProfiles("test")
@Import(SecurityConfig.class)
public class FriendRequestControllerTest {

	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private static FriendRequestService friendRequestService;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	@MockBean
	private JwtUtil jwtUtil;
	
	@MockBean
	private UserDetailsService userDetailsService;
	
	private FriendRequestDto friendRequestDto;
	
	@BeforeEach
	public void setUp() {
		friendRequestDto = new FriendRequestDto();
		friendRequestDto.accountIdOfToAccount = 2L;	
		friendRequestDto.fromUsername = "cpichle1";
		friendRequestDto.toUsername = "nHalash";
	}
	
	@AfterAll
	public static void tearDown() {
		reset(friendRequestService);
	}
	
	@Test
	public void testSendNewRequestValidRequest() throws Exception {
		when(friendRequestService.sendNewRequest(any(FriendRequestDto.class))).thenReturn(new ArrayList<>(List.of(friendRequestDto, friendRequestDto)));
		
		mockMvc.perform(post("/friendRequest/sendNewRequest")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsBytes(friendRequestDto)))
				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$[0].fromUsername").value("cpichle1"))
				.andExpect(jsonPath("$[0].toUsername").value("nHalash"))
				.andReturn();
	}
	
	@Test
	public void testSendNewRequestInvalidRequestNoBody() throws Exception {
		mockMvc.perform(post("/friendRequest/sendRequest")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
	
	@Test
	public void testGetStatusValidRequest() throws Exception {
		when(friendRequestService.getStatus(any(Long.class))).thenReturn("SENT");
		
		mockMvc.perform(get("/friendRequest/getStatus/1")
				.content(""))
				.andExpect(status().isOk())
				.andExpect(content().string("SENT"))
				.andReturn();
	}
	
	@Test
	public void testGetStatusInvalidRequestNoPathVariable() throws Exception {
		mockMvc.perform(get("/friendRequest/getStatus")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
	
	@Test
	public void testGetAllAccountsWithSpecificStatusValidRequest() throws Exception {
		when(friendRequestService.getAllAccountsWithSpecificStatus(any(RequestStatus.class))).thenReturn(new ArrayList<String>(List.of("cpichle1", "nHalash")));
		
		mockMvc.perform(get("/friendRequest/getAllAccountsWithSpecifcStatus/PENDING")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0]").value("cpichle1"))
				.andReturn();
	}
	
	@Test
	public void testGetAllAccountsWithSpecificStatusInvalidRequestNoPathVariable() throws Exception {
		mockMvc.perform(get("/friendRequest/getAllAccountsWithSpecifcStatus"))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
	
	@Test
	public void testSendRequestValidRequest() throws Exception {
		when(friendRequestService.sendRequest(any(FriendRequestDto.class))).thenReturn(new ArrayList<>(List.of(friendRequestDto, friendRequestDto)));
		
		mockMvc.perform(put("/friendRequest/sendRequest")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsBytes(friendRequestDto)))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$[0].fromUsername").value("cpichle1"))
				.andExpect(jsonPath("$[0].toUsername").value("nHalash"))
				.andReturn();
	}
	
	@Test
	public void testSendRequestInvalidRequestNoBody() throws Exception {
		mockMvc.perform(put("/friendRequest/sendRequest")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
}
