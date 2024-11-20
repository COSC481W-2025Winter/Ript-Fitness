package com.example.models;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "calendar_entries")
public class Calendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "activity_type", nullable = false)
    private String activityType; // e.g., "workout", "rest", "missed"

    @Column(name = "color_code", nullable = false)
    private String colorCode; // e.g., "green", "yellow", "red"

    // Constructors
    public Calendar() {}

    public Calendar(Long userId, LocalDate date, String activityType, String colorCode) {
        this.userId = userId;
        this.date = date;
        this.activityType = activityType;
        this.colorCode = colorCode;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getColorCode() {
        return colorCode;
    }

    public void setColorCode(String colorCode) {
        this.colorCode = colorCode;
    }
}
