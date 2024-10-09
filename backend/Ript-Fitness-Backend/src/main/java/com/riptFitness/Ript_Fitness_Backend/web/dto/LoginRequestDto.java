package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDateTime;

// This class is neccesary because when we log in we are only worried about the
//	username and the passoword. Not the email and ID initially
public class LoginRequestDto {
    private String username;
    private String password;
    private LocalDateTime lastLogin;
    
    // Constructor
    public LoginRequestDto() {
        this.lastLogin = LocalDateTime.now(); // Set lastLogin automatically
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
       return password;
    }

    public void setPassword(String password) {
       this.password = password;
    }
    
    public LocalDateTime getlastLogin() {
    	return lastLogin;
    }
    
    public void setlastLogin(LocalDateTime lastLogin) {
    	this.lastLogin = lastLogin;
    }
}
