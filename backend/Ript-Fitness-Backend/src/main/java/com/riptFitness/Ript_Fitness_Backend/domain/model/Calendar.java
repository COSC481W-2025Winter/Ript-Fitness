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
    
    @Column(name = "time_zone_when_logged", nullable = false)
    private String timeZoneWhenLogged; // Timezone when the event was logged

    // Default Constructor
    public Calendar() {}

    // Parameterized Constructor
    public Calendar(AccountsModel account, LocalDate date, int activityType) {
        this.account = account;
        this.date = date;
        this.activityType = activityType;
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
    
    public String getTimeZoneWhenLogged() {
        return timeZoneWhenLogged;
    }

    public void setTimeZoneWhenLogged(String timeZoneWhenLogged) {
        this.timeZoneWhenLogged = timeZoneWhenLogged;
    }
}
