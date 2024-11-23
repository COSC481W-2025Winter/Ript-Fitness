package com.riptFitness.Ript_Fitness_Backend.domain.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    private String displayname;

    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SocialPost> socialPosts;

    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SocialPostComment> comments;

    @Column
    private String bio;

    @Column(unique = true, nullable = false)
    private String username;

    @OneToOne
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    private AccountsModel account;

    private boolean isDeleted = false;

    @Column(name = "rest_days", nullable = true)
    private Integer restDays;  // Changed from int to Integer to handle null values

    @Column(name = "rest_days_left")
    private Integer restDaysLeft; // Changed from int to Integer to handle null values

    @Column(name = "rest_reset_date")
    private LocalDate restResetDate; // Date when rest days reset

    @Column(name = "rest_reset_day_of_week")
    private Integer restResetDayOfWeek; // Changed from int to Integer to handle null values

    // Default Constructor
    public UserProfile() {
        this.restDays = 3; // Ensure restDays defaults to 3 when an instance is created
    }

    // Parameterized Constructor
    public UserProfile(String firstName, String lastName, String username, String bio) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.bio = bio;
        this.restDays = 3; // Ensure restDays defaults to 3 when this constructor is used
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDisplayname() {
        return displayname;
    }

    public void setDisplayname(String displayname) {
        this.displayname = displayname;
    }

    public List<SocialPost> getSocialPosts() {
        return socialPosts;
    }

    public void setSocialPosts(List<SocialPost> socialPosts) {
        this.socialPosts = socialPosts;
    }

    public List<SocialPostComment> getComments() {
        return comments;
    }

    public void setComments(List<SocialPostComment> comments) {
        this.comments = comments;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public AccountsModel getAccount() {
        return account;
    }

    public void setAccount(AccountsModel account) {
        this.account = account;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Integer getRestDays() {
        return restDays != null ? restDays : 3;  // Return 3 if restDays is null
    }

    public void setRestDays(Integer restDays) {
        this.restDays = restDays;
    }

    public Integer getRestDaysLeft() {
        return restDaysLeft;
    }

    public void setRestDaysLeft(Integer restDaysLeft) {
        this.restDaysLeft = restDaysLeft;
    }

    public LocalDate getRestResetDate() {
        return restResetDate;
    }

    public void setRestResetDate(LocalDate restResetDate) {
        this.restResetDate = restResetDate;
    }

    public Integer getRestResetDayOfWeek() {
        return restResetDayOfWeek;
    }

    public void setRestResetDayOfWeek(Integer restResetDayOfWeek) {
        this.restResetDayOfWeek = restResetDayOfWeek;
    }
}
