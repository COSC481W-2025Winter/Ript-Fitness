package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;

public class NoteDto {
	
	public Long noteId;
	public String title; // Title of the note (Ex: My Push day 11/14/24)
	public String description; // Description of the Note (Ex: I did 12 push ups)
	public boolean isDeleted; // Soft deletion
	public LocalDateTime updatedAt;
}
