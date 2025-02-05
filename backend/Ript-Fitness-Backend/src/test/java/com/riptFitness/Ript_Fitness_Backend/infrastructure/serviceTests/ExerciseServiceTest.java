package com.riptFitness.Ript_Fitness_Backend.infrastructure.serviceTests;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays; // Use java.util.Arrays for asList()
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.JwtRequestFilter;
import com.riptFitness.Ript_Fitness_Backend.domain.mapper.ExerciseMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.ExerciseModel;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.ExerciseRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.AccountsService;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.ExerciseService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.ExerciseDto;

@ExtendWith(MockitoExtension.class)
public class ExerciseServiceTest {

	@Mock
	private ExerciseRepository exerciseRepository;

	@Mock
	private AccountsRepository accountsRepository;

	@Mock
	private AccountsService accountsService;

	@MockBean
	private JwtRequestFilter jwtRequestFilter;

	@InjectMocks
	private ExerciseService exerciseService;

	private ExerciseDto exerciseDto;
	private ExerciseModel exerciseModel;
	private AccountsModel accountsModel;

	@BeforeEach
	public void setUp() {
		// Prepare a dummy AccountsModel
		accountsModel = new AccountsModel();
		accountsModel.setId(1L);

		// Prepare a dummy ExerciseDto
		exerciseDto = new ExerciseDto();
		exerciseDto.setExerciseId(1L);
		exerciseDto.setSets(3);
		exerciseDto.setNameOfExercise("Squats");

		// Use mutable ArrayList instead of immutable List.of()
		exerciseDto.setReps(new ArrayList<>(Arrays.asList(10, 10, 10)));
		exerciseDto.setAccountReferenceId(1L);

		// Prepare a dummy ExerciseModel
		exerciseModel = new ExerciseModel();
		exerciseModel.setExerciseId(1L);
		exerciseModel.setSets(3);
		exerciseModel.setNameOfExercise("Squats");

		// Again, use a mutable ArrayList for reps
		exerciseModel.setReps(new ArrayList<>(Arrays.asList(10, 10, 10)));
		exerciseModel.setAccount(accountsModel);
	}

	@Test
	public void testGetExercisesFromCurrentUser() {
		// Arrange
		Long currentUserId = 1L;
		int nMostRecent = 2; // Specify how many recent exercises you want to test

		ExerciseModel exercise1 = new ExerciseModel();
		exercise1.setExerciseId(1L);
		exercise1.setNameOfExercise("Push Ups");
		exercise1.setSets(3);
		exercise1.setReps(Arrays.asList(10, 12, 15));

		ExerciseModel exercise2 = new ExerciseModel();
		exercise2.setExerciseId(2L);
		exercise2.setNameOfExercise("Squats");
		exercise2.setSets(4);
		exercise2.setReps(Arrays.asList(8, 8, 10, 12));

		List<ExerciseModel> exerciseModels = Arrays.asList(exercise1, exercise2);

		ExerciseDto exerciseDto1 = ExerciseMapper.INSTANCE.convertToDto(exercise1);
		ExerciseDto exerciseDto2 = ExerciseMapper.INSTANCE.convertToDto(exercise2);

		when(accountsService.getLoggedInUserId()).thenReturn(currentUserId);
		when(exerciseRepository.findByAccountIdAndNotDeleted(currentUserId)).thenReturn(exerciseModels);

		// Act
		List<ExerciseDto> result = exerciseService.getExercisesFromCurrentUser(nMostRecent);

		// Assert using field-by-field comparison with AssertJ
		assertThat(result).usingRecursiveFieldByFieldElementComparator().containsExactlyInAnyOrder(exerciseDto1,
				exerciseDto2);

		verify(accountsService, times(1)).getLoggedInUserId();
		verify(exerciseRepository, times(1)).findByAccountIdAndNotDeleted(currentUserId);
	}

	// Test for addExercise method
	@Test
	public void testAddExercise_Success() {
		// Mock logged in user ID
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		// Mock account retrieval
		when(accountsRepository.findById(1L)).thenReturn(Optional.of(accountsModel));
		// Mock saving the exercise
		when(exerciseRepository.save(any(ExerciseModel.class))).thenReturn(exerciseModel);

		// Call the method to test
		ExerciseDto savedExercise = exerciseService.addExercise(exerciseDto);

		// Verify the save operation
		assertNotNull(savedExercise);
		assertEquals("Squats", savedExercise.getNameOfExercise());
		verify(exerciseRepository).save(any(ExerciseModel.class));
	}

	// Test for deleteExercise method
	@Test
	public void testDeleteExercise_Success() {
		// Mock logged-in user ID
		when(accountsService.getLoggedInUserId()).thenReturn(1L);

		// Prepare a list of exercises for the user with the expected exercise to delete
		exerciseModel.setExerciseId(1L); // Set exercise ID that we want to delete
		List<ExerciseModel> exerciseList = new ArrayList<>();
		exerciseList.add(exerciseModel);

		// Mock the exercise repository to return the prepared list of exercises for the
		// user
		when(exerciseRepository.findByAccountIdAndNotDeleted(1L)).thenReturn(exerciseList);

		// Mock the save operation
		when(exerciseRepository.save(any(ExerciseModel.class))).thenReturn(exerciseModel);

		// Call the deleteExercise method with the matching exercise ID
		ExerciseDto deletedExercise = exerciseService.deleteExercise(1L);

		// Verify that the exercise was marked as deleted
		assertNotNull(deletedExercise);
		assertEquals(true, deletedExercise.isDeleted());
		verify(exerciseRepository).save(exerciseModel);
	}

