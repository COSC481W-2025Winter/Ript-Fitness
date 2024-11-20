package com.riptFitness.Ript_Fitness_Backend.web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.WorkoutDataService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutDataDto;

@RestController
@RequestMapping("/workoutData")
public class WorkoutDataController {

	public WorkoutDataService workoutDataService;
	
	public WorkoutDataController(WorkoutDataService workoutDataService) {
		this.workoutDataService = workoutDataService;
	}
	
	//adds workout data to the table
	@PostMapping("addWorkoutData")
	public ResponseEntity<WorkoutDataDto> addWorkoutData(@RequestBody WorkoutDataDto workoutDataDto){
		WorkoutDataDto newWorkoutData =workoutDataService.addWorkoutData(workoutDataDto);
		return ResponseEntity.ok(newWorkoutData);
	}
	
	//returns a WorkoutDataDto with the given ID
	@GetMapping("/{wDataId}")
	public ResponseEntity<WorkoutDataDto> getWorkoutData(@PathVariable Long wDataId){
		WorkoutDataDto newWorkoutData = workoutDataService.getWorkoutData(wDataId);
		return ResponseEntity.ok(newWorkoutData);
	}
	
	//returns a list of all workout Data that have the same name and is within the given index range
	@GetMapping("/getAllData/{startIndex}/{endIndex}/{exerciseName}")
	public ResponseEntity<List<WorkoutDataDto>> getAllWorkoutData(@PathVariable Integer startIndex, @PathVariable Integer endIndex, @PathVariable String exerciseName){
		List<WorkoutDataDto> returnedListOfData = workoutDataService.getAllWorkoutData(startIndex, endIndex, exerciseName);
		return ResponseEntity.ok(returnedListOfData);
	}
	
	//updates an existing workoutData
	@PutMapping("updateWorkoutData/{wDataId}")
	public ResponseEntity<WorkoutDataDto> updateWorkoutData(@PathVariable Long wDataId, @RequestBody WorkoutDataDto workoutDataDto) {
		WorkoutDataDto updatedWorkoutData = workoutDataService.updateWorkoutData(wDataId, workoutDataDto);
		return ResponseEntity.ok(updatedWorkoutData);
	}
	
	//Soft Deletes a given workout data
	@DeleteMapping("/deleteWorkoutData/{wDataId}")
	public ResponseEntity<WorkoutDataDto> deleteWorkoutData(@PathVariable Long wDataId){
		WorkoutDataDto deletedWorkoutData = workoutDataService.deleteWorkoutData(wDataId);
		return ResponseEntity.ok(deletedWorkoutData);
	}
	
}
