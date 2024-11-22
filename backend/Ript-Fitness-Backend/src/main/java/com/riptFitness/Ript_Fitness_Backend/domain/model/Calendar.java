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

    @Column(name = "type", nullable = false)
    private int type; // 1 = Workout, 2 = Rest, 3 = Missed, etc.

    // Default Constructor for JPA
    public Calendar() {}

    // Constructor with Arguments
    public Calendar(AccountsModel account, LocalDate date, int type) {
        this.account = account;
        this.date = date;
        this.type = type;
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

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
