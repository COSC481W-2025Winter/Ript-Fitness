package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import org.springframework.stereotype.Service;
import java.util.Optional;

import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.WorkoutsRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutsDto;

@Service
public class WorkoutsService {
	
	private WorkoutsRepository workoutsRepository;
	private final AccountsRepository accountsRepository;
	private final AccountsService accountsService;
	
	public WorkoutsService(WorkoutsRepository workoutsRepository, AccountsService accountsService, AccountsRepository accountsRepository) {
		this.workoutsRepository = workoutsRepository;
		this.accountsService = accountsService;
		this.accountsRepository = accountsRepository;
	}
	
	public WorkoutsDto addWorkout(Long id) {
		
		return null;
	}

}
