package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.JwtUtil;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.SecurityConfig;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.NoteService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.NoteController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.NoteDto;

@WebMvcTest(NoteController.class)
@ActiveProfiles("test")
@Import(SecurityConfig.class)
public class NoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NoteService noteService; // MockBean ensures NoteService is available in the context

    private NoteDto noteDto;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;
    
    @BeforeEach
    public void setUp() {
        noteDto = new NoteDto();
        noteDto.noteId = 1L;
        noteDto.title = "Test Note";
        noteDto.description = "This is a test note.";
        noteDto.isDeleted = false;
    }

    @Test
    public void testAddNote() throws Exception {
        when(noteService.addNote(any(NoteDto.class))).thenReturn(noteDto);

        mockMvc.perform(post("/note/addNote")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(noteDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.noteId").value(1))
                .andExpect(jsonPath("$.title").value("Test Note"))
                .andExpect(jsonPath("$.description").value("This is a test note."))
                .andExpect(jsonPath("$.isDeleted").value(false));
    }

    @Test
    public void testDeleteNote() throws Exception {
        when(noteService.deleteNote(anyLong())).thenReturn(noteDto);

        mockMvc.perform(delete("/note/deleteNote/1"))
                .andExpect(status().isNoContent())
                .andExpect(jsonPath("$.noteId").value(1))
                .andExpect(jsonPath("$.isDeleted").value(false));
    }

    @Test
    public void testEditNote() throws Exception {
        NoteDto editedNoteDto = new NoteDto();
        editedNoteDto.title = "Updated Note";
        editedNoteDto.description = "Updated Description";
        when(noteService.editNote(anyLong(), any(NoteDto.class))).thenReturn(editedNoteDto);

        mockMvc.perform(put("/note/editNote/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(editedNoteDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Note"))
                .andExpect(jsonPath("$.description").value("Updated Description"));
    }

    @Test
    public void testGetAllNotesFromLoggedInUser() throws Exception {
        List<NoteDto> notes = Arrays.asList(noteDto);
        when(noteService.getAllNotesFromLoggedInUser()).thenReturn(notes);

        mockMvc.perform(get("/note/getAllNotesFromLoggedInUser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].noteId").value(1))
                .andExpect(jsonPath("$[0].title").value("Test Note"))
                .andExpect(jsonPath("$[0].description").value("This is a test note."));
    }

    @Test
    public void testGetNotesBasedOnKeyword() throws Exception {
        List<NoteDto> notes = Arrays.asList(noteDto);
        when(noteService.getNotesBasedOnKeyword("test")).thenReturn(notes);

        mockMvc.perform(get("/note/getNotesBasedOnKeyword/test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].noteId").value(1))
                .andExpect(jsonPath("$[0].title").value("Test Note"))
                .andExpect(jsonPath("$[0].description").value("This is a test note."));
    }
}
