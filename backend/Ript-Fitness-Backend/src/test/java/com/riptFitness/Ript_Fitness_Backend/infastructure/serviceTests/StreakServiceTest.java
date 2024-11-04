package com.riptFitness.Ript_Fitness_Backend.infastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.ActiveProfiles;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Streak;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.StreakRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.StreakService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.StreakDto;

@ActiveProfiles("test")
public class StreakServiceTest {

	@Mock
	private StreakRepository streakRepository;

	@InjectMocks
	private StreakService streakServiceForServiceTest;

	private StreakDto streakDto;
	private Streak streak;
	private StreakDto streakDtoTwo;
	private Streak streakTwo;
	private StreakDto streakDtoThree;
	private Streak streakThree;
	private StreakDto streakDtoFour;
	private Streak streakFour;

	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);

		streakDto = new StreakDto();
		streakDto.id = (long) 100;
		streakDto.currentSt = 10;
		streakDto.prevLogin = LocalDateTime.now();

		streak = new Streak();
		streak.id = (long) 100;
		streak.currentSt = 10;
		streak.prevLogin = LocalDateTime.now();

		streakDtoTwo = new StreakDto();
		streakDtoTwo.id = (long) 101;
		streakDtoTwo.currentSt = 10;
		streakDtoTwo.prevLogin = LocalDateTime.now().minusDays(1);

		streakTwo = new Streak();
		streakTwo.id = (long) 101;
		streakTwo.currentSt = 10;
		streakTwo.prevLogin = LocalDateTime.now().minusDays(1);
		
		streakDtoThree = new StreakDto();
		streakDtoThree.id = (long) 102;
		streakDtoThree.currentSt = 10;
		streakDtoThree.prevLogin = LocalDateTime.of(2024, 12, 31, 10, 0);

		streakThree = new Streak();
		streakThree.id = (long) 102;
		streakThree.currentSt = 10;
		streakThree.prevLogin = LocalDateTime.of(2024, 12, 31, 10, 0);
		
		streakDtoFour = new StreakDto();
		streakDtoFour.id = (long) 103;
		streakDtoFour.currentSt = 10;
		streakDtoFour.prevLogin = LocalDateTime.of(2023, 12, 31, 10, 0);

		streakFour = new Streak();
		streakFour.id = (long) 103;
		streakFour.currentSt = 10;
		streakFour.prevLogin = LocalDateTime.of(2023, 12, 31, 10, 0);

	}

	@Test
	void testServiceGetStreakValidId() {
		when(streakRepository.findById((long) 100)).thenReturn(Optional.of(streak));

		StreakDto result = streakServiceForServiceTest.getStreak((long) 100);
		assertNotNull(result);
		assertEquals(10, result.currentSt);
	}

	@Test
	void testServiceGetStreakInvalidId() {
		when(streakRepository.findById((long) 100)).thenReturn(Optional.empty());

		assertThrows(RuntimeException.class, () -> streakServiceForServiceTest.getStreak((long) 100));
	}

	@Test
	void testServiceUpdateStreakValidId() {
		when(streakRepository.findById((long) 100)).thenReturn(Optional.of(streak));

		StreakDto result = streakServiceForServiceTest.updateStreak((long) 100);

		assertNotNull(result);
		assertEquals(10, result.currentSt);

	}

	@Test
	void testServiceUpdateStreakInValidId() {
		when(streakRepository.findById((long) 100)).thenReturn(Optional.empty());

		assertThrows(RuntimeException.class, () -> streakServiceForServiceTest.updateStreak((long) 100));

	}

	@Test
	void testServiceUpdateStreakNextDay() {
		when(streakRepository.findById((long) 101)).thenReturn(Optional.of(streakTwo));

		StreakDto result = streakServiceForServiceTest.updateStreak((long) 101);

		// System.out.println(result.prevLogin);
		assertNotNull(result);
		assertEquals(11, result.currentSt);

	}
	@Test
	void testServiceUpdateStreakMissedDay() {
		when(streakRepository.findById((long) 103)).thenReturn(Optional.of(streakFour));

		StreakDto result = streakServiceForServiceTest.updateStreak((long) 103);

		// System.out.println(result.prevLogin);
		assertNotNull(result);
		assertEquals(0, result.currentSt);

	}

	@Test
	void testServiceUpdateStreakLeapYear() {
		LocalDateTime mockCurrentTime = LocalDateTime.of(2025, 1, 1, 10, 0);

        MockedStatic<LocalDateTime> mockedStatic = mockStatic(LocalDateTime.class);
        mockedStatic.when(LocalDateTime::now).thenReturn(mockCurrentTime);
        
        
		when(streakRepository.findById((long) 102)).thenReturn(Optional.of(streakThree));

		StreakDto result = streakServiceForServiceTest.updateStreak((long) 102);
		
		//System.out.println(result.prevLogin);
		assertNotNull(result);
		assertEquals(11, result.currentSt);
		mockedStatic.close();
	}
	
	@Test
	void testServiceUpdateStreakNewYears() {
		LocalDateTime mockCurrentTime = LocalDateTime.of(2024, 1, 1, 10, 0);

        MockedStatic<LocalDateTime> mockedStatic = mockStatic(LocalDateTime.class);
        mockedStatic.when(LocalDateTime::now).thenReturn(mockCurrentTime);
        
        
		when(streakRepository.findById((long) 103)).thenReturn(Optional.of(streakThree));

		StreakDto result = streakServiceForServiceTest.updateStreak((long) 103);
		
		//System.out.println(result.prevLogin);
		assertNotNull(result);
		assertEquals(11, result.currentSt);
		mockedStatic.close();
	}

}