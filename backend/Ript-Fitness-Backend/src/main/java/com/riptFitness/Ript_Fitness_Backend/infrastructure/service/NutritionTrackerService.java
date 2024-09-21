package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.DayMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.mapper.FoodMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Day;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Food;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.NutritionTrackerDayRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.NutritionTrackerFoodRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.DayDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.FoodDto;

@Service 	//Tells Spring Boot that this is a Service method, important for dependency injection, this is REQUIRED
public class NutritionTrackerService {

	//Each method in this class will call the Repository class to make some sort of database interaction
	private NutritionTrackerFoodRepository nutritionTrackerFoodRepository;
	
	private NutritionTrackerDayRepository nutritionTrackerDayRepository;
	
	//Will be automatically called by dependency injection, you MUST include this constructor 
	public NutritionTrackerService(NutritionTrackerFoodRepository nutritionTrackerFoodRepository, NutritionTrackerDayRepository nutritionTrackerDayRepository) {
		this.nutritionTrackerFoodRepository = nutritionTrackerFoodRepository;
		this.nutritionTrackerDayRepository = nutritionTrackerDayRepository;
	}
	
	//Each method is public and will return a Dto of some sort to the Controller class
	
	//Adds a Food object to the database
	public FoodDto addFood(FoodDto foodDto) {
		Food foodToBeAdded = FoodMapper.INSTANCE.toFood(foodDto);
		foodToBeAdded = nutritionTrackerFoodRepository.save(foodToBeAdded);
		return FoodMapper.INSTANCE.toFoodDto(foodToBeAdded);
	}
	
	//Gets a specific row's values from the Food table (with id = foodId) and returns it to the controller class
	public FoodDto getFoodStats(String foodName) {
		Optional<Food> returnedOptionalFoodObject = nutritionTrackerFoodRepository.findByName(foodName);
		
		if(returnedOptionalFoodObject.isEmpty())
			throw new RuntimeException("Food object not found in database with name = " + foodName);
		
		Food returnedFoodObject = returnedOptionalFoodObject.get();
		
		return FoodMapper.INSTANCE.toFoodDto(returnedFoodObject);
	}
	
	//Edits a specific row's values from the Food table (with id = foodId) to match stats with foodDto and returns the updated object to the controller class
	public FoodDto editFood(String foodName, FoodDto foodDto) {
		Optional<Food> optionalFoodToBeEdited = nutritionTrackerFoodRepository.findByName(foodName);
		
		if(optionalFoodToBeEdited.isEmpty())
			throw new RuntimeException("Food object not found in database with name = " + foodName);
		
		Food foodToBeEdited = optionalFoodToBeEdited.get();
		FoodMapper.INSTANCE.updateFoodRowFromDto(foodDto, foodToBeEdited);
		foodToBeEdited = nutritionTrackerFoodRepository.save(foodToBeEdited);
		return FoodMapper.INSTANCE.toFoodDto(foodToBeEdited);
	}
	
	public FoodDto deleteFood(String foodName) {
		Optional<Food> optionalFoodToBeDeleted = nutritionTrackerFoodRepository.findByName(foodName);
		
		if(optionalFoodToBeDeleted.isEmpty())
			throw new RuntimeException("Food object not found in database with name = " + foodName);
		
		Food foodToBeDeleted = optionalFoodToBeDeleted.get();
		foodToBeDeleted.isDeleted = true;
		nutritionTrackerFoodRepository.save(foodToBeDeleted);
		return FoodMapper.INSTANCE.toFoodDto(foodToBeDeleted);
	}
	
	public DayDto addDay(DayDto dayDto) {
		Day dayToBeAdded = DayMapper.INSTANCE.toDay(dayDto);
		dayToBeAdded = nutritionTrackerDayRepository.save(dayToBeAdded);
		return DayMapper.INSTANCE.toDayDto(dayToBeAdded);
	}
	
	public DayDto getDayStats(Long dayId) {
		Optional<Day> returnedOptionalDayObject = nutritionTrackerDayRepository.findById(dayId);
		
		if(returnedOptionalDayObject.isEmpty())
			throw new RuntimeException("Day object not found in database with ID = " + dayId);
		
		Day returnedDayObject = returnedOptionalDayObject.get();
		calculateTotalDayStats(returnedDayObject);
		
		nutritionTrackerDayRepository.save(returnedDayObject);
		
		return DayMapper.INSTANCE.toDayDto(returnedDayObject);
	}
	
