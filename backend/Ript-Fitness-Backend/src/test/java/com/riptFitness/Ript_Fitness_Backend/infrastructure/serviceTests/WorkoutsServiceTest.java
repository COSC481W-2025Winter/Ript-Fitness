package com.riptFitness.Ript_Fitness_Backend.infrastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
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
import com.riptFitness.Ript_Fitness_Backend.domain.model.ExerciseModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Workouts;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.WorkoutsRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.AccountsService;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.WorkoutsService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.ExerciseDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutsDto;

@ActiveProfiles("test")
public class WorkoutsServiceTest {

    @Mock
    private WorkoutsRepository workoutsRepository;
    
    @Mock
    private AccountsRepository accountsRepository;
    
    @Mock
    private AccountsService accountsService;

    @InjectMocks
    private WorkoutsService workoutsService;

    private WorkoutsDto workoutDto;
    private WorkoutsDto workoutDto2;
    private Workouts workout;
    private Workouts workout2;
    private AccountsModel account;
    private ExerciseModel exercise;
    private ExerciseDto exerciseDto;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        
        exerciseDto = new ExerciseDto();
        exerciseDto.exerciseId = 1L;
        exerciseDto.nameOfExercise = "Test Exercise";
        List<ExerciseDto> exerciseDtos = new ArrayList<>();
        exerciseDtos.add(exerciseDto);
        
        workoutDto = new WorkoutsDto();
        workoutDto.workoutsId = 1L;
        workoutDto.name = "Test Workout";
        workoutDto.setExercises(exerciseDtos);
        
        workoutDto2 = new WorkoutsDto();
        workoutDto2.workoutsId = 2L;
        workoutDto2.name = "Workout 2";
        
        account = new AccountsModel();
        account.setId(1L);
        
        exercise = new ExerciseModel();
        exercise.exerciseId = 1L;
        exercise.nameOfExercise = "Test Exercise";
        List<ExerciseModel> exercises = new ArrayList<>();
        exercises.add(exercise);

        workout = new Workouts();
        workout.workoutsId = 1L;
        workout.name = "Test Workout";
        workout.setAccount(account);
        workout.setExercises(exercises);
        
        workout2 = new Workouts();
        workout2.workoutsId = 2L;
        workout2.name = "Workout 2";
    }

    @Test
    public void testAddWorkout() {
    	when(accountsService.getLoggedInUserId()).thenReturn(1L);
        when(accountsRepository.findById(1L)).thenReturn(Optional.of(account));
        when(workoutsRepository.save(workout)).thenReturn(workout);

        WorkoutsDto result = workoutsService.addWorkout(workoutDto);
        assertNotNull(result);
        assertEquals("Test Workout", result.name);
    }

    @Test
    public void testGetWorkoutById() {
        when(workoutsRepository.findById(1L)).thenReturn(Optional.of(workout));

        WorkoutsDto result = workoutsService.getWorkout(1L);
        assertNotNull(result);
        assertEquals("Test Workout", result.name);
    }

    @Test
    public void testGetWorkoutByInvalidId() {
        when(workoutsRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> workoutsService.getWorkout(1L));
    }
    
    @Test
    public void testGetUsersWorkouts() {
    	 // Mock the user account retrieval
        when(accountsService.getLoggedInUserId()).thenReturn(1L);
        when(accountsRepository.findById(1L)).thenReturn(Optional.of(account));

        // Mock the user's workouts retrieval
        List<Workouts> expectedWorkouts = Arrays.asList(workout, workout2);
        when(workoutsRepository.findByAccountId(1L)).thenReturn(expectedWorkouts);

        // Call the service method
        List<WorkoutsDto> actualWorkouts = workoutsService.getUsersWorkouts();

        // Assert that the returned list matches the expected list
        assertEquals(expectedWorkouts.size(), actualWorkouts.size());
        assertEquals(expectedWorkouts.get(0).name, actualWorkouts.get(0).name);
        assertEquals(expectedWorkouts.get(1).name, actualWorkouts.get(1).name);
    }
    
    @Test
    public void testGetUsersWorkoutByInvalidId() {
    	// Mock accountsService to return an ID that doesn't exist in the accountsRepository
        when(accountsService.getLoggedInUserId()).thenReturn(999L);
        when(accountsRepository.findById(999L)).thenReturn(Optional.empty());

        // Assert that a RuntimeException is thrown when the account is not found
        RuntimeException thrown = assertThrows(RuntimeException.class, 
            () -> workoutsService.getUsersWorkouts());
        
        assertEquals("Account not found", thrown.getMessage());
    }
    @Test
    public void testUpdateWorkoutValid() {
        when(workoutsRepository.findById(1L)).thenReturn(Optional.of(workout));
        when(workoutsRepository.save(any(Workouts.class))).thenReturn(workout);

        WorkoutsDto result = workoutsService.updateWorkout(1L, workoutDto);
        assertNotNull(result);
        assertEquals("Test Workout", result.name);
    }
    
    @Test
    public void testUpdateWorkoutInvalid() {
    	when(workoutsRepository.findById(100L)).thenReturn(Optional.empty());
    	
    	assertThrows(RuntimeException.class,() -> workoutsService.updateWorkout(100L, workoutDto));
    }

    @Test
    public void testDeleteWorkout() {
        when(workoutsRepository.findById(1L)).thenReturn(Optional.of(workout));
        when(workoutsRepository.save(any(Workouts.class))).thenReturn(workout);

        WorkoutsDto result = workoutsService.deleteWorkout(1L);
        assertNotNull(result);
        assertEquals(true, result.isDeleted);
    }
    
    @Test
    public void testDeleteWorkoutInvalid() {
    	when(workoutsRepository.findById(100L)).thenReturn(Optional.empty());
    	
    	assertThrows(RuntimeException.class,() -> workoutsService.deleteWorkout(100L));
    }
}
