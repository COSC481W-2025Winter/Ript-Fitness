package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.util.Optional;
import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.UserProfileMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.UserProfileRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.UserDto;

@Service
public class UserProfileService {

    private final UserProfileRepository userRepository;

    // Dependency injection constructor
    public UserProfileService(UserProfileRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDto addUser(UserDto userDto, String username) {
        UserProfile userToBeAdded = UserProfileMapper.INSTANCE.toUser(userDto);
        userToBeAdded.setUsername(username);
        userToBeAdded = userRepository.save(userToBeAdded);
        return UserProfileMapper.INSTANCE.toUserDto(userToBeAdded);
    }

    // Checks if a UserProfile exists by username
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
        userProfile.setRestDays(allowedRestDays != null ? allowedRestDays : 3); // Set default if null
        userProfile.setRestDaysLeft(allowedRestDays != null ? allowedRestDays : 3); // Ensure restDaysLeft is set
        userProfile.setRestResetDayOfWeek(resetDayOfWeek != null ? resetDayOfWeek : 1); // Default to Monday if null
        userRepository.save(userProfile);
    }
}
