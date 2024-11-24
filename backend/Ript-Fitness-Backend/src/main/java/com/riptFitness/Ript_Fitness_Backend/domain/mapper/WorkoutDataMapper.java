package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.riptFitness.Ript_Fitness_Backend.domain.model.WorkoutData;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutDataDto;


@Mapper
public interface WorkoutDataMapper {
	
	WorkoutDataMapper INSTANCE = Mappers.getMapper(WorkoutDataMapper.class);

    WorkoutDataDto toWorkoutDataDto(WorkoutData workoutData);
    
    @Mapping(target = "account", ignore = true)
    WorkoutData toWorkoutData(WorkoutDataDto workoutDataDto);

    @Mapping(target = "dataId", ignore = true)
    void updateWorkoutDataRowFromDto(WorkoutDataDto workoutDataDto, @MappingTarget WorkoutData workoutData);
}
