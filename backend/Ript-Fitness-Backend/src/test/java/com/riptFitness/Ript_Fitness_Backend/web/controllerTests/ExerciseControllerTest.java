package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.ExerciseService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.ExercisesController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.ExerciseDto;

@WebMvcTest(ExercisesController.class)
public class ExerciseControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private ExerciseService exerciseService;

	@MockBean
	private UserDetailsService userDetailsService;

	@MockBean
	private SecurityFilterChain securityFilterChain;

	@Autowired
	private ObjectMapper objectMapper;

	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	public void testGetExercisesFromCurrentUser() throws Exception {
		// Arrange
		ExerciseDto exerciseDto1 = new ExerciseDto();
		exerciseDto1.setExerciseId(1L);
		exerciseDto1.setNameOfExercise("Push Ups");
		exerciseDto1.setSets(3);
		exerciseDto1.setReps(Arrays.asList(10, 12, 15));

		ExerciseDto exerciseDto2 = new ExerciseDto();
		exerciseDto2.setExerciseId(2L);
		exerciseDto2.setNameOfExercise("Squats");
		exerciseDto2.setSets(4);
		exerciseDto2.setReps(Arrays.asList(8, 8, 10, 12));

		List<ExerciseDto> exerciseDtoList = Arrays.asList(exerciseDto1, exerciseDto2);

		when(exerciseService.getExercisesFromCurrentUser()).thenReturn(exerciseDtoList);

		// Act & Assert
		mockMvc.perform(get("/exercises/getAllExercises").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
				.andExpect(jsonPath("$[0].exerciseId").value(1))
				.andExpect(jsonPath("$[0].nameOfExercise").value("Push Ups")).andExpect(jsonPath("$[0].sets").value(3))
				.andExpect(jsonPath("$[0].reps[0]").value(10)).andExpect(jsonPath("$[1].exerciseId").value(2))
				.andExpect(jsonPath("$[1].nameOfExercise").value("Squats")).andExpect(jsonPath("$[1].sets").value(4))
				.andExpect(jsonPath("$[1].reps[1]").value(8));

		verify(exerciseService, times(1)).getExercisesFromCurrentUser();
	}

	@Test
	public void testAddExercise() throws Exception {
		ExerciseDto exerciseDto = new ExerciseDto();
		exerciseDto.setNameOfExercise("Push Ups");
		when(exerciseService.addExercise(any(ExerciseDto.class))).thenReturn(exerciseDto);

		mockMvc.perform(post("/exercises/addExercise").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(exerciseDto))).andExpect(status().isCreated())
				.andExpect(jsonPath("$.nameOfExercise").value("Push Ups"));
	}

	@Test
	public void testDeleteExercise() throws Exception {
		ExerciseDto exerciseDto = new ExerciseDto();
		exerciseDto.setExerciseId(1L);
		exerciseDto.setNameOfExercise("Push Ups");
		when(exerciseService.deleteExercise(1L)).thenReturn(exerciseDto);

		mockMvc.perform(delete("/exercises/deleteExercise/1")).andExpect(status().isNoContent());
	}

	@Test
	public void testUpdateReps() throws Exception {
		ExerciseDto exerciseDto = new ExerciseDto();
		exerciseDto.setExerciseId(1L);
		exerciseDto.setNameOfExercise("Push Ups");
		when(exerciseService.editReps(1L, 1, 15)).thenReturn(exerciseDto);

		mockMvc.perform(put("/exercises/editReps/1/1/15")).andExpect(status().isOk())
				.andExpect(jsonPath("$.nameOfExercise").value("Push Ups"));
	}

	@Test
	public void testUpdateSets() throws Exception {
		ExerciseDto exerciseDto = new ExerciseDto();
		exerciseDto.setExerciseId(1L);
		exerciseDto.setNameOfExercise("Push Ups");
		when(exerciseService.editSets(1L, 3)).thenReturn(exerciseDto);

		mockMvc.perform(put("/exercises/editSets/1/3")).andExpect(status().isOk())
				.andExpect(jsonPath("$.nameOfExercise").value("Push Ups"));
	}

	@Test
	public void testEditExerciseName() throws Exception {
		ExerciseDto exerciseDto = new ExerciseDto();
		exerciseDto.setExerciseId(1L);
		exerciseDto.setNameOfExercise("Pull Ups");
		when(exerciseService.editExerciseName(1L, "Pull Ups")).thenReturn(exerciseDto);

		mockMvc.perform(put("/exercises/editExerciseName/1/Pull Ups")).andExpect(status().isOk())
				.andExpect(jsonPath("$.nameOfExercise").value("Pull Ups"));
	}

	@Test
	public void testFindByKeyword() throws Exception {
		// Prepare mock ExerciseDto objects
		ExerciseDto exerciseDto1 = new ExerciseDto();
		exerciseDto1.setNameOfExercise("Push Ups");

		ExerciseDto exerciseDto2 = new ExerciseDto();
		exerciseDto2.setNameOfExercise("Pull Ups");

		List<ExerciseDto> similarExercises = Arrays.asList(exerciseDto1, exerciseDto2);

		// Mock the service to return the list of ExerciseDto objects
		when(exerciseService.findByKeyword("ups")).thenReturn(similarExercises);

		// Perform the GET request and verify the response
		mockMvc.perform(get("/exercises/findByKeyword/ups")).andExpect(status().isOk())
				.andExpect(jsonPath("$[0].nameOfExercise").value("Push Ups"))
				.andExpect(jsonPath("$[1].nameOfExercise").value("Pull Ups"));
	}

}
