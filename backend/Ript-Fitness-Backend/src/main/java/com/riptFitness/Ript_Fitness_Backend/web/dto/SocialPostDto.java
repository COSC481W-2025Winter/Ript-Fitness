package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.util.List;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.SocialPostComment;

public class SocialPostDto {

	public Long id;
	
	public Long accountId;
    
    public String content;
    
    public int numberOfLikes;
    
    public List<Long> userIDsOfLikes;
    
    public List<SocialPostComment> socialPostComments;
    
    public boolean isDeleted;
}
