package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.web.dto.AccountsDto;

@Mapper
public interface AccountsMapper {
	// Creates a singleton instance of the AccountsMapper interface using MapStruct's Mappers factory.
	// This allows you to call the mapping methods defined in AccountsMapper without implementing the interface manually.
	AccountsMapper INSTANCE = Mappers.getMapper(AccountsMapper.class);
	
	// Convert AccountsModel to AccountsDto
    AccountsDto convertToDto(AccountsModel accountsModel);

    // Convert AccountsDto to AccountsModel
    AccountsModel convertToModel(AccountsDto accountsDto);
	
	// Ignore the "id" when mapping because the database handles this operation (Auto-Incrementing)
	@Mapping(target = "id", ignore = true) 
	void updateAccountsRowFromDto(AccountsDto accountsDto, @MappingTarget AccountsModel accountsModel); 
	// @MappingTarget TestModel testModel: 
	//	This parameter annotation tells MapStruct that this method will not create a new TestModel instance 
	//	but will instead modify the existing TestModel object provided. 
	//	This is used to apply changes from a TestDto to an existing entity in the database.
}