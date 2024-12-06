package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDateTime;

public class CalendarDto {

    private LocalDateTime date;   // The date of the calendar entry
    private int activityType; // 1 = WORKOUT, 2 = REST, 3 = MISSED, etc.

    public CalendarDto(LocalDateTime localDateTime, int activityType) {
        this.date = localDateTime;
        this.activityType = activityType;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public int getActivityType() {
        return activityType;
    }

    public void setActivityType(int activityType) {
        this.activityType = activityType;
    }
}
