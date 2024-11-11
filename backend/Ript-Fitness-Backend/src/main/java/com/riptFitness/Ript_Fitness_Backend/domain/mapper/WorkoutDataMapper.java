package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.riptFitness.Ript_Fitness_Backend.domain.model.WorkoutData;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutDataDto;


@Mapper
public interface WorkoutDataMapper {
	
	WorkoutsMapper INSTANCE = Mappers.getMapper(WorkoutsMapper.class);

    WorkoutDataDto toWorkoutDataDto(WorkoutData workoutData);

    WorkoutData toWorkoutData(WorkoutDataDto workoutDataDto);

    @Mapping(target = "dataId", ignore = true)
    void updateWorkoutRowFromDto(WorkoutDataDto workoutDataDto, @MappingTarget WorkoutData workoutData);
}
