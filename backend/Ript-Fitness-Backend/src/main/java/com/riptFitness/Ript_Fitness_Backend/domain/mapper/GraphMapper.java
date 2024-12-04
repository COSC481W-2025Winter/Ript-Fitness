package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Graph;
import com.riptFitness.Ript_Fitness_Backend.web.dto.GraphDto;

@Mapper
public interface GraphMapper {
	GraphMapper INSTANCE = Mappers.getMapper(GraphMapper.class);
	
	GraphDto toGraphDto(Graph graph);
	
	Graph toGraph(GraphDto graphDto);
}
