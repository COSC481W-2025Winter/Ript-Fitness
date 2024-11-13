package com.riptFitness.Ript_Fitness_Backend.domain.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;

@Entity
public class SocialPost {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    public AccountsModel account;
    
    public String content;
    
    public int numberOfLikes = 0;
    
    //Represents a list of AccountsModels IDs that have liked a specific post
    public List<Long> userIDsOfLikes = new ArrayList<>();
    
    @OneToMany(mappedBy = "postId", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<SocialPostComment> socialPostComments = new ArrayList<>();
    
    public boolean isDeleted = false;
    
    @Column(name = "created_date", updatable = false)
    public LocalDateTime dateTimeCreated;
    
    @PrePersist
    protected void onCreate() {
    	dateTimeCreated = LocalDateTime.now();
    }
}
