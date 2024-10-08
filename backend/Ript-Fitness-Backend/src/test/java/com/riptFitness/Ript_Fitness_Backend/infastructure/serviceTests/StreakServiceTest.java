package com.riptFitness.Ript_Fitness_Backend.infastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Streak;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.StreakRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.StreakService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.StreakDto;

public class StreakServiceTest {
	
	@Mock
	private StreakRepository streakRepository;
	
	@InjectMocks
	private StreakService streakServiceForServiceTest;
	
	private StreakDto streakDto;
	private Streak streak;
	
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
}
