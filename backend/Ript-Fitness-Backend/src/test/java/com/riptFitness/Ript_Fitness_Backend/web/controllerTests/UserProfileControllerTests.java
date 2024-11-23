package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.UserProfileService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.UserProfileController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.UserDto;

@WebMvcTest(UserProfileController.class)
@Import(SecurityConfig.class)
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
    public void testGetUserProfile() throws Exception {
        when(userProfileService.getUserByUsername(any(String.class))).thenReturn(userDto);

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
        when(userProfileService.softDeleteUserByUsername(any(String.class))).thenReturn(userDto);

        mockMvc.perform(delete("/userProfile/deleteUserProfile")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isDeleted").value(true));
    }

    @Test
    public void testGetUserProfilesFromList() throws Exception {
        List<UserDto> userDtos = List.of(userDto);
        List<String> usernames = List.of("tom.van");

        when(userProfileService.getUserProfilesFromListOfUsernames(any(List.class))).thenReturn(userDtos);

        mockMvc.perform(post("/userProfile/getUserProfilesFromList")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usernames)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName").value("Tom"))
                .andExpect(jsonPath("$[0].lastName").value("Van"));
    }

    @Test
    public void testGetUserProfilesFromEmptyList() throws Exception {
        List<UserDto> userDtos = List.of();
        List<String> usernames = List.of();

        when(userProfileService.getUserProfilesFromListOfUsernames(any(List.class))).thenReturn(userDtos);

        mockMvc.perform(post("/userProfile/getUserProfilesFromList")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usernames)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0)); // No user profiles in response
    }

    @Test
    public void testGetUserProfilesFromNonExistentUsernames() throws Exception {
        List<UserDto> userDtos = List.of();
        List<String> usernames = List.of("nonexistentUser");

        when(userProfileService.getUserProfilesFromListOfUsernames(any(List.class))).thenReturn(userDtos);

        mockMvc.perform(post("/userProfile/getUserProfilesFromList")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usernames)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0)); // Empty response
    }

    @Test
    public void testGetUserProfilesFromMixedUsernames() throws Exception {
        List<UserDto> userDtos = List.of(userDto);
        List<String> usernames = List.of("validUser", "invalidUser");

        when(userProfileService.getUserProfilesFromListOfUsernames(any(List.class))).thenReturn(userDtos);

        mockMvc.perform(post("/userProfile/getUserProfilesFromList")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usernames)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1)) // Only 1 valid profile
                .andExpect(jsonPath("$[0].firstName").value("Tom"));
    }
}
