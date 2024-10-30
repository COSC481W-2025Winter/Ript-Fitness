package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDate;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.SocialPost;

public class SocialPostCommentDto {

	public Long id;
	
	public Long accountId;
	
	public String content;
	
    public Long postId;
    
    public LocalDate dateTimeCreated;
    
    public boolean isDeleted;
}
