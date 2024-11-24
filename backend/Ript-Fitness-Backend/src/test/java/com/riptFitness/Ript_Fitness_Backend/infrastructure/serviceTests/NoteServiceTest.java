package com.riptFitness.Ript_Fitness_Backend.infrastructure.serviceTests;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.NoteMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Note;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.NoteRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.AccountsService;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.NoteService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.NoteDto;

@ExtendWith(MockitoExtension.class)
public class NoteServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private AccountsRepository accountsRepository;

    @Mock
    private AccountsService accountsService;

    @InjectMocks
    private NoteService noteService;

    private AccountsModel accountsModel;
    private Note note;
    private NoteDto noteDto;

    @BeforeEach
    public void setUp() {
        // Mock account
        accountsModel = new AccountsModel();
        accountsModel.setId(1L);

        // Mock Note
        note = new Note();
        note.setNoteId(1L);
        note.setTitle("Test Note");
        note.setDescription("This is a test note.");
        note.setAccount(accountsModel);
        note.setDeleted(false);

        // Mock NoteDto
        noteDto = new NoteDto();
        noteDto.noteId = 1L;
        noteDto.title = "Test Note";
        noteDto.description = "This is a test note.";
        noteDto.isDeleted = false;
    }

    @Test
    public void testAddNote() {
        // Arrange
        when(accountsService.getLoggedInUserId()).thenReturn(1L);
        when(accountsRepository.findById(1L)).thenReturn(Optional.of(accountsModel));
        when(noteRepository.save(any(Note.class))).thenReturn(note);
       

        // Act
        NoteDto savedNote = noteService.addNote(noteDto);

        // Assert
        assertNotNull(savedNote);
        assertEquals("Test Note", savedNote.title);
        verify(noteRepository).save(any(Note.class));
    }

    @Test
    public void testDeleteNote_Success() {
        // Arrange
        when(accountsService.getLoggedInUserId()).thenReturn(1L);
        when(noteRepository.findByLoggedInIdAndNoteId(1L, 1L)).thenReturn(Optional.of(note));

        // Act
        NoteDto deletedNote = noteService.deleteNote(1L);

        // Assert
        assertNotNull(deletedNote);
    }

    @Test
    public void testDeleteNote_NotFound() {
        // Arrange
        when(accountsService.getLoggedInUserId()).thenReturn(1L);
        when(noteRepository.findByLoggedInIdAndNoteId(1L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> noteService.deleteNote(1L));
        assertEquals("Note not found for the current user, or the note has already been deleted.", exception.getMessage());
    }

    @Test
    public void testEditNote_Success() {
        // Arrange
        NoteDto editedNoteDto = new NoteDto();
        editedNoteDto.title = "Updated Note";
        editedNoteDto.description = "Updated description.";

        when(accountsService.getLoggedInUserId()).thenReturn(1L);
        when(noteRepository.findByLoggedInIdAndNoteId(1L, 1L)).thenReturn(Optional.of(note));

        // Act
        NoteDto updatedNote = noteService.editNote(1L, editedNoteDto);

        // Assert
        assertNotNull(updatedNote);
        assertEquals("Updated Note", updatedNote.title);
        assertEquals("Updated description.", updatedNote.description);
        verify(noteRepository).save(note);
    }

    @Test
    public void testGetAllNotesFromLoggedInUser() {
        // Arrange
        when(accountsService.getLoggedInUserId()).thenReturn(1L);
        List<Note> notes = Arrays.asList(note);
        when(noteRepository.findByAccountIdAndNotDeleted(1L)).thenReturn(notes);

        // Act
        List<NoteDto> result = noteService.getAllNotesFromLoggedInUser();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Note", result.get(0).title);
    }

    @Test
    public void testGetNotesBasedOnKeyword() {
        // Arrange
        when(accountsService.getLoggedInUserId()).thenReturn(1L);
        List<Note> notes = Arrays.asList(note);
        when(noteRepository.findByAccountIdAndNotDeleted(1L)).thenReturn(notes);

        // Act
        List<NoteDto> result = noteService.getNotesBasedOnKeyword("test");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Note", result.get(0).title);
    }
}
