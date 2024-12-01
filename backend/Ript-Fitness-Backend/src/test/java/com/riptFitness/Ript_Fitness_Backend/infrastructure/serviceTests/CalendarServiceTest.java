package com.riptFitness.Ript_Fitness_Backend.infrastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Calendar;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.CalendarRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.UserProfileRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.CalendarService;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.SecurityConfig;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.AccountsService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.CalendarDto;

@ActiveProfiles("test")
@Import(SecurityConfig.class)
public class CalendarServiceTest {

    @Mock
    private CalendarRepository calendarRepository;

    @Mock
    private AccountsRepository accountsRepository;

    @Mock
    private AccountsService accountsService;

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private CalendarService calendarService;

    private AccountsModel account;
    private UserProfile userProfile;
    private Calendar calendarEntry;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        // Mock account and user profile
        account = new AccountsModel();
        account.setId(1L);

        userProfile = new UserProfile();
        userProfile.setRestDaysLeft(3);
        userProfile.setRestDays(3);
        userProfile.setRestResetDate(LocalDate.now());

        // Mock a calendar entry
        calendarEntry = new Calendar(account, LocalDate.now(), 1); // Activity type 1 = Workout

        // Mock repository responses
        when(accountsService.getLoggedInUserId()).thenReturn(1L);
        when(accountsRepository.findById(1L)).thenReturn(Optional.of(account));
        when(userProfileRepository.findUserProfileByAccountId(1L)).thenReturn(Optional.of(userProfile));
    }

    @Test
    public void testLogWorkoutDay() {
        when(calendarRepository.findByAccountIdAndDate(1L, LocalDate.now())).thenReturn(Optional.empty());

        calendarService.logWorkoutDay();

        verify(calendarRepository, times(1)).save(any(Calendar.class)); // Verify save is called once
    }

    @Test
    public void testLogWorkoutDayAlreadyLogged() {
        when(calendarRepository.findByAccountIdAndDate(1L, LocalDate.now())).thenReturn(Optional.of(calendarEntry));

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            calendarService.logWorkoutDay();
        });

        assertEquals("Workout already logged for this date.", exception.getMessage());
    }

    @Test
    public void testLogRestDay() {
        when(calendarRepository.findByAccountIdAndDate(1L, LocalDate.now())).thenReturn(Optional.empty());

        calendarService.logRestDay();

        verify(calendarRepository, times(1)).save(any(Calendar.class)); // Verify save is called once
        assertEquals(2, userProfile.getRestDaysLeft()); // Verify restDaysLeft is decremented
    }

    @Test
    public void testLogRestDayNoRestDaysLeft() {
        userProfile.setRestDaysLeft(0);

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            calendarService.logRestDay();
        });

        assertEquals("No rest days left for this week.", exception.getMessage());
    }

    @Test
    public void testLogRestDayAlreadyLogged() {
        when(calendarRepository.findByAccountIdAndDate(1L, LocalDate.now())).thenReturn(Optional.of(calendarEntry));

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            calendarService.logRestDay();
        });

        assertEquals("Rest day already logged for this date.", exception.getMessage());
    }

    @Test
    public void testGetMonth() {
        // Mock calendar entries for a date range
        when(calendarRepository.findByAccountIdAndDateBetween(1L, LocalDate.of(2024, 11, 1), LocalDate.of(2024, 11, 30)))
            .thenReturn(List.of(calendarEntry));

        List<CalendarDto> calendarDtos = calendarService.getMonth(LocalDate.of(2024, 11, 1), LocalDate.of(2024, 11, 30));

        assertNotNull(calendarDtos);
        assertEquals(1, calendarDtos.size());
        assertEquals(LocalDate.now(), calendarDtos.get(0).getDate());
        assertEquals(1, calendarDtos.get(0).getActivityType()); // Check if activity type is workout
    }
}
