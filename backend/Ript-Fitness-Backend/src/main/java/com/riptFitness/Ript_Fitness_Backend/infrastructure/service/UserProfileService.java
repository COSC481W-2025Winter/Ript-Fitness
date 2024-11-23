package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.UserProfileMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.UserProfileRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.UserDto;

import jakarta.transaction.Transactional;

@Service
public class UserProfileService {

    private final UserProfileRepository userRepository;

    // Dependency injection constructor
    public UserProfileService(UserProfileRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Adds a new user profile with default values
    public UserDto addUser(UserDto userDto, String username) {
        UserProfile userToBeAdded = UserProfileMapper.INSTANCE.toUser(userDto);
        userToBeAdded.setUsername(username);
        initializeDefaultValues(userToBeAdded); // Set default values for rest days and reset date
        
        userToBeAdded = userRepository.save(userToBeAdded);
        return UserProfileMapper.INSTANCE.toUserDto(userToBeAdded);
    }

    // Initialize default values for the UserProfile
    private void initializeDefaultValues(UserProfile userProfile) {
        userProfile.setRestDays(3);
        userProfile.setRestDaysLeft(3);
        userProfile.setRestResetDate(LocalDate.now());
        userProfile.setRestResetDayOfWeek(1); // Default reset day is Sunday
    }

    // Check if user profile exists by username
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    // Retrieves user profile by username
    public UserDto getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .map(UserProfileMapper.INSTANCE::toUserDto)
            .orElseThrow(() -> new RuntimeException("User not found with username = " + username));
    }

    // Edits user profile by username
    public UserDto updateUserByUsername(String username, UserDto userDto) {
        UserProfile userToBeEdited = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found with username = " + username));

        updateProfileFields(userToBeEdited, userDto); // Update fields from the UserDto
        
        userToBeEdited = userRepository.save(userToBeEdited);
        return UserProfileMapper.INSTANCE.toUserDto(userToBeEdited);
    }

    // Update the profile fields based on UserDto
    private void updateProfileFields(UserProfile userProfile, UserDto userDto) {
        if (userDto.getRestDays() != null) {
            userProfile.setRestDays(userDto.getRestDays());
        }
        if (userDto.getRestDaysLeft() != null) {
            userProfile.setRestDaysLeft(userDto.getRestDaysLeft());
        }
        if (userDto.getRestResetDate() != null) {
            userProfile.setRestResetDate(userDto.getRestResetDate());
        }
        if (userDto.getRestResetDayOfWeek() != null) {
            userProfile.setRestResetDayOfWeek(userDto.getRestResetDayOfWeek());
        }
    }

    // Soft-deletes user profile by username
    public UserDto softDeleteUserByUsername(String username) {
        UserProfile userToBeDeleted = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found with username = " + username));

        userToBeDeleted.setDeleted(true); // Flag as deleted
        userRepository.save(userToBeDeleted);
        return UserProfileMapper.INSTANCE.toUserDto(userToBeDeleted);
    }

    // Retrieves remaining rest days for the current week
    public Integer getRemainingRestDays(String username) {
        return userRepository.findByUsername(username)
            .map(userProfile -> userProfile.getRestDaysLeft() != null ? userProfile.getRestDaysLeft() : 0)
            .orElseThrow(() -> new RuntimeException("User not found with username = " + username));
    }

    // Updates the allowed rest days per week and the reset day of the week
    public void updateRestDays(String username, Integer allowedRestDays, Integer resetDayOfWeek) {
        UserProfile userProfile = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found with username = " + username));

        if (allowedRestDays != null) {
            userProfile.setRestDays(allowedRestDays);
            userProfile.setRestDaysLeft(allowedRestDays);  // Reset remaining rest days to the new limit
        }

        userProfile.setRestResetDayOfWeek(resetDayOfWeek != null ? resetDayOfWeek : 1); // Default to Sunday if null
        userRepository.save(userProfile);
    }

    // Log a rest day for a user
    public void logRestDay(String username) {
        UserProfile userProfile = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found with username = " + username));

        // Ensure the restResetDate is updated if necessary
        updateRestResetDateIfNeeded(userProfile);

        Integer restDaysLeft = userProfile.getRestDaysLeft();
        if (restDaysLeft != null && restDaysLeft > 0) {
            userProfile.setRestDaysLeft(restDaysLeft - 1);
            userRepository.save(userProfile);
        } else {
            throw new RuntimeException("No remaining rest days available for this week.");
        }
    }

    // Calculates the next Sunday for resetting the rest day logic
    private LocalDate getNextSunday() {
        LocalDate today = LocalDate.now();
        int todayDayOfWeek = today.getDayOfWeek().getValue();
        int daysUntilSunday = 7 - todayDayOfWeek;
        return today.plusDays(daysUntilSunday); // Get the next Sunday
    }

    // Updates restResetDate if it's older than 7 days
    @Transactional
    public void updateRestResetDateIfNeeded(UserProfile userProfile) {
        LocalDate currentRestResetDate = userProfile.getRestResetDate();
        LocalDate today = LocalDate.now();

        // Check if the restResetDate is more than 7 days ago
        if (currentRestResetDate.isBefore(today.minusDays(7))) {
            userProfile.setRestResetDate(getNextSunday());
            userProfile.setRestDaysLeft(userProfile.getRestDays()); // Reset remaining rest days to the full amount
            userRepository.save(userProfile); // Save the updated profile
        }
    }
}
