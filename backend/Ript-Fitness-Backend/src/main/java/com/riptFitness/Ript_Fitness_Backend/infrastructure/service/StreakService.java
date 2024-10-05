package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.StreakMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Streak;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.StreakRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.StreakDto;

@Service
public class StreakService {
	
	private StreakRepository streakRepository;
	
	public StreakService(StreakRepository streakRepository) {
		this.streakRepository = streakRepository;
	}
	
	public StreakDto updateStreak(StreakDto streakDto) {
		LocalDateTime curTime = LocalDateTime.now();
		LocalDateTime prevLogin = streakDto.prevLogin;
		Streak streak = StreakMapper.INSTANCE.toStreak(streakDto);
		
		if(curTime.isBefore(prevLogin.plusDays(1))) {//Checks to see if the current time is last than 1 day before the last login
			streak.currentSt++;
			streakRepository.save(streak);
		} else {
			streak.currentSt = 0;
			streakRepository.save(streak);
		}
		streak.prevLogin = curTime;
		return StreakMapper.INSTANCE.toStreakDto(streak);
	}
	
	public StreakDto getStreak(Long id) {
		
		return null;
	}
}
