package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.util.ArrayList;
import java.util.List;

//matches my UserProfile model class 
public class UserDto {

    public Long id;                 
    public String firstName;         
    public String lastName;          
    public String username;
    public String displayName;
    public String bio;
    public boolean isDeleted = false; //sft delete flag 
}
