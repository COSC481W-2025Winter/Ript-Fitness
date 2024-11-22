package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDate;

public class CalendarDto {

    private LocalDate date;         // The date of the calendar entry
    private String activityType;    // WORKOUT, REST, MISSED
    private String colorCode;       // GREEN, YELLOW, RED

}