package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.NoteMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Note;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.NoteRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.NoteDto;

@Service
public class NoteService {
	// Create instances of neccesary classes:
	private final NoteRepository noteRepository;
	private final AccountsRepository accountsRepository;
	private final AccountsService accountsService;

	public NoteService(NoteRepository noteRepository, AccountsRepository accountsRepository,
			AccountsService accountsService) {
		this.noteRepository = noteRepository;
		this.accountsRepository = accountsRepository;
		this.accountsService = accountsService;
	}

	// Method to add a new note:
	public NoteDto addNote(NoteDto noteDto) {
		// Get the ID of the user that is trying to add the Note:
		Long currentUserId = accountsService.getLoggedInUserId();
		// Retrieve the account associated with the current user
		AccountsModel account = accountsRepository.findById(currentUserId)
				.orElseThrow(() -> new RuntimeException("Account not found"));
		// Convert DTO to model
		Note note = NoteMapper.INSTANCE.convertToNote(noteDto);
		// Set the account
		note.setAccount(account);
		// Save the Note
		noteRepository.save(note);
		// Convert back to DTO and return:
		return NoteMapper.INSTANCE.convertToDto(note);
	}

	// Method to delete note given noteID:
	public NoteDto deleteNote(Long noteId) {
		// Get the currently logged in user:
		Long currentUserId = accountsService.getLoggedInUserId();
		// Get the Note via note ID and user ID
		Optional<Note> optionalNote = noteRepository.findByLoggedInIdAndNoteId(noteId, currentUserId);
		// If we find a match, mark the isDeleted field true, then save it.
		
		System.out.println(optionalNote.toString());
		if (optionalNote.isPresent()) {
			Note deletedNote = optionalNote.get();
			deletedNote.setDeleted(true);
			noteRepository.save(deletedNote);
			return NoteMapper.INSTANCE.convertToDto(deletedNote);
		} else {
			throw new RuntimeException("Note not found for the current user, or the note has already been deleted.");
		}
	}

	// Method to edit Note given its Id:
	public NoteDto editNote(Long noteId, NoteDto editedNoteDto) {
		// Get the current logged in user id:
		Long currentUserId = accountsService.getLoggedInUserId();
		// Find the Note via currentUserId:
		Optional<Note> optionalNote = noteRepository.findByLoggedInIdAndNoteId(noteId, currentUserId);
		// Check to see if it exists:
		if(optionalNote.isPresent()) {
			Note editedNote = optionalNote.get();
			// Edit title & description
			editedNote.setTitle(editedNoteDto.title);
			editedNote.setDescription(editedNoteDto.description);
			// Save the edited note:
			noteRepository.save(editedNote);
			return NoteMapper.INSTANCE.convertToDto(editedNote);
		} else {
			throw new RuntimeException("The note for the user does not exist or it has been deleted");
		}
		
	}

	// Method to get all Notes from a logged in user:
	public List<NoteDto> getAllNotesFromLoggedInUser() {
		// Get logged in user ID:
		Long currentUserId = accountsService.getLoggedInUserId();
		// Get a list of all Notes:
		List<Note> listOfNotes = noteRepository.findByAccountIdAndNotDeleted(currentUserId);
		
		// convert the list to DTO's and return it:
		List<NoteDto> notes = new ArrayList<>();
		for(Note note : listOfNotes) {
			notes.add(NoteMapper.INSTANCE.convertToDto(note));
		}
		return notes;
	}

	
	// Method to get notes based on a title:
	public List<NoteDto> getNotesBasedOnKeyword(String keyword) {
		// Get the logged in user ID:
		Long currentUserId = accountsService.getLoggedInUserId();
		// Get a list of all Notes:
		List<Note> listOfAllNotes = noteRepository.findByAccountIdAndNotDeleted(currentUserId);
		
		// Initialize a new list that words with matching keywords can be added in:
		List<Note> keywordMatches = new ArrayList<>();
		for(Note note : listOfAllNotes) {
			if(note.getTitle().toLowerCase().contains(keyword.toLowerCase())) {
				keywordMatches.add(note);
			}
		}
		// Have an empty list of NoteDto that can be returned afterwards:
		List <NoteDto> listToBeReturned = new ArrayList<>();
		// Convert the keyword array to DTO:
		for(Note note : keywordMatches) {
			listToBeReturned.add(NoteMapper.INSTANCE.convertToDto(note));
		}
		return listToBeReturned;
	}
	
	
	
	
	
	
	
	
	
	
	
}
