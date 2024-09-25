package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Food;
import com.riptFitness.Ript_Fitness_Backend.web.dto.FoodDto;

@Mapper		//Tells Spring Boot this is a Mapper class, this is REQUIRED
public interface FoodMapper {
	FoodMapper INSTANCE = Mappers.getMapper(FoodMapper.class);
	
	FoodDto toFoodDto(Food food);
	
	Food toFood(FoodDto foodDto);
	
	@Mapping(target = "id", ignore = true)
	void updateFoodRowFromDto(FoodDto foodDto, @MappingTarget Food food);
}
