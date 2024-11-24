package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.riptFitness.Ript_Fitness_Backend.domain.model.FriendRequest;
import com.riptFitness.Ript_Fitness_Backend.web.dto.FriendRequestDto;

@Mapper
public interface FriendRequestMapper {
	FriendRequestMapper INSTANCE = Mappers.getMapper(FriendRequestMapper.class);
	
	FriendRequestDto toFriendRequestDto(FriendRequest friendRequest);
	
	FriendRequest toFriendRequest(FriendRequestDto friendRequestDto);
}