	// Test for editReps method
	@Test
	public void testEditReps_Success() {
		// Mock the exercise retrieval
		when(exerciseRepository.findById(anyLong())).thenReturn(Optional.of(exerciseModel));

		// Call the method to test
		ExerciseDto editedExercise = exerciseService.editReps(1L, 2, 12);

		// Verify that the reps were edited
		assertNotNull(editedExercise);
		assertEquals(12, exerciseModel.getReps().get(1)); // setNumber - 1 = index 1
		verify(exerciseRepository).save(any(ExerciseModel.class));
	}

	// Test for editSets method
	@Test
	public void testEditSets_Success() {
		// Mock the exercise retrieval
		when(exerciseRepository.findById(anyLong())).thenReturn(Optional.of(exerciseModel));

		// Call the method to test
		ExerciseDto editedExercise = exerciseService.editSets(1L, 5);

		// Verify that the number of sets was edited
		assertNotNull(editedExercise);
		assertEquals(5, exerciseModel.getSets());
		verify(exerciseRepository).save(any(ExerciseModel.class));
	}

	// Test for editExerciseName method
	@Test
	public void testEditExerciseName_Success() {
		// Mock the exercise retrieval
		when(exerciseRepository.findById(anyLong())).thenReturn(Optional.of(exerciseModel));

		// Call the method to test
		ExerciseDto editedExercise = exerciseService.editExerciseName(1L, "Lunges");

		// Verify that the name of the exercise was edited
		assertNotNull(editedExercise);
		assertEquals("Lunges", exerciseModel.getNameOfExercise());
		verify(exerciseRepository).save(any(ExerciseModel.class));
	}

	// Test for deleteExercise when the exercise doesn't exist
	@Test
	public void testDeleteExercise_NotFound() {
		// Mock logged in user ID
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		// Mock empty exercise list for the user
		List<ExerciseModel> emptyList = new ArrayList<>();
		when(exerciseRepository.findByAccountIdAndNotDeleted(1L)).thenReturn(emptyList);

		// Call the method and expect an exception
		RuntimeException exception = assertThrows(RuntimeException.class, () -> {
			exerciseService.deleteExercise(1L);
		});

		// Verify the exception message
		assertEquals("Exercise not found for the current user, or the exercises has already been deleted.",
				exception.getMessage());
	}

	// Test for findByKeyword method
	@Test
	public void testFindByKeyword_Success() {
		// Mock the logged-in user ID
		when(accountsService.getLoggedInUserId()).thenReturn(1L);

		// Prepare mock ExerciseModel objects
		ExerciseModel exercise1 = new ExerciseModel();
		exercise1.setNameOfExercise("Push Ups");

		ExerciseModel exercise2 = new ExerciseModel();
		exercise2.setNameOfExercise("Pull Ups");

		List<ExerciseModel> exercises = Arrays.asList(exercise1, exercise2);

		// Mock the exerciseRepository to return the list of exercises for the user
		when(exerciseRepository.findByAccountIdAndNotDeleted(1L)).thenReturn(exercises);

		// Call the findByKeyword method with the matching keyword
		List<ExerciseDto> result = exerciseService.findByKeyword("ups");

		// Verify the result
		assertNotNull(result);
		assertEquals(2, result.size());
		assertEquals("Push Ups", result.get(0).getNameOfExercise());
		assertEquals("Pull Ups", result.get(1).getNameOfExercise());
	}

	@Test
	public void testUpdateExercise() {
		// Arrange
		ExerciseDto exerciseDto = new ExerciseDto();
		exerciseDto.setExerciseId(1L);
		exerciseDto.setNameOfExercise("Updated Exercise");
		exerciseDto.setSets(3);
		exerciseDto.setReps(Arrays.asList(10, 12, 15));
		exerciseDto.setWeight(Arrays.asList(100, 110, 120));

		ExerciseModel existingExercise = new ExerciseModel();
		existingExercise.setExerciseId(1L);
		existingExercise.setNameOfExercise("Old Exercise");
		existingExercise.setSets(2);
		existingExercise.setReps(Arrays.asList(8, 10));
		existingExercise.setWeight(Arrays.asList(90, 100));

		when(exerciseRepository.findById(1L)).thenReturn(Optional.of(existingExercise));
		when(exerciseRepository.save(any(ExerciseModel.class))).thenReturn(existingExercise);

		// Act
		ExerciseDto updatedExercise = exerciseService.updateExercise(exerciseDto);

		// Assert
		assertNotNull(updatedExercise);
		assertEquals("Updated Exercise", updatedExercise.getNameOfExercise());
		assertEquals(3, updatedExercise.getSets());
		assertEquals(Arrays.asList(10, 12, 15), updatedExercise.getReps());
		assertEquals(Arrays.asList(100, 110, 120), updatedExercise.getWeight());

		verify(exerciseRepository, times(1)).findById(1L);
		verify(exerciseRepository, times(1)).save(any(ExerciseModel.class));
	}

}
