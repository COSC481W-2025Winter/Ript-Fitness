package com.riptFitness.Ript_Fitness_Backend.infrastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
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
import com.riptFitness.Ript_Fitness_Backend.domain.repository.ExerciseRepository;
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

    @Mock
    private ExerciseRepository exerciseRepository; // Add this mock

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
        
        // Initialize ExerciseDto
        exerciseDto = new ExerciseDto();
        exerciseDto.setExerciseId(1L);
        exerciseDto.setNameOfExercise("Test Exercise");
        // Other fields can be set as needed
        
        // List of exercise IDs for the workoutDto
        List<Long> exerciseIds = new ArrayList<>();
        exerciseIds.add(exerciseDto.getExerciseId());
        
        // Initialize WorkoutsDto
        workoutDto = new WorkoutsDto();
        workoutDto.setWorkoutsId(1L);
        workoutDto.setName("Test Workout");
        workoutDto.setExerciseIds(exerciseIds);
        
        workoutDto2 = new WorkoutsDto();
        workoutDto2.setWorkoutsId(2L);
        workoutDto2.setName("Workout 2");
        
        // Initialize AccountsModel
        account = new AccountsModel();
        account.setId(1L);
        // Other fields can be set as needed
        
        // Initialize ExerciseModel
        exercise = new ExerciseModel();
        exercise.setExerciseId(1L);
        exercise.setNameOfExercise("Test Exercise");
        // Set the workout in the exercise (optional based on your data model)
        // exercise.setWorkout(workout); // Commented out to avoid circular reference in setup
        
        // List of exercises for the workout
        List<ExerciseModel> exercises = new ArrayList<>();
        exercises.add(exercise);
        
        // Initialize Workouts
        workout = new Workouts();
        workout.workoutsId = (1L);
        workout.name = ("Test Workout");
        workout.setAccount(account);
        workout.setExercises(exercises);
        
        // Set the workout in the exercise after initializing workout
        exercise.setWorkout(workout);
        
        workout2 = new Workouts();
        workout2.workoutsId = (2L);
        workout2.name = ("Workout 2");
        workout2.setAccount(account);
        // Add exercises if needed
    }

    @Test
    public void testAddWorkout() {
        // Mock dependencies
        when(accountsService.getLoggedInUserId()).thenReturn(1L);
        when(accountsRepository.findById(1L)).thenReturn(Optional.of(account));
        when(exerciseRepository.findById(1L)).thenReturn(Optional.of(exercise));
        when(workoutsRepository.save(any(Workouts.class))).thenAnswer(invocation -> {
            Workouts savedWorkout = invocation.getArgument(0);
            savedWorkout.workoutsId = (1L); // Simulate auto-generated ID
            return savedWorkout;
        });
        when(workoutsRepository.findById(1L)).thenReturn(Optional.of(workout));
        
        // Call the service method
        WorkoutsDto result = workoutsService.addWorkout(workoutDto);
        
        // Assertions
        assertNotNull(result);
        assertEquals("Test Workout", result.getName());
        assertNotNull(result.getExerciseIds());
        assertEquals(1, result.getExerciseIds().size());
        assertEquals(1L, result.getExerciseIds().get(0));
    }

    @Test
    public void testGetWorkoutById() {
        when(workoutsRepository.findById(1L)).thenReturn(Optional.of(workout));

        WorkoutsDto result = workoutsService.getWorkout(1L);
        assertNotNull(result);
        assertEquals("Test Workout", result.getName());
        assertNotNull(result.getExerciseIds());
        assertEquals(1, result.getExerciseIds().size());
        assertEquals(1L, result.getExerciseIds().get(0));
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
        assertEquals(expectedWorkouts.get(0).name, actualWorkouts.get(0).getName());
        assertEquals(expectedWorkouts.get(1).name, actualWorkouts.get(1).getName());
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
        when(workoutsRepository.save(any(Workouts.class))).thenAnswer(invocation -> invocation.getArgument(0));

        WorkoutsDto result = workoutsService.updateWorkout(1L, workoutDto);
        assertNotNull(result);
        assertEquals("Test Workout", result.getName());
    }
    
    @Test
    public void testUpdateWorkoutInvalid() {
        when(workoutsRepository.findById(100L)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> workoutsService.updateWorkout(100L, workoutDto));
    }

    @Test
    public void testDeleteWorkout() {
        when(workoutsRepository.findById(1L)).thenReturn(Optional.of(workout));
        when(workoutsRepository.save(any(Workouts.class))).thenAnswer(invocation -> invocation.getArgument(0));

        WorkoutsDto result = workoutsService.deleteWorkout(1L);
        assertNotNull(result);
        assertTrue(result.isIsDeleted());
    }
    
    @Test
    public void testDeleteWorkoutInvalid() {
        when(workoutsRepository.findById(100L)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> workoutsService.deleteWorkout(100L));
    }
}
