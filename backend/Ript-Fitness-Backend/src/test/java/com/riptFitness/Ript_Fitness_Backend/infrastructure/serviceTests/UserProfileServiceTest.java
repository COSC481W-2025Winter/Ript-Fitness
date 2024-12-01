package com.riptFitness.Ript_Fitness_Backend.infrastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.data.domain.Pageable;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.SecurityConfig;
import com.riptFitness.Ript_Fitness_Backend.domain.mapper.UserProfileMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Photo;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.PhotoRepository;
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
    
    @Mock
    private PhotoRepository photoRepository;

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
        userProfile.setRestDays(3);
        userProfile.setRestDaysLeft(3);
        userProfile.setRestResetDate(LocalDate.now());
        userProfile.setRestResetDayOfWeek(1);

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

        assertEquals("User not found with username = tom.van", exception.getMessage());
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

        assertEquals("User not found with username = tom.van", exception.getMessage());
    }

    @Test
    public void testSoftDeleteUserByUsername() {
        when(userProfileRepository.findByUsername(any(String.class))).thenReturn(Optional.of(userProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(userProfile);

        UserDto deletedUser = userProfileService.softDeleteUserByUsername("tom.van");

        assertNotNull(deletedUser);
    }

    @Test
    public void testSoftDeleteUserNotFoundByUsername() {
        when(userProfileRepository.findByUsername(any(String.class))).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> userProfileService.softDeleteUserByUsername("tom.van"));

        assertEquals("User not found with username = tom.van", exception.getMessage());
    }

    @Test
    public void testLogRestDaySuccess() {
        userProfile.setRestDaysLeft(2);
        when(userProfileRepository.findByUsername(any(String.class))).thenReturn(Optional.of(userProfile));

        userProfileService.logRestDay("tom.van");

        verify(userProfileRepository, times(1)).save(userProfile);
        assertEquals(1, userProfile.getRestDaysLeft());
    }

    @Test
    public void testLogRestDayNoRemainingDays() {
        userProfile.setRestDaysLeft(0);
        when(userProfileRepository.findByUsername(any(String.class))).thenReturn(Optional.of(userProfile));

        Exception exception = assertThrows(RuntimeException.class, () -> userProfileService.logRestDay("tom.van"));

        assertEquals("No remaining rest days available for this week.", exception.getMessage());
    }

    @Test
    public void testUpdateRestDays() {
        when(userProfileRepository.findByUsername(any(String.class))).thenReturn(Optional.of(userProfile));

        userProfileService.updateRestDays("tom.van", 5, 3);

        assertEquals(5, userProfile.getRestDays());
        assertEquals(5, userProfile.getRestDaysLeft());
        assertEquals(3, userProfile.getRestResetDayOfWeek());
        verify(userProfileRepository, times(1)).save(userProfile);
    }

    @Test
    public void testUpdateRestResetDateIfNeeded() {
        userProfile.setRestResetDate(LocalDate.now().minusDays(8));
        when(userProfileRepository.findByUsername(any(String.class))).thenReturn(Optional.of(userProfile));

        userProfileService.updateRestResetDateIfNeeded(userProfile);

        assertEquals(LocalDate.now().plusDays(7 - LocalDate.now().getDayOfWeek().getValue()), userProfile.getRestResetDate());
        assertEquals(userProfile.getRestDays(), userProfile.getRestDaysLeft());
        verify(userProfileRepository, times(1)).save(userProfile);
    }
    @Test
    public void testGetUserProfilesFromListOfUsernames() {
        List<String> usernames = List.of("user1", "user2");
        List<UserProfile> userProfiles = List.of(userProfile);

        when(userProfileRepository.findAllByUsernames(anyList())).thenReturn(userProfiles);

        List<UserDto> result = userProfileService.getUserProfilesFromListOfUsernames(usernames);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("Tom", result.get(0).firstName);
        verify(userProfileRepository, times(1)).findAllByUsernames(usernames);
    }
    @Test
    public void testGetUserProfilesFromEmptyList() {
        List<String> usernames = List.of();

        when(userProfileRepository.findAllByUsernames(anyList())).thenReturn(List.of());

        List<UserDto> result = userProfileService.getUserProfilesFromListOfUsernames(usernames);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(userProfileRepository, times(1)).findAllByUsernames(usernames);
    }
    @Test
    public void testGetUserProfilesFromNonExistentUsernames() {
        List<String> usernames = List.of("nonexistent1", "nonexistent2");

        when(userProfileRepository.findAllByUsernames(anyList())).thenReturn(List.of());

        List<UserDto> result = userProfileService.getUserProfilesFromListOfUsernames(usernames);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(userProfileRepository, times(1)).findAllByUsernames(usernames);
    }
    
    @Test
    void testSearchUserProfilesByUsername() {
        String searchTerm = "test";
        int startIndex = 0;
        int endIndex = 10;

        Pageable pageable = PageRequest.of(0, 10);
        List<UserProfile> mockProfiles = List.of(
            new UserProfile("John", "Doe", "testUser", "Bio"),
            new UserProfile("Jane", "Smith", "TestUser2", "Another Bio")
        );

        when(userProfileRepository.findByUsernameContainingIgnoreCase(eq(searchTerm), eq(pageable)))
            .thenReturn(mockProfiles);

        List<UserDto> result = userProfileService.searchUserProfilesByUsername(searchTerm, startIndex, endIndex);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("testUser", result.get(0).username); // Access username field directly
        verify(userProfileRepository, times(1)).findByUsernameContainingIgnoreCase(eq(searchTerm), eq(pageable));
    }

    
    @Test
    void testAddPrivatePhoto() {
        String username = "testUser";
        byte[] photoData = new byte[]{1, 2, 3};
        UserProfile mockProfile = new UserProfile("John", "Doe", username, "Bio");

        when(userProfileRepository.findByUsername(eq(username))).thenReturn(Optional.of(mockProfile));

        userProfileService.addPrivatePhoto(username, photoData);

        ArgumentCaptor<Photo> photoCaptor = ArgumentCaptor.forClass(Photo.class);
        verify(photoRepository, times(1)).save(photoCaptor.capture());

        Photo savedPhoto = photoCaptor.getValue();
        assertNotNull(savedPhoto);
        assertArrayEquals(photoData, savedPhoto.getPhoto());
        assertEquals(mockProfile, savedPhoto.getUserProfile());
    }
    @Test
    void testGetPrivatePhotosWithPagination() {
        String username = "testUser";
        UserProfile mockProfile = new UserProfile();
        mockProfile.setId(1L);

        Photo photo1 = new Photo();
        photo1.setId(1L);
        photo1.setUserProfile(mockProfile);
        photo1.setPhoto(new byte[]{1, 2, 3});
        photo1.setUploadTimestamp(LocalDateTime.now());

        Photo photo2 = new Photo();
        photo2.setId(2L);
        photo2.setUserProfile(mockProfile);
        photo2.setPhoto(new byte[]{4, 5, 6});
        photo2.setUploadTimestamp(LocalDateTime.now());

        List<Photo> mockPhotos = List.of(photo1, photo2);

        when(userProfileRepository.findByUsername(eq(username))).thenReturn(Optional.of(mockProfile));
        when(photoRepository.findByUserProfile_Id(eq(mockProfile.getId()))).thenReturn(mockPhotos);

        List<Photo> result = userProfileService.getPrivatePhotos(username, 0, 1);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(photoRepository, times(1)).findByUserProfile_Id(mockProfile.getId());
    }
}
