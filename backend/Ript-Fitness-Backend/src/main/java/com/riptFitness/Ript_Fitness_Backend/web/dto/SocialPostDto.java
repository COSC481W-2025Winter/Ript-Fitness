package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;

public class SocialPostDto {

	public Long id;
		
    public UserProfile userProfile;
	    
    public String content;
    
    public int numberOfLikes;
    
    public List<Long> userIDsOfLikes;
    
    public List<SocialPostCommentDto> socialPostComments;
    
    public boolean isDeleted;
    
    public LocalDateTime dateTimeCreated;
}
