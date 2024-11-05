package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.riptFitness.Ript_Fitness_Backend.config.JwtUtil;
import com.riptFitness.Ript_Fitness_Backend.config.SecurityConfig;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.WorkoutsService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.WorkoutsController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutsDto;

@WebMvcTest(WorkoutsController.class)
@ActiveProfiles("test")
@Import(SecurityConfig.class)
public class WorkoutsControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private WorkoutsService workoutsService;

    @Autowired
    private ObjectMapper objectMapper;

    private WorkoutsDto workoutDto;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        workoutDto = new WorkoutsDto();
        workoutDto.setWorkoutsId(1L);
        workoutDto.setName("Test Workout");
    }

    @Test
    public void testAddWorkout() throws Exception {
        when(workoutsService.addWorkout(any(WorkoutsDto.class))).thenReturn(workoutDto);

        mockMvc.perform(post("/workouts/addWorkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(workoutDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.workoutsId").value(1L))
                .andExpect(jsonPath("$.name").value("Test Workout"))
                .andReturn();
    }

    @Test
    public void testGetWorkout() throws Exception {
        when(workoutsService.getWorkout(1L)).thenReturn(workoutDto);

        mockMvc.perform(get("/workouts/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.workoutsId").value(1L))
                .andExpect(jsonPath("$.name").value("Test Workout"))
                .andReturn();
    }

    @Test
    public void testGetUsersWorkouts() throws Exception {
        when(workoutsService.getUsersWorkouts()).thenReturn(Collections.singletonList(workoutDto));

        mockMvc.perform(get("/workouts/getUsersWorkouts")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].workoutsId").value(1L))
                .andExpect(jsonPath("$[0].name").value("Test Workout"))
                .andReturn();
    }

    @Test
    public void testUpdateWorkout() throws Exception {
        when(workoutsService.updateWorkout(any(Long.class), any(WorkoutsDto.class))).thenReturn(workoutDto);

        mockMvc.perform(put("/workouts/updateWorkout/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(workoutDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.workoutsId").value(1L))
                .andExpect(jsonPath("$.name").value("Test Workout"))
                .andReturn();
    }

    @Test
    public void testDeleteWorkout() throws Exception {
    	workoutDto.setIsDeleted(true);
    	
        when(workoutsService.deleteWorkout(any(Long.class))).thenReturn(workoutDto);

        mockMvc.perform(delete("/workouts/deleteWorkout/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.isDeleted").value("true"))
                .andReturn();
    }
}
