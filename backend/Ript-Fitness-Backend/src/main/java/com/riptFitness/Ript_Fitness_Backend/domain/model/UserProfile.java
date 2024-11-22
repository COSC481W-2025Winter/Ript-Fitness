package com.riptFitness.Ript_Fitness_Backend.domain.model;

import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.*;

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

    @Column(name = "rest_days_left")
    private int restDaysLeft;

    @Column(name = "rest_reset_date")
    private LocalDate restResetDate;

    @Column(name = "rest_reset_day_of_week")
    private int restResetDayOfWeek;

    // Default Constructor
    public UserProfile() {}

    // Parameterized Constructor
    public UserProfile(String firstName, String lastName, String username, String bio) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.bio = bio;
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

    public int getRestDaysLeft() {
        return restDaysLeft;
    }

    public void setRestDaysLeft(int restDaysLeft) {
        this.restDaysLeft = restDaysLeft;
    }

    public LocalDate getRestResetDate() {
        return restResetDate;
    }

    public void setRestResetDate(LocalDate restResetDate) {
        this.restResetDate = restResetDate;
    }

    public int getRestResetDayOfWeek() {
        return restResetDayOfWeek;
    }

    public void setRestResetDayOfWeek(int restResetDayOfWeek) {
        this.restResetDayOfWeek = restResetDayOfWeek;
    }
}
