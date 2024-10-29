package com.riptFitness.Ript_Fitness_Backend.domain.model;

import java.time.LocalDate;

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
	
    @Column(name = "account_id", nullable = false)  // Specify the column name in the database
    public Long accountId;
	
	public String content;
	
    @Column(name = "post_id", nullable = false)  // This will be a foreign key to SocialPost
    public Long postId;
    
    @Column(name = "created_date", updatable = false)
    public LocalDate dateTimeCreated;
    
    public boolean isDeleted = false;
    
    @PrePersist
    protected void onCreate() {
    	dateTimeCreated = LocalDate.now();
    }
}
