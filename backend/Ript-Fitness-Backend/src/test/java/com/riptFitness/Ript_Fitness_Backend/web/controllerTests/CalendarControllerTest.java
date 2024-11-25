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

import java.time.LocalDate;
import java.util.List;

@WebMvcTest(CalendarController.class)
@Import(SecurityConfig.class)  // Import SecurityConfig to ensure JwtUtil is configured
@ActiveProfiles("test")
public class CalendarControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CalendarService calendarService;  // Mocking CalendarService

    @MockBean
    private JwtUtil jwtUtil;  // Mocking JwtUtil

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        // Mock the JwtUtil methods used in your controller
        when(jwtUtil.extractUsername(any(String.class))).thenReturn("test-user");
    }

    @Test
    public void testLogWorkoutDay() throws Exception {
        // Mock the logWorkoutDay method of the CalendarService
        mockMvc.perform(post("/calendar/logWorkout")
                .param("date", "2024-11-01")  // Use a sample date for testing
                .header("Authorization", "Bearer test-token")  // Mock the authorization header
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());  // Expect a successful response
    }

    @Test
    public void testLogRestDay() throws Exception {
        // Mock the logRestDay method of the CalendarService
        mockMvc.perform(post("/calendar/logRestDay")
                .param("date", "2024-11-02")  // Use a sample date for testing
                .header("Authorization", "Bearer test-token")  // Mock the authorization header
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());  // Expect a successful response
    }

    @Test
    public void testGetMonth() throws Exception {
        // Create a sample CalendarDto object with the correct constructor
        CalendarDto calendarDto = new CalendarDto(LocalDate.parse("2024-11-01"), 1);  // Use LocalDate here

        // Mock the getMonth method of the CalendarService and return a list of CalendarDto
        when(calendarService.getMonth(any(LocalDate.class), any(LocalDate.class))).thenReturn(List.of(calendarDto));

        mockMvc.perform(get("/calendar/getMonth")
                .param("startYear", "2024")
                .param("startMonth", "11")
                .param("endYear", "2024")
                .param("endMonth", "11")
                .header("Authorization", "Bearer test-token")  // Mock the authorization header
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())  // Expect a successful response
                .andExpect(jsonPath("$[0].date").value("2024-11-01"))  // Check the date value
                .andExpect(jsonPath("$[0].activityType").value(1));  // Check the activityType value
    }
}
