package com.riptFitness.Ript_Fitness_Backend.domain.model;

import java.time.LocalDate;

import jakarta.persistence.*;

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
    private int activityType; // 0 = Missed, 1 = Workout, 2 = Rest

    @Column(name = "color_code", nullable = false)
    private int colorCode; // 0 = Red, 1 = Green, 2 = Yellow

    // Default Constructor for JPA
    public Calendar() {}

    // Constructor
    public Calendar(AccountsModel account, LocalDate date, int activityType, int colorCode) {
        this.account = account;
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
