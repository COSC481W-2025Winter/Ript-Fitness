package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.riptFitness.Ript_Fitness_Backend.config.JwtUtil;
import com.riptFitness.Ript_Fitness_Backend.config.SecurityConfig;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Streak;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.StreakService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.StreakController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.StreakDto;

@WebMvcTest(StreakController.class)
@ActiveProfiles("test")
@Import(SecurityConfig.class)
public class StreakControllerTest {

	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private static StreakService streakService;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	@MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;

	
	private StreakDto streakDto;
	private Streak streak;
	
	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
		
		streakDto = new StreakDto();
		streakDto.id = (long) 100;
		streakDto.currentSt = 10;
		streakDto.prevLogin = LocalDateTime.of(
	            2021, 04, 24, 14, 33, 00);
		
		streak = new Streak();
		streak.id = (long) 100;
		streak.currentSt = 10;
		streak.prevLogin = LocalDateTime.of(
				2021, 04, 24, 14, 33, 00);
		
	}
	
	@AfterAll
	public static void tearDown() {
		reset(streakService);
	}
	
	@Test
	public void testGetStreakValidRequest() throws Exception{
		when(streakService.getStreak()).thenReturn(streakDto);
		
		mockMvc.perform(get("/streak/getStreak")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value((long) 100))
				.andExpect(jsonPath("$.currentSt").value(10))
				.andExpect(jsonPath("$.prevLogin").value("2021-04-24T14:33:00"))//weird error here
				.andReturn();
	}
	
	@Test
	public void testUpdateStreakValidRequest() throws Exception{
		when(streakService.updateStreak()).thenReturn(streakDto);
		
		mockMvc.perform(put("/streak/updateStreak")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(streakDto)))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value((long) 100))
				.andExpect(jsonPath("$.currentSt").value(10))
				.andExpect(jsonPath("$.prevLogin").value("2021-04-24T14:33:00"))//weird error here
				.andReturn();
	}
	
	
}