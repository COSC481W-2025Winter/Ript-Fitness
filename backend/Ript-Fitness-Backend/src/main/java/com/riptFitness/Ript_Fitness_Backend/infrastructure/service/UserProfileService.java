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

    // Adds a new user profile
    public UserDto addUser(UserDto userDto, String username) {
        // Convert UserDto to UserProfile
        UserProfile userToBeAdded = UserProfileMapper.INSTANCE.toUser(userDto);
        userToBeAdded.setUsername(username);

        // Initialize default values
        userToBeAdded.setRestDays(3); 
        userToBeAdded.setRestDaysLeft(3); 
        userToBeAdded.setRestResetDate(LocalDate.now()); 
        userToBeAdded.setRestResetDayOfWeek(1); // Set reset day to Sunday (7 for Sunday)

        userToBeAdded = userRepository.save(userToBeAdded);

        return UserProfileMapper.INSTANCE.toUserDto(userToBeAdded);
    }

    // Check if user profile exists by username
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    // Retrieves user profile by username
    public UserDto getUserByUsername(String username) {
        Optional<UserProfile> returnedOptionalUserObject = userRepository.findByUsername(username);
        if (returnedOptionalUserObject.isEmpty()) {
            throw new RuntimeException("User not found in database with username = " + username);
        }

        UserProfile returnedUserObject = returnedOptionalUserObject.get();
        return UserProfileMapper.INSTANCE.toUserDto(returnedUserObject);
    }

    // Edits user profile by username
    public UserDto updateUserByUsername(String username, UserDto userDto) {
        Optional<UserProfile> optionalUserToBeEdited = userRepository.findByUsername(username);

        if (optionalUserToBeEdited.isEmpty()) {
            throw new RuntimeException("User not found in database with username = " + username);
        }

        UserProfile userToBeEdited = optionalUserToBeEdited.get();
        // Ensure restDays and other fields are set with valid values (check nulls)
        if (userDto.getRestDays() != null) {
            userToBeEdited.setRestDays(userDto.getRestDays());
        } else {
            userToBeEdited.setRestDays(3); // Set default value if null
        }

        if (userDto.getRestDaysLeft() != null) {
            userToBeEdited.setRestDaysLeft(userDto.getRestDaysLeft());
        } else {
            userToBeEdited.setRestDaysLeft(userToBeEdited.getRestDays()); // Set restDaysLeft to restDays if null
        }

        if (userDto.getRestResetDate() != null) {
            userToBeEdited.setRestResetDate(userDto.getRestResetDate());
        } else {
            userToBeEdited.setRestResetDate(LocalDate.now()); // Set current date if null
        }

        if (userDto.getRestResetDayOfWeek() != null) {
            userToBeEdited.setRestResetDayOfWeek(userDto.getRestResetDayOfWeek());
        } else {
            userToBeEdited.setRestResetDayOfWeek(1); // Default to Sunday
        }

        UserProfileMapper.INSTANCE.updateUserFromDto(userDto, userToBeEdited);
        userToBeEdited.setUsername(username);
        userToBeEdited = userRepository.save(userToBeEdited);

        return UserProfileMapper.INSTANCE.toUserDto(userToBeEdited);
    }

    // Soft-deletes user profile by username
    public UserDto softDeleteUserByUsername(String username) {
        Optional<UserProfile> optionalUserToBeDeleted = userRepository.findByUsername(username);

        if (optionalUserToBeDeleted.isEmpty()) {
            throw new RuntimeException("User not found in database with username = " + username);
        }

        UserProfile userToBeDeleted = optionalUserToBeDeleted.get();
        userToBeDeleted.setDeleted(true); // Flag as deleted
        userRepository.save(userToBeDeleted);
        return UserProfileMapper.INSTANCE.toUserDto(userToBeDeleted);
    }

    // Retrieves remaining rest days for the current week
    public Integer getRemainingRestDays(String username) {
        Optional<UserProfile> optionalUserProfile = userRepository.findByUsername(username);

        if (optionalUserProfile.isEmpty()) {
            throw new RuntimeException("User not found in database with username = " + username);
        }

        Integer restDaysLeft = optionalUserProfile.get().getRestDaysLeft();
        return (restDaysLeft != null) ? restDaysLeft : 0; // Return 0 if restDaysLeft is null
    }

    // Updates the allowed rest days per week and the reset day of the week
    public void updateRestDays(String username, Integer allowedRestDays, Integer resetDayOfWeek) {
        Optional<UserProfile> optionalUserProfile = userRepository.findByUsername(username);

        if (optionalUserProfile.isEmpty()) {
            throw new RuntimeException("User not found in database with username = " + username);
        }

        UserProfile userProfile = optionalUserProfile.get();

        // Update restDays and restDaysLeft
        if (allowedRestDays != null) {
            userProfile.setRestDays(allowedRestDays);  // Update the max allowed rest days
            userProfile.setRestDaysLeft(allowedRestDays);  // Reset remaining rest days to the new limit
        }

        // Ensure restResetDayOfWeek is set properly
        userProfile.setRestResetDayOfWeek(resetDayOfWeek != null ? resetDayOfWeek : 1); // Default to Sunday if null
        userRepository.save(userProfile);
    }

    // Log a rest day for a user
    public void logRestDay(String username) {
        Optional<UserProfile> optionalUserProfile = userRepository.findByUsername(username);

        if (optionalUserProfile.isEmpty()) {
            throw new RuntimeException("User not found in database with username = " + username);
        }

        UserProfile userProfile = optionalUserProfile.get();

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
