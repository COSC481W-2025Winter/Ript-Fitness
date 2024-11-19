package com.riptFitness.Ript_Fitness_Backend.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.NoteService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.NoteDto;

@RestController
@RequestMapping("/note")
public class NoteController {

	public NoteService noteService;

	public NoteController(NoteService noteService) {
		this.noteService = noteService;
	}

	// Endpoint for add Note:
	@PostMapping("/addNote")
	public ResponseEntity<NoteDto> addNote(@RequestBody NoteDto noteDto) {
		NoteDto newNote = noteService.addNote(noteDto);
		return new ResponseEntity<>(newNote, HttpStatus.CREATED);
	}

	// Endpoint for deleting a note:
	@DeleteMapping("/deleteNote/{noteId}")
	public ResponseEntity<NoteDto> deleteNote(@PathVariable Long noteId) {
		NoteDto deletedNote = noteService.deleteNote(noteId);
		return new ResponseEntity<>(deletedNote, HttpStatus.NO_CONTENT);
	}

	// Endpoint for editing a note
	@PutMapping("/editNote/{noteId}")
	public ResponseEntity<NoteDto> editNote(@PathVariable Long noteId, @RequestBody NoteDto editedNoteDto) {
		NoteDto editedNote = noteService.editNote(noteId, editedNoteDto);
		return new ResponseEntity<>(editedNote, HttpStatus.OK);
	}

	// Endpoint for getting all notes from user ID
	@GetMapping("/getAllNotesFromLoggedInUser")
	public ResponseEntity<List<NoteDto>> getAllNotesFromLoggedInUser() {
		List<NoteDto> listOfNotesFromUser = noteService.getAllNotesFromLoggedInUser();
		return new ResponseEntity<>(listOfNotesFromUser, HttpStatus.OK);
	}

	// Endpoint for getting notes based on keyword
	@GetMapping("getNotesBasedOnKeyword/{keyword}")
	public ResponseEntity<List<NoteDto>> getNotesBasedOnKeyword(@PathVariable String keyword) {
		List<NoteDto> listWithKeyword = noteService.getNotesBasedOnKeyword(keyword);
		return new ResponseEntity<>(listWithKeyword, HttpStatus.OK);
	}

}