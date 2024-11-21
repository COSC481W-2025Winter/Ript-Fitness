package com.riptFitness.Ript_Fitness_Backend.domain.model;

public enum RequestStatus {
	PENDING,
	SENT,
	ACCEPTED,
	DECLINED
}

/*
Statuses are always going from fromAccount to toAccount
fromAccount is the account making the status change, and the descriptions below are for the fromAccount when on toAccount's profile page

PENDING = toAccount has sent a friend request to fromAccount that hasn't been accepted or declined
	Front end will display "Respond" to the user when their status is PENDING 

SENT = fromAccount has sent a friend request to toAccount that hasn't been accepted 
	Front end will display "Sent" to the user when their status is SENT
	
ACCEPTED = fromAccount and toAccount are currently friends and have a 2-way relationship in the friends_list database table
	Front end will display that both users are friends 
	
DECLINED = fromAccount has declined toAccount's friend request
	Front end will display an "Add friend" message to the fromAccount, as it is up to them to have a potential friendship with toAccount again
	toAccount's status with fromAccount will be set to "SENT", and they will not be able to tell that fromAccount has declined their friend request
*/
