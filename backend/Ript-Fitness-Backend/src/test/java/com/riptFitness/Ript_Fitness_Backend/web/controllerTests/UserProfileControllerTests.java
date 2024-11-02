package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.riptFitness.Ript_Fitness_Backend.config.JwtUtil;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.UserProfileService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.UserProfileController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.UserDto;

@WebMvcTest(UserProfileController.class)
@ActiveProfiles("test")
public class UserProfileControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserProfileService userProfileService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;

    private UserDto userDto;
    private final String token = "Bearer test-token";

    @BeforeEach
    public void setUp() {
        userDto = new UserDto();
        userDto.firstName = "Tom";
        userDto.lastName = "Van";
        userDto.isDeleted = false;

        when(jwtUtil.extractUsername(any(String.class))).thenReturn("tom.van");
    }

    @Test
    public void testAddUser() throws Exception {
        when(userProfileService.addUser(any(UserDto.class), any(String.class))).thenReturn(userDto);

        mockMvc.perform(post("/userProfile/addUser")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName").value("Tom"));
    }

    @Test
    public void testGetUserProfile() throws Exception {
        when(userProfileService.getUserByUsername("tom.van")).thenReturn(userDto);

        mockMvc.perform(get("/userProfile/getUserProfile")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Tom"))
                .andExpect(jsonPath("$.lastName").value("Van"));
    }

    @Test
    public void testUpdateUserProfile() throws Exception {
        when(userProfileService.updateUserByUsername(any(String.class), any(UserDto.class))).thenReturn(userDto);

        mockMvc.perform(put("/userProfile/updateUserProfile")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Tom"));
    }

    @Test
    public void testDeleteUserProfile() throws Exception {
        userDto.isDeleted = true;
        when(userProfileService.softDeleteUserByUsername("tom.van")).thenReturn(userDto);

        mockMvc.perform(delete("/userProfile/deleteUserProfile")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isDeleted").value(true));
    }
}
