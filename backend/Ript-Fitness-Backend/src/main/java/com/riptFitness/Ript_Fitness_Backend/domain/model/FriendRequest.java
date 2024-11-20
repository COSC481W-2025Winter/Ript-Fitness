package com.riptFitness.Ript_Fitness_Backend.domain.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class FriendRequest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	
	@ManyToOne
	@JoinColumn(name = "from_account_id", nullable = false)
	public AccountsModel fromAccount;
	
	@ManyToOne
	@JoinColumn(name = "to_account_id", nullable = false)
	public AccountsModel toAccount;
	
	@Enumerated(EnumType.STRING)
	public RequestStatus status;
	
	public String fromUsername; //Username of fromAccount's userProfile
	
	public String toUsername;	//Username of toAccount's userProfile
	
	public LocalDateTime dateTimeOfMostRecentChangeToStatus;
}
