package com.riptFitness.Ript_Fitness_Backend.infastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.UserProfileMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.UserProfileRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.UserProfileService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.UserDto;

public class UserProfileServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private UserProfileMapper userProfileMapper;

    @InjectMocks
    private UserProfileService userProfileService;

    private UserDto userDto;
    private UserProfile userProfile;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setting up test data
        userDto = new UserDto();
        userDto.firstName = "Tom";
        userDto.lastName = "Van";
        userDto.username = "tom.van";
        userDto.isDeleted = false;

        userProfile = new UserProfile();
        userProfile.setId(1L);
        userProfile.setFirstName("Tom");
        userProfile.setLastName("Van");
        userProfile.setUsername("tom.van");
        userProfile.setDeleted(false);
        
        // Mock mapper behavior
        when(userProfileMapper.toUser(any(UserDto.class))).thenReturn(userProfile);
        when(userProfileMapper.toUserDto(any(UserProfile.class))).thenReturn(userDto);
    }

    @Test
    public void testAddUser() {
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(userProfile);

        UserDto savedUser = userProfileService.addUser(userDto);

        assertNotNull(savedUser);
        assertEquals("Tom", savedUser.firstName);
        assertEquals("Van", savedUser.lastName);
        assertEquals("tom.van", savedUser.username);
    }

    @Test
    public void testGetUser() {
        when(userProfileRepository.findById(any(Long.class))).thenReturn(Optional.of(userProfile));

        UserDto foundUser = userProfileService.getUser(1L);

        assertNotNull(foundUser);
        assertEquals("Tom", foundUser.firstName);
        assertEquals("Van", foundUser.lastName);
    }

    @Test
    public void testGetUserNotFound() {
        when(userProfileRepository.findById(any(Long.class))).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> userProfileService.getUser(1L));

        assertEquals("User not found in database with ID = 1", exception.getMessage());
    }

    @Test
    public void testEditUser() {
        when(userProfileRepository.findById(any(Long.class))).thenReturn(Optional.of(userProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(userProfile);

        UserDto updatedUser = userProfileService.editUser(1L, userDto);

        assertNotNull(updatedUser);
        assertEquals("Tom", updatedUser.firstName);
        assertEquals("Van", updatedUser.lastName);
    }

    @Test
    public void testEditUserNotFound() {
        when(userProfileRepository.findById(any(Long.class))).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> userProfileService.editUser(1L, userDto));

        assertEquals("User not found in database with ID = 1", exception.getMessage());
    }

    @Test
    public void testDeleteUser() {
        when(userProfileRepository.findById(any(Long.class))).thenReturn(Optional.of(userProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(userProfile);

        UserDto deletedUser = userProfileService.deleteUser(1L);

        assertNotNull(deletedUser);
        assertTrue(deletedUser.isDeleted);
    }

    @Test
    public void testDeleteUserNotFound() {
        when(userProfileRepository.findById(any(Long.class))).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> userProfileService.deleteUser(1L));

        assertEquals("User not found in database with ID = 1", exception.getMessage());
    }
}
