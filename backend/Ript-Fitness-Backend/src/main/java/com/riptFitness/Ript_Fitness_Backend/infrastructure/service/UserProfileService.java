package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.util.Optional;
import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.UserProfileMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.UserProfileRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.UserDto;

@Service // service class, which is required 
public class UserProfileService {

    private final UserProfileRepository userRepository;

    // Dependency injection constructor
    public UserProfileService(UserProfileRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDto addUser(UserDto userDto, String username) {
        UserProfile userToBeAdded = UserProfileMapper.INSTANCE.toUser(userDto);
        userToBeAdded.setUsername(username); // Set the username from context
        userToBeAdded = userRepository.save(userToBeAdded);
        return UserProfileMapper.INSTANCE.toUserDto(userToBeAdded);
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
}
