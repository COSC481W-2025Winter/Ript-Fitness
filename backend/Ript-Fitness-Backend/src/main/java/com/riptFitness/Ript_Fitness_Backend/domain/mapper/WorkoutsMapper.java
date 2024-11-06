package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.riptFitness.Ript_Fitness_Backend.domain.model.ExerciseModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Workouts;
import com.riptFitness.Ript_Fitness_Backend.web.dto.WorkoutsDto;

@Mapper
public interface WorkoutsMapper {
    WorkoutsMapper INSTANCE = Mappers.getMapper(WorkoutsMapper.class);

    @Mapping(target = "exerciseIds", expression = "java(mapExerciseIds(workouts))")
    WorkoutsDto toWorkoutsDto(Workouts workouts);

    @Mapping(target = "exercises", ignore = true) // To avoid mapping exercises directly
    Workouts toWorkouts(WorkoutsDto workoutsDto);

    List<WorkoutsDto> toListWorkoutsDto(List<Workouts> workoutsL);

    @Mapping(target = "workoutsId", ignore = true)
    void updateWorkoutRowFromDto(WorkoutsDto workoutsDto, @MappingTarget Workouts workouts);

    default List<Long> mapExerciseIds(Workouts workout) {
        if (workout.getExercises() == null || workout.getExercises().isEmpty()) {
            return null;
        }
        return workout.getExercises().stream()
            .map(ExerciseModel::getExerciseId)
            .collect(Collectors.toList());
    }
}
