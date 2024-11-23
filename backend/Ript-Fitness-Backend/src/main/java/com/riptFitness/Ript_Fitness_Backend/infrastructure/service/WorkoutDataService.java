package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.WorkoutDataMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.WorkoutData;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.WorkoutDataRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutDataDto;

@Service
public class WorkoutDataService {
	
	private WorkoutDataRepository workoutDataRepository;
	private final AccountsRepository accountsRepository;
	private final AccountsService accountsService;
	
	public WorkoutDataService(WorkoutDataRepository workoutDataRepository,AccountsRepository accountsRepository, AccountsService accountsService) {
		this.workoutDataRepository = workoutDataRepository;
		this.accountsRepository = accountsRepository;
		this.accountsService = accountsService;
	}
	
	public WorkoutDataDto addWorkoutData(WorkoutDataDto workoutDataDto) {
		Long currentUserId = accountsService.getLoggedInUserId();
	    AccountsModel account = accountsRepository.findById(currentUserId)
	            .orElseThrow(() -> new RuntimeException("Account not found"));
	    
		WorkoutData newData = WorkoutDataMapper.INSTANCE.toWorkoutData(workoutDataDto);
		
		newData.setAccount(account);
		
		workoutDataRepository.save(newData);
		
		return WorkoutDataMapper.INSTANCE.toWorkoutDataDto(newData);
	}
	
	public WorkoutDataDto getWorkoutData(Long wDataId) {
		Optional<WorkoutData> optWData = workoutDataRepository.findById(wDataId);
		if(optWData.isEmpty()) {
			throw new RuntimeException("no workout data found with id = " + wDataId);
		}
		WorkoutData wData = optWData.get();
		return WorkoutDataMapper.INSTANCE.toWorkoutDataDto(wData);
	}
	
	public List<WorkoutDataDto> getAllWorkoutData(Integer startIndex, Integer endIndex, String exerciseName) {
		if(startIndex > endIndex)
			throw new RuntimeException("Start index cannot be greater than end index. Start index = " + startIndex + ", end index = " + endIndex);
		
		if(startIndex < 0 || endIndex < 0)
			throw new RuntimeException("Start index and end index must be greater than 0. Start index = " + startIndex + ", end index = " + endIndex);
		Long currentUserId = accountsService.getLoggedInUserId();
		AccountsModel account = accountsRepository.findById(currentUserId)
				.orElseThrow(() -> new RuntimeException("Account not found"));
		
		List<WorkoutData> wDataL = workoutDataRepository.findByAccountId(currentUserId);
		List<WorkoutDataDto> dataList = new ArrayList<>();
		
		
		for(WorkoutData wData : wDataL) {
			if(wData.getExerciseName().toLowerCase().equals(exerciseName)) {
				WorkoutDataDto workoutDataDto = WorkoutDataMapper.INSTANCE.toWorkoutDataDto(wData);
				dataList.add(workoutDataDto);
			}
		}
		
		
		return dataList.subList(startIndex, endIndex);
	}

	public WorkoutDataDto updateWorkoutData(Long wDataId, WorkoutDataDto workoutDataDto) {
		Optional<WorkoutData> optWData = workoutDataRepository.findById(wDataId);
		if(optWData.isEmpty()) {
			throw new RuntimeException("no workout data found with id = " + wDataId);
		}
		WorkoutData wDataToBeUpdated = optWData.get();
		
		WorkoutDataMapper.INSTANCE.updateWorkoutDataRowFromDto(workoutDataDto, wDataToBeUpdated);
		wDataToBeUpdated = workoutDataRepository.save(wDataToBeUpdated);
		
		return WorkoutDataMapper.INSTANCE.toWorkoutDataDto(wDataToBeUpdated);
	}
	
	public WorkoutDataDto deleteWorkoutData(Long wDataId) {
		Optional<WorkoutData> optWData = workoutDataRepository.findById(wDataId);
		if(optWData.isEmpty()) {
			throw new RuntimeException("no workout found with id = " + wDataId);
		}
		WorkoutData wDataToBeDeleted = optWData.get();
		wDataToBeDeleted.setDeleted(true);
		workoutDataRepository.save(wDataToBeDeleted);
		return WorkoutDataMapper.INSTANCE.toWorkoutDataDto(wDataToBeDeleted);
	}
	
	public Integer getMaxReps(String exerciseName) {
		Long currentUserId = accountsService.getLoggedInUserId();
		AccountsModel account = accountsRepository.findById(currentUserId)
				.orElseThrow(() -> new RuntimeException("Account not found"));
		
		List<WorkoutData> wDataL = workoutDataRepository.findByAccountId(currentUserId);
		List<WorkoutDataDto> dataList = new ArrayList<>();
		
		
		for(WorkoutData wData : wDataL) { //gets all data with the given exercise name
			if(wData.getExerciseName().toLowerCase().equals(exerciseName)) {
				WorkoutDataDto workoutDataDto = WorkoutDataMapper.INSTANCE.toWorkoutDataDto(wData);
				dataList.add(workoutDataDto);
			}
		}
		
		int max = 0;
		for(WorkoutDataDto wData: dataList) {//gets the max reps
			for(int i = 0; i < wData.getReps().size(); i++) {
				if(max < wData.getReps().get(i)) {
					max = wData.getReps().get(i);
				}
			}
		}
		
		return max;
	}
	
	public Integer getMaxWeight(String exerciseName) {
		
		Long currentUserId = accountsService.getLoggedInUserId();
		AccountsModel account = accountsRepository.findById(currentUserId)
				.orElseThrow(() -> new RuntimeException("Account not found"));
		
		List<WorkoutData> wDataL = workoutDataRepository.findByAccountId(currentUserId);
		List<WorkoutDataDto> dataList = new ArrayList<>();
		
		
		for(WorkoutData wData : wDataL) { //gets all data with the given exercise name
			if(wData.getExerciseName().toLowerCase().equals(exerciseName)) {
				WorkoutDataDto workoutDataDto = WorkoutDataMapper.INSTANCE.toWorkoutDataDto(wData);
				dataList.add(workoutDataDto);
			}
		}
		
		int max = 0;
		for(WorkoutDataDto wData: dataList) {//gets the max weight
			for(int i = 0; i < wData.getWeight().size(); i++) {
				if(max < wData.getWeight().get(i)) {
					max = wData.getWeight().get(i);
				}
			}
		}
		
		return max;
	}
}
