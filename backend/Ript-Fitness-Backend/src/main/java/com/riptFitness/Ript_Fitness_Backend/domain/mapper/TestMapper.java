package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.riptFitness.Ript_Fitness_Backend.domain.model.TestModel;
import com.riptFitness.Ript_Fitness_Backend.web.dto.TestDto;

@Mapper // This marks the interface as a mapper.
//				A mapper handles mapping between different types of objects (regular objkects and DTO's)
public interface TestMapper {
	//Can implement an automapper if we want to! We don't have to :)
	
	TestMapper INSTANCE = Mappers.getMapper(TestMapper.class);
	
	TestDto toTestDto(TestModel testDto);
	// This method declaration is for converting a TestModel object into a TestDto object. 
	//	MapStruct generates the implementation that will automatically map all matching fields from TestModel to TestDto
	
	TestModel toTestModel(TestDto testDto);
	// Similarly, this method maps from TestDto back to TestModel.
	// 	It is particularly useful for operations like creating or updating entities based on data received from API clients.
	
	
	@Mapping(target = "id", ignore = true) 
	// Ignore the "id" when mapping because the database handles this operation (Auto-Incrementing)
	
	void updateTestRowFromDto(TestDto testDto, @MappingTarget TestModel testModel); 
	// @MappingTarget TestModel testModel: 
	//	This parameter annotation tells MapStruct that this method will not create a new TestModel instance 
	//	but will instead modify the existing TestModel object provided. 
	//	This is used to apply changes from a TestDto to an existing entity in the database.
	
}
