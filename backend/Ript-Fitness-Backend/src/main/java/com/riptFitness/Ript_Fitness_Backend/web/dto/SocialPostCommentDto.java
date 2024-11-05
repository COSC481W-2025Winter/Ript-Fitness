package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDateTime;

public class SocialPostCommentDto {

	public Long id;
	
	public Long accountId;
	
	public String content;
	
    public Long postId;
    
    public LocalDateTime dateTimeCreated;
    
    public boolean isDeleted;
}
