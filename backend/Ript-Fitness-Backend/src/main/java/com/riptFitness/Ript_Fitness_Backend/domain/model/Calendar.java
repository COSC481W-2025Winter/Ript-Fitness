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

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private ActivityType activityType; // WORKOUT, REST, MISSED

    @Enumerated(EnumType.STRING)
    @Column(name = "color_code", nullable = false)
    private ColorCode colorCode; // GREEN, YELLOW, RED

    // Default Constructor for JPA
    public Calendar() {}

    // All-Args Constructor
    public Calendar(AccountsModel account, LocalDate date, ActivityType activityType, ColorCode colorCode) {
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

    public ActivityType getActivityType() {
        return activityType;
    }

    public void setActivityType(ActivityType activityType) {
        this.activityType = activityType;
    }

    public ColorCode getColorCode() {
        return colorCode;
    }

    public void setColorCode(ColorCode colorCode) {
        this.colorCode = colorCode;
    }
}
