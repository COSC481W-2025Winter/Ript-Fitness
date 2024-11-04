package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.riptFitness.Ript_Fitness_Backend.domain.model.ExerciseModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Workouts;
import com.riptFitness.Ript_Fitness_Backend.web.dto.ExerciseDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutsDto;


@Mapper
public interface WorkoutsMapper {
	WorkoutsMapper INSTANCE = Mappers.getMapper(WorkoutsMapper.class);
	
	WorkoutsDto toWorkoutsDto(Workouts workouts);
	
	Workouts toWorkouts(WorkoutsDto workoutsDto);
	
	List<WorkoutsDto> toListWorkoutsDto(List<Workouts> workoutsL);
	
	@Mapping(target = "workoutsId", ignore = true)
	void updateWorkoutRowFromDto(WorkoutsDto workoutsDto, @MappingTarget Workouts workouts);
	
	@Mapping(target = "exerciseId", ignore = true) 
    void updateExercisesFromDto(List<ExerciseDto> exercisesDtos, @MappingTarget List<ExerciseModel> Exercises);
}