	public DayDto deleteDay(Long dayId) {
		Optional<Day> optionalDayToBeDeleted = nutritionTrackerDayRepository.findById(dayId);
		
		if(optionalDayToBeDeleted.isEmpty())
			throw new RuntimeException("Day object not found in database with ID = " + dayId);
		
		Day dayToBeDeleted = optionalDayToBeDeleted.get();
		dayToBeDeleted.isDeleted = true;
		nutritionTrackerDayRepository.save(dayToBeDeleted);
		return DayMapper.INSTANCE.toDayDto(dayToBeDeleted);
	}
	
	public DayDto addFoodsToDay(Long dayId, List<Long> foodIds) {
		Optional<Day> optionalDayBeingUpdated = nutritionTrackerDayRepository.findById(dayId);
		
		if(optionalDayBeingUpdated.isEmpty())
			throw new RuntimeException("Day object not found in database with ID = " + dayId);
		
		Day dayBeingUpdated = optionalDayBeingUpdated.get();
		
		List<Food> foodsAddedToDayObject = new ArrayList<>();
		
		for(Long foodId : foodIds) {
			Optional<Food> nextOptionalFoodObjectAdded = nutritionTrackerFoodRepository.findById(foodId);
			
			if(nextOptionalFoodObjectAdded.isEmpty())
				throw new RuntimeException("Food object not found in database with ID = " + foodId + " when trying to add Food object to Day object. No Foods were added to the Day object.");
				
			Food nextFoodObjectAdded = nextOptionalFoodObjectAdded.get();
			
			foodsAddedToDayObject.add(nextFoodObjectAdded);
		}
		
		for(Food foodInList : foodsAddedToDayObject) {
			dayBeingUpdated.foodsEatenInDay.add(foodInList);
			dayBeingUpdated.foodIdsInFoodsEatenInDayList.add(foodInList.id);
		}
		
		calculateTotalDayStats(dayBeingUpdated);	
		nutritionTrackerDayRepository.save(dayBeingUpdated);
		return DayMapper.INSTANCE.toDayDto(dayBeingUpdated);
	}
	
	public DayDto deleteFoodsInDay(Long dayId, List<Long> foodIds) {
		Optional<Day> optionalDayBeingUpdated = nutritionTrackerDayRepository.findById(dayId);
		
		if(optionalDayBeingUpdated.isEmpty())
			throw new RuntimeException("Day object not found in database with ID = " + dayId);
		
		Day dayBeingUpdated = optionalDayBeingUpdated.get();
		
		List<Food> foodsAddedToDayObject = new ArrayList<>();
		
		for(Long foodId : foodIds) {
			Optional<Food> nextOptionalFoodObjectAdded = nutritionTrackerFoodRepository.findById(foodId);
			
			if(nextOptionalFoodObjectAdded.isEmpty())
				throw new RuntimeException("Food object not found in database with ID = " + foodId + " when trying to delete Food object to Day object. No Foods were deleted from the Day object.");
				
			Food nextFoodObjectAdded = nextOptionalFoodObjectAdded.get();
			
			foodsAddedToDayObject.add(nextFoodObjectAdded);
		}
		
		for(Food foodInList : foodsAddedToDayObject) {
			dayBeingUpdated.foodsEatenInDay.remove(foodInList);
			dayBeingUpdated.foodIdsInFoodsEatenInDayList.remove(foodInList.id);
		}
		
		calculateTotalDayStats(dayBeingUpdated);	
		nutritionTrackerDayRepository.save(dayBeingUpdated);
		return DayMapper.INSTANCE.toDayDto(dayBeingUpdated);
	}
	
	private void calculateTotalDayStats(Day day) {	
		if(day == null)
			throw new IllegalArgumentException("Day cannot be null in calculateTotalDayStats method in CalculateStats class.");
		
		int totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
		
		for(Food food : day.foodsEatenInDay) {
			if(food.isDeleted)
				continue;
			totalCalories += food.calories * food.multiplier;
			totalProtein += food.protein * food.multiplier;
			totalCarbs += food.carbs * food.multiplier;
			totalFat += food.fat * food.multiplier;
		}
		
		day.calories = totalCalories;
		day.totalProtein = totalProtein;
		day.totalCarbs = totalCarbs;
		day.totalFat = totalFat;
	}
}
