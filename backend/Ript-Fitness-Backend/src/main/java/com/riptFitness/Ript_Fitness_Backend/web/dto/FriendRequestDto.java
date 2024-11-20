package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDateTime;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.RequestStatus;

public class FriendRequestDto {

	public Long id;
	public AccountsModel fromAccount;
	public AccountsModel toAccount;
	public RequestStatus status;
	public String fromUsername;
	public String toUsername;
	public LocalDateTime dateTimeOfMostRecentChangeToStatus;
}
