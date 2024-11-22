package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDate;

public class CalendarDto {

    private LocalDate date;   // The date of the calendar entry
    private int activityType; // 1 = WORKOUT, 2 = REST, 3 = MISSED, etc.
    private int colorCode;    // 1 = GREEN, 2 = YELLOW, 3 = RED, etc.

    // Constructor
    public CalendarDto(LocalDate date, int activityType, int colorCode) {
        this.date = date;
        this.activityType = activityType;
        this.colorCode = colorCode;
    }

    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getActivityType() {
        return activityType;
    }

    public void setActivityType(int activityType) {
        this.activityType = activityType;
    }

    public int getColorCode() {
        return colorCode;
    }

    public void setColorCode(int colorCode) {
        this.colorCode = colorCode;
    }
}
