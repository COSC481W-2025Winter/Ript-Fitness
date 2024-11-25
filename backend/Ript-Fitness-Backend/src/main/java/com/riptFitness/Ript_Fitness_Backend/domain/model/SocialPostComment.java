package com.riptFitness.Ript_Fitness_Backend.domain.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

@Entity
public class SocialPostComment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    public AccountsModel account;
    
    @ManyToOne
    @JoinColumn(name = "user_profile_id", referencedColumnName = "id")
    public UserProfile userProfile;
	
	public String content;
	
    @Column(name = "post_id", nullable = false)  // This will be a foreign key to SocialPost
    public Long postId;
    
    @Column(name = "created_date", updatable = false)
    public LocalDateTime dateTimeCreated;
    
    public boolean isDeleted = false;
    
    @PrePersist
    protected void onCreate() {
    	dateTimeCreated = LocalDateTime.now();
    }
}
