package com.riptFitness.Ript_Fitness_Backend.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.UserProfileService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.UserDto;

@RestController 
@RequestMapping("/userProfile") //base url for all userprofile endpoints
public class UserProfileController {

    // Each endpoint will call a method from UserProfileService
    private final UserProfileService userProfileService;

    // Constructor for dependency injection
    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    //POST localhost:8080/userProfile/addUser
    @PostMapping("/addUser")
    public ResponseEntity<UserDto> addUser(@RequestBody UserDto userDto) {
        UserDto savedUserObject = userProfileService.addUser(userDto);
        return new ResponseEntity<>(savedUserObject, HttpStatus.CREATED);
    }

    //GET localhost:8080/userProfile/getUser/{userId}
    @GetMapping("/getUser/{userId}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long userId) {
        UserDto returnedUserObject = userProfileService.getUser(userId);
        return ResponseEntity.ok(returnedUserObject);
    }

    //PUT localhost:8080/userProfile/editUser/{userId}
    @PutMapping("/editUser/{userId}")
    public ResponseEntity<UserDto> editUser(@PathVariable Long userId, @RequestBody UserDto userDto) {
        UserDto updatedUserObject = userProfileService.editUser(userId, userDto);
        return ResponseEntity.ok(updatedUserObject);
    }

    //DELETE localhost:8080/userProfile/deleteUser/{userId}
    @DeleteMapping("/deleteUser/{userId}")
    public ResponseEntity<UserDto> deleteUser(@PathVariable Long userId) {
        UserDto deletedUserObject = userProfileService.deleteUser(userId);
        return ResponseEntity.ok(deletedUserObject);
    }
}
