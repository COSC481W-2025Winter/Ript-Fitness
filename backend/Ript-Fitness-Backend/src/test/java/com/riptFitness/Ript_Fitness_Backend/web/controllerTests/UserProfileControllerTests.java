package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
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
import com.riptFitness.Ript_Fitness_Backend.domain.model.Photo;

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
        userDto.username = "testUser";
        userDto.isDeleted = false;

        when(jwtUtil.extractUsername(any(String.class))).thenReturn("testUser");
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
    public void testGetProfilePicture() throws Exception {
        byte[] mockPhoto = new byte[]{1, 2, 3};
        when(userProfileService.getProfilePicture(anyString())).thenReturn(mockPhoto);

        mockMvc.perform(get("/userProfile/profilePicture")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_OCTET_STREAM))
                .andExpect(status().isOk())
                .andExpect(content().bytes(mockPhoto));

        verify(userProfileService, times(1)).getProfilePicture(anyString());
    }

    @Test
    public void testUpdateProfilePicture() throws Exception {
        byte[] profilePicture = new byte[]{1, 2, 3};

        mockMvc.perform(put("/userProfile/profilePicture")
                .header("Authorization", token)
                .content(profilePicture)
                .contentType(MediaType.APPLICATION_OCTET_STREAM))
                .andExpect(status().isOk());

        verify(userProfileService, times(1)).updateProfilePicture(anyString(), eq(profilePicture));
    }

    @Test
    public void testAddPrivatePhoto() throws Exception {
        byte[] photo = new byte[]{1, 2, 3};

        mockMvc.perform(post("/userProfile/photo")
                .header("Authorization", token)
                .content(photo)
                .contentType(MediaType.APPLICATION_OCTET_STREAM))
                .andExpect(status().isOk());

        verify(userProfileService, times(1)).addPrivatePhoto(anyString(), eq(photo));
    }

    @Test
    public void testDeletePrivatePhoto() throws Exception {
        mockMvc.perform(delete("/userProfile/photo/1"))
                .andExpect(status().isOk());

        verify(userProfileService, times(1)).deletePrivatePhoto(eq(1L));
    }

    @Test
    void testSearchUserProfiles() throws Exception {
        UserDto user1 = new UserDto();
        user1.id = 1L;
        user1.firstName = "John";
        user1.lastName = "Doe";
        user1.username = "testUser";
        user1.bio = "Bio";

        UserDto user2 = new UserDto();
        user2.id = 2L;
        user2.firstName = "Jane";
        user2.lastName = "Smith";
        user2.username = "TestUser2";
        user2.bio = "Another Bio";

        List<UserDto> mockProfiles = List.of(user1, user2);

        when(userProfileService.searchUserProfilesByUsername(eq("test"), eq(0), eq(10)))
                .thenReturn(mockProfiles);

        mockMvc.perform(get("/userProfile/search")
                .param("searchTerm", "test")
                .param("startIndex", "0")
                .param("endIndex", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].username").value("testUser"));

        verify(userProfileService, times(1)).searchUserProfilesByUsername(eq("test"), eq(0), eq(10));
    }
}
