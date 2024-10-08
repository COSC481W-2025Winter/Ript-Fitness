package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.UserProfileService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.UserProfileController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.UserDto;

@WebMvcTest(UserProfileController.class)
public class UserProfileControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserProfileService userProfileService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserDto userDto;

    @BeforeEach
    public void setUp() {
        userDto = new UserDto();
        userDto.id = 1L;
        userDto.firstName = "Tom";
        userDto.lastName = "Van";
        userDto.username = "tom.van";
        userDto.isDeleted = false;
    }

    @Test
    public void testAddUser() throws Exception {
        when(userProfileService.addUser(any(UserDto.class))).thenReturn(userDto);

        mockMvc.perform(post("/userProfile/addUser")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName").value("Tom"))
                .andExpect(jsonPath("$.username").value("tom.van"));
    }

    @Test
    public void testGetUser() throws Exception {
        when(userProfileService.getUser(1L)).thenReturn(userDto);

        mockMvc.perform(get("/userProfile/getUser/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Tom"))
                .andExpect(jsonPath("$.lastName").value("Van"));
    }

    @Test
    public void testEditUser() throws Exception {
        when(userProfileService.editUser(any(Long.class), any(UserDto.class))).thenReturn(userDto);

        mockMvc.perform(put("/userProfile/editUser/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Tom"))
                .andExpect(jsonPath("$.username").value("tom.van"));
    }

    @Test
    public void testDeleteUser() throws Exception {
        userDto.isDeleted = true;
        when(userProfileService.deleteUser(1L)).thenReturn(userDto);

        mockMvc.perform(delete("/userProfile/deleteUser/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isDeleted").value(true));
    }
}
