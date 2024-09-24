package com.riptFitness.Ript_Fitness_Backend.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity // Creates a database table with that name and columns equal to the variables in the object class
@Table(name = "accounts_model")
public class AccountsModel {

    @Id // This means this is the primary key of the AccountsModel database table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Generates an ID via auto-increment
    private Long id;

    // Fields:
    private String username;
    private String password;
    private String email;

    // Getters:
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    // Setters:
    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
