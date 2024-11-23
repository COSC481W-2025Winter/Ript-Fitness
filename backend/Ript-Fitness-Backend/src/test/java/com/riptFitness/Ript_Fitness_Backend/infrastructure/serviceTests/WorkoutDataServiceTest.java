package com.riptFitness.Ript_Fitness_Backend.infrastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.ActiveProfiles;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.WorkoutData;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.WorkoutDataRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.AccountsService;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.WorkoutDataService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutDataDto;

@ActiveProfiles("test")
public class WorkoutDataServiceTest {
	
	@Mock
    private WorkoutDataRepository workoutDataRepository;

    @Mock
    private AccountsRepository accountsRepository;

    @Mock
    private AccountsService accountsService;

    @InjectMocks
    private WorkoutDataService workoutDataService;

    private WorkoutData workoutData;
    private WorkoutDataDto workoutDataDto;
    private AccountsModel account;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        // Initialize test data
        account = new AccountsModel();
        account.setId(1L);

        workoutData = new WorkoutData();
        workoutData.setDataId(1L);;
        workoutData.setExerciseName("Push Ups");
        workoutData.setAccount(account);
        workoutData.setReps(Arrays.asList(8, 10, 12));
        workoutData.setWeight(Arrays.asList(100, 120, 140));
        
        workoutDataDto = new WorkoutDataDto();
        workoutDataDto.setDataId(1L);
        workoutDataDto.setExerciseName("Push Ups");
        workoutDataDto.setReps(Arrays.asList(8, 10, 12));
        workoutDataDto.setWeight(Arrays.asList(100, 120, 140));
    }

    @Test
    public void testAddWorkoutData() {
        when(accountsService.getLoggedInUserId()).thenReturn(1L);
        when(accountsRepository.findById(1L)).thenReturn(Optional.of(account));
        when(workoutDataRepository.save(any(WorkoutData.class))).thenAnswer(invocation -> {
            WorkoutData savedData = invocation.getArgument(0);
            savedData.setDataId(1L); // Simulate saved ID
            return savedData;
        });

        WorkoutDataDto result = workoutDataService.addWorkoutData(workoutDataDto);

        assertNotNull(result);
        assertEquals("Push Ups", result.getExerciseName());
        verify(workoutDataRepository, times(1)).save(any(WorkoutData.class));
    }

    @Test
    public void testAddWorkoutDataAccountNotFound() {
        when(accountsService.getLoggedInUserId()).thenReturn(1L);
        when(accountsRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException thrown = assertThrows(RuntimeException.class, 
            () -> workoutDataService.addWorkoutData(workoutDataDto));
        assertEquals("Account not found", thrown.getMessage());
    }

    @Test
    public void testGetWorkoutData() {
        when(workoutDataRepository.findById(1L)).thenReturn(Optional.of(workoutData));

        WorkoutDataDto result = workoutDataService.getWorkoutData(1L);

        assertNotNull(result);
        assertEquals("Push Ups", result.getExerciseName());
    }

    @Test
    public void testGetWorkoutDataNotFound() {
        when(workoutDataRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException thrown = assertThrows(RuntimeException.class, 
            () -> workoutDataService.getWorkoutData(1L));
        assertEquals("no workout data found with id = 1", thrown.getMessage());
    }

    @Test
    public void testGetAllWorkoutData() {
        when(accountsService.getLoggedInUserId()).thenReturn(1L);
        when(accountsRepository.findById(1L)).thenReturn(Optional.of(account));
        when(workoutDataRepository.findByAccountId(1L)).thenReturn(Arrays.asList(workoutData));

        List<WorkoutDataDto> results = workoutDataService.getAllWorkoutData(0, 1, "push ups");

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Push Ups", results.get(0).getExerciseName());
    }

    @Test
    public void testGetAllWorkoutDataInvalidIndices() {
        assertThrows(RuntimeException.class, 
            () -> workoutDataService.getAllWorkoutData(10, 0, "push ups"));

        assertThrows(RuntimeException.class, 
            () -> workoutDataService.getAllWorkoutData(-1, 10, "push ups"));
    }

    @Test
    public void testUpdateWorkoutData() {
        when(workoutDataRepository.findById(1L)).thenReturn(Optional.of(workoutData));
        when(workoutDataRepository.save(any(WorkoutData.class))).thenAnswer(invocation -> invocation.getArgument(0));

        WorkoutDataDto updatedData = new WorkoutDataDto();
        updatedData.setExerciseName("Pull Ups");

        WorkoutDataDto result = workoutDataService.updateWorkoutData(1L, updatedData);

        assertNotNull(result);
        assertEquals("Pull Ups", result.getExerciseName());
    }

    @Test
    public void testUpdateWorkoutDataNotFound() {
        when(workoutDataRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, 
            () -> workoutDataService.updateWorkoutData(1L, workoutDataDto));
    }

    @Test
    public void testDeleteWorkoutData() {
        when(workoutDataRepository.findById(1L)).thenReturn(Optional.of(workoutData));
        when(workoutDataRepository.save(any(WorkoutData.class))).thenAnswer(invocation -> invocation.getArgument(0));

        WorkoutDataDto result = workoutDataService.deleteWorkoutData(1L);

        assertNotNull(result);
        assertTrue(result.isDeleted());
    }

    @Test
    public void testDeleteWorkoutDataNotFound() {
        when(workoutDataRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, 
            () -> workoutDataService.deleteWorkoutData(1L));
    }
    
    @Test
    public void testGetMaxReps() {
        // Mock dependencies
    	when(accountsService.getLoggedInUserId()).thenReturn(1L);
        when(accountsRepository.findById(1L)).thenReturn(Optional.of(account));
        when(workoutDataRepository.findByAccountId(1L)).thenReturn(Arrays.asList(workoutData));
        
        // Call the method
        int maxReps = workoutDataService.getMaxReps("push ups");

        // Assert the result
        assertEquals(12, maxReps); // 12 is the highest in the mock data
    }

    @Test
    public void testGetMaxWeight() {
        // Mock dependencies
    	when(accountsService.getLoggedInUserId()).thenReturn(1L);
        when(accountsRepository.findById(1L)).thenReturn(Optional.of(account));
        when(workoutDataRepository.findByAccountId(1L)).thenReturn(Arrays.asList(workoutData));
        
        // Call the method
        int maxWeight = workoutDataService.getMaxWeight("push ups");

        // Assert the result
        assertEquals(140, maxWeight); // 140 is the highest in the mock data
    }
    
}
