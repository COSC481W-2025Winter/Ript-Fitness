package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDate;

public class UserDto {
    public Long id;                 
    public String firstName;         
    public String lastName;          
    public String username; 
    public String displayname;
    public String bio;
    public boolean isDeleted = false;

    public Integer restDays; 
    public Integer restDaysLeft; 
    public LocalDate restResetDate; 
    public Integer restResetDayOfWeek; 
}