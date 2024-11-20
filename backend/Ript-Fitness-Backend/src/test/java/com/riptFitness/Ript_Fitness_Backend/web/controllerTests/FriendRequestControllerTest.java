package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.JwtUtil;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.SecurityConfig;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.FriendRequestService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.FriendRequestController;

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
	
}
