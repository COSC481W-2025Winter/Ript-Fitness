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
    
    // Add the necessary fields here
    public Integer restDays;
    public Integer restDaysLeft;
    public LocalDate restResetDate;
    public Integer restResetDayOfWeek;

    // Add getter methods for each field

    public Integer getRestDays() {
        return restDays;
    }

    public Integer getRestDaysLeft() {
        return restDaysLeft;
    }

    public LocalDate getRestResetDate() {
        return restResetDate;
    }

    public Integer getRestResetDayOfWeek() {
        return restResetDayOfWeek;
    }
}
