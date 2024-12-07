package com.riptFitness.Ript_Fitness_Backend.infrastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
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
		userProfile.setRestResetDate(LocalDateTime.now());
		userProfile.setAccount(account);
		userProfile.setTimeZone("Etc/GMT+5"); // Set a default time zone

		// Mock a calendar entry
		calendarEntry = new Calendar(account, LocalDateTime.now(), 1, "ETC/GMT+5"); // Activity type 1 = Workout
		calendarEntry.setTimeZoneWhenLogged("Etc/GMT+5"); // Set the time zone for calendar entries

		// Mock repository responses
		when(accountsService.getLoggedInUserId()).thenReturn(1L);
		when(accountsRepository.findById(1L)).thenReturn(Optional.of(account));
		when(userProfileRepository.findUserProfileByAccountId(1L)).thenReturn(Optional.of(userProfile));
	}

	@Test
	public void testLogWorkoutDay() {
		when(calendarRepository.findTopByAccountIdOrderByDateDesc(1L)).thenReturn(Optional.empty());
		calendarService.logWorkoutDay("ETC/GMT+5");
		verify(calendarRepository, times(1)).save(any(Calendar.class));
	}

	@Test
	public void testLogWorkoutDayAlreadyLogged() {
		Calendar existingEntry = new Calendar(account, LocalDateTime.now(), 1, "ETC/GMT+5"); // Activity type 1 = Workout
		existingEntry.setTimeZoneWhenLogged("Etc/GMT+5"); // Set a valid time zone
		when(calendarRepository.findTopByAccountIdOrderByDateDesc(1L)).thenReturn(Optional.of(existingEntry));

		IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
			calendarService.logWorkoutDay("ETC/GMT+5");
		});

		assertEquals("Rest day already logged for this date.", exception.getMessage());
	}

	@Test
	public void testLogRestDay() {
		userProfile.setRestDaysLeft(2);
		when(calendarRepository.findTopByAccountIdOrderByDateDesc(1L)).thenReturn(Optional.empty());
		when(userProfileRepository.findUserProfileByAccountId(1L)).thenReturn(Optional.of(userProfile));

		calendarService.logRestDay("ETC/GMT+5");

		verify(calendarRepository, times(1)).save(any(Calendar.class));
		assertEquals(1, userProfile.getRestDaysLeft());
	}

	@Test
	public void testLogRestDayNoRestDaysLeft() {
		userProfile.setRestDaysLeft(0);
		when(userProfileRepository.findUserProfileByAccountId(1L)).thenReturn(Optional.of(userProfile));

		IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
			calendarService.logRestDay("ETC/GMT+5");
		});

		assertEquals("No rest days left for this week.", exception.getMessage());
	}

	@Test
	public void testLogRestDayAlreadyLogged() {
		Calendar existingEntry = new Calendar(account, LocalDateTime.now(), 2, "ETC/GMT+5"); // Activity type 2 = Rest day
		existingEntry.setTimeZoneWhenLogged("Etc/GMT+5"); // Ensure the time zone is set
		when(calendarRepository.findTopByAccountIdOrderByDateDesc(1L)).thenReturn(Optional.of(existingEntry));

		IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
			calendarService.logRestDay("ETC/GMT+5");
		});

		assertEquals("Rest day already logged for this date.", exception.getMessage());
	}

	@Test
	public void testGetMonth() {
		when(calendarRepository.findByAccountIdAndDateBetween(1L, LocalDateTime.of(2024, 11, 1, 0, 0),
				LocalDateTime.of(2024, 11, 30, 23, 59))).thenReturn(List.of(calendarEntry));

		List<CalendarDto> calendarDtos = calendarService.getMonth(LocalDateTime.of(2024, 11, 1, 0, 0),
				LocalDateTime.of(2024, 11, 30, 23, 59));

		assertNotNull(calendarDtos);
		assertEquals(1, calendarDtos.size());
		assertEquals(calendarEntry.getDate(), calendarDtos.get(0).getDate());
		assertEquals(1, calendarDtos.get(0).getActivityType());
	}
}
