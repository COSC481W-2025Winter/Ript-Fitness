package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.util.ArrayList;
import java.util.List;

//Dto must match the model class exactly minus the "@" declarations (and excluding any variables you don't want sent to the front end)
public class DayDto {

	public Long id;
	public List<FoodDto> foodsEatenInDay = new ArrayList<>();	
	public double calories;
	public double totalCarbs;
	public double totalProtein;
	public double totalFat;
	public int totalWaterConsumed;
	public boolean isDeleted = false;
}
