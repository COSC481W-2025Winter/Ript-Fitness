package com.riptFitness.Ript_Fitness_Backend.web.dto;

import org.springframework.data.annotation.Id;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class NoteDto {
	
	public Long noteId;
    public AccountsModel account; // Reference to the account that owns this exercise
	public String title; // Title of the note (Ex: My Push day 11/14/24)
	public String description; // Description of the Note (Ex: I did 12 push ups)
	public boolean isDeleted; // Soft deletion

}
