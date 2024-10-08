package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.util.ArrayList;
import java.util.List;

//matches my UserProfile model class 
public class UserDto {

    public Long id;                 
    public String firstName;         
    public String lastName;          
    public String username;          
    public List<String> prs = new ArrayList<>(); //this will be for the Prs to store
    public boolean isDeleted = false; //sft delete flag 
}
