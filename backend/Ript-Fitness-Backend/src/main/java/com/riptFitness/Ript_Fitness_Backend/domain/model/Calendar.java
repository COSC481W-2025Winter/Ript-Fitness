package com.riptFitness.Ript_Fitness_Backend.domain.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "calendar_entries")
public class Calendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountsModel account;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "activity_type", nullable = false)
    private int activityType;

    @Column(name = "color_code", nullable = false)
    private int colorCode;

    // Default Constructor
    public Calendar() {}

    // Parameterized Constructor
    public Calendar(AccountsModel account, LocalDate date, int activityType, int colorCode) {
        this.account = account;
        this.date = date;
        this.activityType = activityType;
        this.colorCode = colorCode;
    }

    // Overloaded Constructor for simplified usage
    public Calendar(AccountsModel account, LocalDate date, int activityType) {
        this.account = account;
        this.date = date;
        this.activityType = activityType;

        // Set default colorCode based on activityType
        switch (activityType) {
            case 1: // Workout
                this.colorCode = 1; // Green
                break;
            case 2: // Rest
                this.colorCode = 2; // Yellow
                break;
            case 3: // Missed
                this.colorCode = 3; // Red
                break;
            default:
                this.colorCode = 0; // Undefined or default color
                break;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AccountsModel getAccount() {
        return account;
    }

    public void setAccount(AccountsModel account) {
        this.account = account;
    }

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
