package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.JwtUtil;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.SecurityConfig;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.CalendarService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.CalendarController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.CalendarDto;

import java.time.LocalDateTime;
import java.util.List;

@WebMvcTest(CalendarController.class)
@Import(SecurityConfig.class)
@ActiveProfiles("test")
public class CalendarControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private CalendarService calendarService;

	@MockBean
	private JwtUtil jwtUtil;

	@BeforeEach
	public void setUp() {
		when(jwtUtil.extractUsername(any(String.class))).thenReturn("test-user");
	}

	@Test
	public void testLogWorkoutDay() throws Exception {
		mockMvc.perform(post("/calendar/logWorkout?timeZone=Etc/GMT%2B5").header("Authorization", "Bearer test-token")
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
	}

	@Test
	public void testLogRestDay() throws Exception {
		mockMvc.perform(post("/calendar/logRestDay?timeZone=Etc/GMT%2B5").header("Authorization", "Bearer test-token")
				.contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
	}

	@Test
	public void testGetMonth() throws Exception {
	    CalendarDto calendarDto = new CalendarDto(LocalDateTime.parse("2024-11-01T00:00:00"), 1, "America/New_York");

	    when(calendarService.getMonth(any(LocalDateTime.class), any(LocalDateTime.class)))
	            .thenReturn(List.of(calendarDto));

	    mockMvc.perform(get("/calendar/getMonth")
	            .param("startYear", "2024")
	            .param("startMonth", "11")
	            .param("endYear", "2024")
	            .param("endMonth", "11")
	            .header("Authorization", "Bearer test-token")
	            .contentType(MediaType.APPLICATION_JSON))
	            .andExpect(status().isOk())
	            .andExpect(jsonPath("$[0].date").value("2024-11-01T00:00:00")) // Check the date value
	            .andExpect(jsonPath("$[0].activityType").value(1)) // Check the activityType value
	            .andExpect(jsonPath("$[0].timeZoneWhenLogged").value("America/New_York")); // Check the new timezone field
	}

}
