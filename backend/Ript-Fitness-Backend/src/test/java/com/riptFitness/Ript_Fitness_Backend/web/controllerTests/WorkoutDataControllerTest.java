package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Collections;

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
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.JwtUtil;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.SecurityConfig;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.WorkoutDataService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.WorkoutDataController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutDataDto;

@WebMvcTest(WorkoutDataController.class)
@ActiveProfiles("test")
@Import(SecurityConfig.class)
public class WorkoutDataControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private WorkoutDataService workoutDataService;

    @Autowired
    private ObjectMapper objectMapper;

    private WorkoutDataDto workoutDataDto;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        workoutDataDto = new WorkoutDataDto();
        workoutDataDto.setDataId(1L);
        workoutDataDto.setExerciseName("Test Exercise");
    }

    @Test
    public void testAddWorkoutData() throws Exception {
        when(workoutDataService.addWorkoutData(any(WorkoutDataDto.class))).thenReturn(workoutDataDto);

        mockMvc.perform(post("/workoutData/addWorkoutData")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(workoutDataDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dataId").value(1L))
                .andExpect(jsonPath("$.exerciseName").value("Test Exercise"));
    }

    @Test
    public void testGetWorkoutData() throws Exception {
        when(workoutDataService.getWorkoutData(1L)).thenReturn(workoutDataDto);

        mockMvc.perform(get("/workoutData/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dataId").value(1L))
                .andExpect(jsonPath("$.exerciseName").value("Test Exercise"));
    }

    @Test
    public void testGetAllWorkoutData() throws Exception {
        when(workoutDataService.getAllWorkoutData(0, 1, "Test Exercise"))
                .thenReturn(Collections.singletonList(workoutDataDto));
        
        
        mockMvc.perform(get("/workoutData/getAllData/0/1/Test Exercise"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].dataId").value(1L))
                .andExpect(jsonPath("$[0].exerciseName").value("Test Exercise"));
    }

    @Test
    public void testUpdateWorkoutData() throws Exception {
        when(workoutDataService.updateWorkoutData(any(Long.class), any(WorkoutDataDto.class))).thenReturn(workoutDataDto);

        mockMvc.perform(put("/workoutData/updateWorkoutData/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(workoutDataDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dataId").value(1L))
                .andExpect(jsonPath("$.exerciseName").value("Test Exercise"));
    }

    @Test
    public void testDeleteWorkoutData() throws Exception {
        workoutDataDto.setDeleted(true);
        when(workoutDataService.deleteWorkoutData(1L)).thenReturn(workoutDataDto);

        mockMvc.perform(delete("/workoutData/deleteWorkoutData/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deleted").value("true"));
    }
}
