package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.riptFitness.Ript_Fitness_Backend.domain.model.ExerciseModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.SocialPost;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Streak;

public class AccountsDto {
    // id is the auto increment key in the DB
    public Long id;

    // Fields:
    public String username;
    public String password;
    public String email;
    public LocalDateTime lastLogin; // New date-time field
    public Streak streak;
    public List<SocialPost> socialPosts;
    
    // Constructor
    public AccountsDto() {
        this.lastLogin = LocalDateTime.now(); // Set lastLogin automatically
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getlastLogin() { // Getter for lastLogin
        return lastLogin;
    }

    public void setlastLogin(LocalDateTime lastLogin) { // Setter for lastLogin
        this.lastLogin = lastLogin;
    }
}
