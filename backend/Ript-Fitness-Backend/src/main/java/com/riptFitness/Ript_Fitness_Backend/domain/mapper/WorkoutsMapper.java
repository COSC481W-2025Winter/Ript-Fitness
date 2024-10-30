package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Workouts;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutsDto;


@Mapper
public interface WorkoutsMapper {
	WorkoutsMapper INSTANCE = Mappers.getMapper(WorkoutsMapper.class);
	
	WorkoutsDto toWorkoutsDto(Workouts workouts);
	
	Workouts toWorkouts(WorkoutsDto workoutsDto);
	
	List<WorkoutsDto> toListWorkoutsDto(List<Workouts> workoutsL);
	
	@Mapping(target = "id", ignore = true)
	void updateWorkoutRowFromDto(WorkoutsDto workoutsDto, @MappingTarget Workouts workouts);

}
