package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.riptFitness.Ript_Fitness_Backend.domain.model.SocialPost;
import com.riptFitness.Ript_Fitness_Backend.web.dto.SocialPostDto;

@Mapper
public interface SocialPostMapper {
	SocialPostMapper INSTANCE = Mappers.getMapper(SocialPostMapper.class);
	
	//the @Mapping lines were recommended by ChatGPT to deal with the public/private posts
    @Mapping(source = "isPublic", target = "isPublic")
    SocialPost toSocialPost(SocialPostDto socialPostDto);
    
    @Mapping(source = "isPublic", target = "isPublic")
    SocialPostDto toSocialPostDto(SocialPost socialPost);
	
}
