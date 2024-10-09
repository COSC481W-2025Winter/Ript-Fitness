package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.time.LocalDateTime;

//Dto is same as the model but doesn't need the @ 
public class StreakDto {
	public Long id;
	public int currentSt;
	public LocalDateTime prevLogin;
}
