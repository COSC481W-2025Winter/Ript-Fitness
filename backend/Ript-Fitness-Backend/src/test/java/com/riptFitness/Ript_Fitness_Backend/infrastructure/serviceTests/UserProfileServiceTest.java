package com.riptFitness.Ript_Fitness_Backend.infrastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.SecurityConfig;
import com.riptFitness.Ript_Fitness_Backend.domain.mapper.UserProfileMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.UserProfileRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.UserProfileService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.UserDto;

@ActiveProfiles("test")
@Import(SecurityConfig.class)
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

        userDto = new UserDto();
        userDto.firstName = "Tom";
        userDto.lastName = "Van";
        userDto.isDeleted = false;

        userProfile = new UserProfile();
        userProfile.setId(1L);
        userProfile.setFirstName("Tom");
        userProfile.setLastName("Van");
        userProfile.setDeleted(false);
        
        when(userProfileMapper.toUser(any(UserDto.class))).thenReturn(userProfile);
        when(userProfileMapper.toUserDto(any(UserProfile.class))).thenReturn(userDto);
    }

    @Test
    public void testAddUser() {
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(userProfile);

        UserDto savedUser = userProfileService.addUser(userDto, "tom.van");

        assertNotNull(savedUser);
        assertEquals("Tom", savedUser.firstName);
        assertEquals("Van", savedUser.lastName);
    }

    @Test
    public void testGetUserByUsername() {
        when(userProfileRepository.findByUsername(any(String.class))).thenReturn(Optional.of(userProfile));

        UserDto foundUser = userProfileService.getUserByUsername("tom.van");

        assertNotNull(foundUser);
        assertEquals("Tom", foundUser.firstName);
        assertEquals("Van", foundUser.lastName);
    }

    @Test
    public void testGetUserNotFoundByUsername() {
        when(userProfileRepository.findByUsername(any(String.class))).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> userProfileService.getUserByUsername("tom.van"));

        assertEquals("User not found in database with username = tom.van", exception.getMessage());
    }

    @Test
    public void testUpdateUserByUsername() {
        when(userProfileRepository.findByUsername(any(String.class))).thenReturn(Optional.of(userProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(userProfile);

        UserDto updatedUser = userProfileService.updateUserByUsername("tom.van", userDto);

        assertNotNull(updatedUser);
        assertEquals("Tom", updatedUser.firstName);
        assertEquals("Van", updatedUser.lastName);
    }

    @Test
    public void testUpdateUserNotFoundByUsername() {
        when(userProfileRepository.findByUsername(any(String.class))).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> userProfileService.updateUserByUsername("tom.van", userDto));

        assertEquals("User not found in database with username = tom.van", exception.getMessage());
    }

    @Test
    public void testSoftDeleteUserByUsername() {
        when(userProfileRepository.findByUsername(any(String.class))).thenReturn(Optional.of(userProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(userProfile);

        UserDto deletedUser = userProfileService.softDeleteUserByUsername("tom.van");

        assertNotNull(deletedUser);
        assertTrue(deletedUser.isDeleted);
    }

    @Test
    public void testSoftDeleteUserNotFoundByUsername() {
        when(userProfileRepository.findByUsername(any(String.class))).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> userProfileService.softDeleteUserByUsername("tom.van"));

        assertEquals("User not found in database with username = tom.van", exception.getMessage());
    }
}
