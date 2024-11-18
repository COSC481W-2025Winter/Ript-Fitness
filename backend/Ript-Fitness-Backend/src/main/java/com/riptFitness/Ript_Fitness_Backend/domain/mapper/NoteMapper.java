package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Note;
import com.riptFitness.Ript_Fitness_Backend.web.dto.NoteDto;

@Mapper
public interface NoteMapper {
	
	// Create singleton instance
	NoteMapper INSTANCE = Mappers.getMapper(NoteMapper.class);
	
	// Convert a Note to a DTO
	NoteDto convertToDto(Note note);
	
	// Convert a DTO to a Note
	Note convertToNote(NoteDto noteDto);
	
}
