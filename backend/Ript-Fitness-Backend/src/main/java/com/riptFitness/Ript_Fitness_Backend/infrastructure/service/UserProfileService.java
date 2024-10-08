package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.util.Optional;
import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.UserProfileMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.UserProfileRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.UserDto;

@Service //service class, which is required 
public class UserProfileService {

    private final UserProfileRepository userRepository;

    //dependency injection constructor
    public UserProfileService(UserProfileRepository userRepository) {
        this.userRepository = userRepository;
    }

    //adds user profile to database
    public UserDto addUser(UserDto userDto) {
        UserProfile userToBeAdded = UserProfileMapper.INSTANCE.toUser(userDto);
        userToBeAdded = userRepository.save(userToBeAdded);
        return UserProfileMapper.INSTANCE.toUserDto(userToBeAdded);
    }

    //gets userId and returns that to the controller
    public UserDto getUser(Long userId) {
        Optional<UserProfile> returnedOptionalUserObject = userRepository.findById(userId);

        if (returnedOptionalUserObject.isEmpty()) {
            throw new RuntimeException("User not found in database with ID = " + userId);
        }

        UserProfile returnedUserObject = returnedOptionalUserObject.get();
        return UserProfileMapper.INSTANCE.toUserDto(returnedUserObject);
    }

    //edits and returns to controller
    public UserDto editUser(Long userId, UserDto userDto) {
        Optional<UserProfile> optionalUserToBeEdited = userRepository.findById(userId);

        if (optionalUserToBeEdited.isEmpty()) {
            throw new RuntimeException("User not found in database with ID = " + userId);
        }

        UserProfile userToBeEdited = optionalUserToBeEdited.get();
        UserProfileMapper.INSTANCE.updateUserFromDto(userDto, userToBeEdited);
        userToBeEdited = userRepository.save(userToBeEdited);
        return UserProfileMapper.INSTANCE.toUserDto(userToBeEdited);
    }

    //"deletes" user, But I will be doing it through a soft delete since we don't want to fully delete.
    public UserDto deleteUser(Long userId) {
        Optional<UserProfile> optionalUserToBeDeleted = userRepository.findById(userId);

        if (optionalUserToBeDeleted.isEmpty()) {
            throw new RuntimeException("User not found in database with ID = " + userId);
        }

        UserProfile userToBeDeleted = optionalUserToBeDeleted.get();
        userToBeDeleted.setDeleted(true); // Essentially I set a condition of "isDeleted" to true. It will still exist but it will be flagged as deleted. 
        userRepository.save(userToBeDeleted);
        return UserProfileMapper.INSTANCE.toUserDto(userToBeDeleted);
    }
}
