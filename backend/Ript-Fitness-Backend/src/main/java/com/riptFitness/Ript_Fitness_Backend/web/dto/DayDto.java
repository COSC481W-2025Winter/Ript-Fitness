package com.riptFitness.Ript_Fitness_Backend.web.dto;

import java.util.ArrayList;
import java.util.List;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Food;

//Dto must match the model class exactly minus the "@" declarations
public class DayDto {

	public Long id;
	public List<Food> foodsEatenInDay = new ArrayList<>();	
	public List<Long> foodIdsInFoodsEatenInDayList = new ArrayList<>();
	public double calories;
	public double totalCarbs;
	public double totalProtein;
	public double totalFat;
	public int totalWaterConsumed;
	public boolean isDeleted = false;
}
