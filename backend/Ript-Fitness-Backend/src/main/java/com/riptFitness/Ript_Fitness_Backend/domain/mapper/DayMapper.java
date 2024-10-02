package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Day;
import com.riptFitness.Ript_Fitness_Backend.web.dto.DayDto;

@Mapper		//Tells Spring Boot this is a Mapper class, this is REQUIRED
public interface DayMapper {
	DayMapper INSTANCE = Mappers.getMapper(DayMapper.class);
	
	DayDto toDayDto(Day day);
	
	Day toDay(DayDto dayDto);
	
	@Mapping(target = "id", ignore = true)
	void updateFoodRowFromDto(DayDto dayDto, @MappingTarget Day day);
}

