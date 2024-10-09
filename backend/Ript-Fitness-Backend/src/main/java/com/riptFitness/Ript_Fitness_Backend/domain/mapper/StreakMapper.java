package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Streak;
import com.riptFitness.Ript_Fitness_Backend.web.dto.StreakDto;

@Mapper 	//Tells Spring Boot this is a Mapper class
public interface StreakMapper {
	StreakMapper INSTANCE = Mappers.getMapper(StreakMapper.class);
	
	StreakDto toStreakDto(Streak streak);
	
	Streak toStreak(StreakDto streakDto);
	
	@Mapping(target = "id", ignore = true)
	void updateStreakRowFromDto(StreakDto streakDto, @MappingTarget Streak streak);
}
