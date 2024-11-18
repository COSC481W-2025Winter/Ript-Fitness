package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDateTime;

import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;

public class SocialPostCommentDto {

	public Long id;
	
    public UserProfile userProfile;
		
	public String content;
	
    public Long postId;
    
    public LocalDateTime dateTimeCreated;
    
    public boolean isDeleted;
}
