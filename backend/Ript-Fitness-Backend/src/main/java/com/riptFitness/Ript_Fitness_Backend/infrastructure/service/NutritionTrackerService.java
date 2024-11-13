package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.DayMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.mapper.FoodMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Day;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Food;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.NutritionTrackerDayRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.NutritionTrackerFoodRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.DayDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.FoodDto;

@Service 	//Tells Spring Boot that this is a Service method, important for dependency injection, this is REQUIRED
public class NutritionTrackerService {

	//Each method in this class will call the Repository class to make some sort of database interaction
	private NutritionTrackerFoodRepository nutritionTrackerFoodRepository;
	
	private NutritionTrackerDayRepository nutritionTrackerDayRepository;
	
	private AccountsService accountsService;
	
	private AccountsRepository accountsRepository;
	
	//Will be automatically called by dependency injection, you MUST include this constructor 
	public NutritionTrackerService(NutritionTrackerFoodRepository nutritionTrackerFoodRepository, NutritionTrackerDayRepository nutritionTrackerDayRepository, AccountsService accountsService, AccountsRepository accountsRepository) {
		this.nutritionTrackerFoodRepository = nutritionTrackerFoodRepository;
		this.nutritionTrackerDayRepository = nutritionTrackerDayRepository;
		this.accountsService= accountsService;
		this.accountsRepository = accountsRepository;
	}
	
	//Each method is public and will return a Dto of some sort to the Controller class
	
	//Adds a Food object to the database
	public FoodDto addFood(FoodDto foodDto) {
		Food foodToBeAdded = FoodMapper.INSTANCE.toFood(foodDto);
		foodToBeAdded.accountId = accountsService.getLoggedInUserId();
		foodToBeAdded = nutritionTrackerFoodRepository.save(foodToBeAdded);
		return FoodMapper.INSTANCE.toFoodDto(foodToBeAdded);
	}
	
	//Gets a specific row's values from the Food table (with id = foodId) and returns it to the controller class
	public FoodDto getFoodStats(Long foodId) {
		Optional<Food> returnedOptionalFoodObject = nutritionTrackerFoodRepository.findById(foodId);
		
		if(returnedOptionalFoodObject.isEmpty())
			throw new RuntimeException("Food object not found in database with ID = " + foodId);
				
		Food returnedFoodObject = returnedOptionalFoodObject.get();
		
		if(!accountIdCheck(returnedFoodObject.accountId))
			throw new RuntimeException("The Food object with ID = " + returnedFoodObject.id + " does not belong to the currently logged in user. AccountId of the Food object = " + returnedFoodObject.accountId + ", ID of the currently logged in user = " + accountsService.getLoggedInUserId());
		
		return FoodMapper.INSTANCE.toFoodDto(returnedFoodObject);
	}
	
	public ArrayList<Long> getFoodIdsOfLoggedInUser(){
		ArrayList<Long> foodIds;
		Long currentUsersAccountId = accountsService.getLoggedInUserId();
		Optional<ArrayList<Long>> optionalFoodIdList = nutritionTrackerFoodRepository.getPostsFromAccountId(currentUsersAccountId);
		
		if(optionalFoodIdList.isEmpty())
			foodIds = new ArrayList<Long>();
		else
			foodIds = optionalFoodIdList.get();
		
		return foodIds;
	}
	
	//Edits a specific row's values from the Food table (with id = foodId) to match stats with foodDto and returns the updated object to the controller class
	public FoodDto editFood(Long foodId, FoodDto foodDto) {
		Optional<Food> optionalFoodToBeEdited = nutritionTrackerFoodRepository.findById(foodId);
		
		if(optionalFoodToBeEdited.isEmpty())
			throw new RuntimeException("Food object not found in database with ID = " + foodId);
		
		Food foodToBeEdited = optionalFoodToBeEdited.get();
		
		if(!accountIdCheck(foodToBeEdited.accountId))
			throw new RuntimeException("The Food object with ID = " + foodToBeEdited.id + " does not belong to the currently logged in user. AccountId of the Food object = " + foodToBeEdited.accountId + ", ID of the currently logged in user = " + accountsService.getLoggedInUserId());
		
		FoodMapper.INSTANCE.updateFoodRowFromDto(foodDto, foodToBeEdited);
		foodToBeEdited = nutritionTrackerFoodRepository.save(foodToBeEdited);
		return FoodMapper.INSTANCE.toFoodDto(foodToBeEdited);
	}
	
	public FoodDto deleteFood(Long foodId) {
		Optional<Food> optionalFoodToBeDeleted = nutritionTrackerFoodRepository.findById(foodId);
		
		if(optionalFoodToBeDeleted.isEmpty())
			throw new RuntimeException("Food object not found in database with name = " + foodId);
		
		Food foodToBeDeleted = optionalFoodToBeDeleted.get();
		
		if(!accountIdCheck(foodToBeDeleted.accountId))
			throw new RuntimeException("The Food object with ID = " + foodToBeDeleted.id + " does not belong to the currently logged in user. AccountId of the Food object = " + foodToBeDeleted.accountId + ", ID of the currently logged in user = " + accountsService.getLoggedInUserId());
		
		foodToBeDeleted.isDeleted = true;
		nutritionTrackerFoodRepository.save(foodToBeDeleted);
		return FoodMapper.INSTANCE.toFoodDto(foodToBeDeleted);
	}
	
	public DayDto addDay(DayDto dayDto) {
		Day dayToBeAdded = DayMapper.INSTANCE.toDay(dayDto);
		Long currentlyLoggedInUserId = accountsService.getLoggedInUserId();
		AccountsModel currentlyLoggedInUser = accountsRepository.findById(currentlyLoggedInUserId).get();
		dayToBeAdded.account = currentlyLoggedInUser;
		dayToBeAdded = nutritionTrackerDayRepository.save(dayToBeAdded);
		return DayMapper.INSTANCE.toDayDto(dayToBeAdded);
	}
	
	public DayDto getDayStats(Long dayId) {
		Optional<Day> returnedOptionalDayObject = nutritionTrackerDayRepository.findById(dayId);
		
		if(returnedOptionalDayObject.isEmpty())
			throw new RuntimeException("Day object not found in database with ID = " + dayId);
		
		Day returnedDayObject = returnedOptionalDayObject.get();
		
		if(!accountIdCheck(returnedDayObject.account.getId()))
			throw new RuntimeException("The Day object with ID = " + returnedDayObject.id + " does not belong to the currently logged in user. AccountId of the Day object = " + returnedDayObject.account.getId() + ", ID of the currently logged in user = " + accountsService.getLoggedInUserId());
		
		calculateTotalDayStats(returnedDayObject);
		
		nutritionTrackerDayRepository.save(returnedDayObject);
		
		return DayMapper.INSTANCE.toDayDto(returnedDayObject);
	}
	
	public ArrayList<Long> getDayIdsOfLoggedInUser(){
		ArrayList<Long> dayIds;
		Long currentUsersAccountId = accountsService.getLoggedInUserId();
		Optional<ArrayList<Long>> optionalDayIdList = nutritionTrackerDayRepository.getDayIdsFromAccountId(currentUsersAccountId);
		
		if(optionalDayIdList.isEmpty())
			dayIds = new ArrayList<Long>();
		else
			dayIds = optionalDayIdList.get();
		
		return dayIds;
	}
	
	public DayDto deleteDay(Long dayId) {
		Optional<Day> optionalDayToBeDeleted = nutritionTrackerDayRepository.findById(dayId);
		
		if(optionalDayToBeDeleted.isEmpty())
			throw new RuntimeException("Day object not found in database with ID = " + dayId);
		
		Day dayToBeDeleted = optionalDayToBeDeleted.get();
		
		if(!accountIdCheck(dayToBeDeleted.account.getId()))
			throw new RuntimeException("The Day object with ID = " + dayToBeDeleted.id + " does not belong to the currently logged in user. AccountId of the Food object = " + dayToBeDeleted.account.getId() + ", ID of the currently logged in user = " + accountsService.getLoggedInUserId());
		
		dayToBeDeleted.isDeleted = true;
		nutritionTrackerDayRepository.save(dayToBeDeleted);
		return DayMapper.INSTANCE.toDayDto(dayToBeDeleted);
	}
	
	public DayDto addFoodsToDay(Long dayId, List<Long> foodIds) {
		Optional<Day> optionalDayBeingUpdated = nutritionTrackerDayRepository.findById(dayId);
		
		if(optionalDayBeingUpdated.isEmpty())
			throw new RuntimeException("Day object not found in database with ID = " + dayId);
		
		Day dayBeingUpdated = optionalDayBeingUpdated.get();
		
		if(!accountIdCheck(dayBeingUpdated.account.getId()))
			throw new RuntimeException("The Day object with ID = " + dayBeingUpdated.id + " does not belong to the currently logged in user. AccountId of the Food object = " + dayBeingUpdated.account.getId() + ", ID of the currently logged in user = " + accountsService.getLoggedInUserId());
		
		List<Food> foodsAddedToDayObject = new ArrayList<>();
		
		for(Long foodId : foodIds) {
			Optional<Food> nextOptionalFoodObjectAdded = nutritionTrackerFoodRepository.findById(foodId);
			
			if(nextOptionalFoodObjectAdded.isEmpty())
				throw new RuntimeException("Food object not found in database with ID = " + foodId + " when trying to add Food object to Day object. No Foods were added to the Day object.");
				
			Food nextFoodObjectAdded = nextOptionalFoodObjectAdded.get();
			
			if(!accountIdCheck(nextFoodObjectAdded.accountId))
				throw new RuntimeException("The Food object with ID = " + nextFoodObjectAdded + " does not belong to the currenlty logged in user. AccountId of the Food object = " + nextFoodObjectAdded.accountId + ", ID of the currently logged in user = " + accountsService.getLoggedInUserId());
			
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
		
		if(!accountIdCheck(dayBeingUpdated.account.getId()))
			throw new RuntimeException("The Day object with ID = " + dayBeingUpdated.id + " does not belong to the currently logged in user. AccountId of the Food object = " + dayBeingUpdated.account.getId() + ", ID of the currently logged in user = " + accountsService.getLoggedInUserId());
		
		List<Food> foodsAddedToDayObject = new ArrayList<>();
		
		for(Long foodId : foodIds) {
			Optional<Food> nextOptionalFoodObjectAdded = nutritionTrackerFoodRepository.findById(foodId);
			
			if(nextOptionalFoodObjectAdded.isEmpty())
				throw new RuntimeException("Food object not found in database with ID = " + foodId + " when trying to delete Food object to Day object. No Foods were deleted from the Day object.");
				
			Food nextFoodObjectAdded = nextOptionalFoodObjectAdded.get();
			
			if(!accountIdCheck(nextFoodObjectAdded.accountId))
				throw new RuntimeException("The Food object with ID = " + nextFoodObjectAdded + " does not belong to the currenlty logged in user. AccountId of the Food object = " + nextFoodObjectAdded.accountId + ", ID of the currently logged in user = " + accountsService.getLoggedInUserId());
			
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
	
	public DayDto editWaterIntake(Long dayId, int waterIntake) {
		Optional<Day> optionalDayBeingUpdated = nutritionTrackerDayRepository.findById(dayId);
		
		if(optionalDayBeingUpdated.isEmpty())
			throw new RuntimeException("Day object not found in database with ID = " + dayId);
		
		Day dayBeingUpdated = optionalDayBeingUpdated.get();
		
		if(!accountIdCheck(dayBeingUpdated.account.getId()))
			throw new RuntimeException("The Day object with ID = " + dayBeingUpdated.id + " does not belong to the currently logged in user. AccountId of the Food object = " + dayBeingUpdated.account.getId() + ", ID of the currently logged in user = " + accountsService.getLoggedInUserId());
		
		dayBeingUpdated.totalWaterConsumed = waterIntake;
		
		if(dayBeingUpdated.totalWaterConsumed < 0)
			dayBeingUpdated.totalWaterConsumed = 0;
		
		nutritionTrackerDayRepository.save(dayBeingUpdated);
		
		return DayMapper.INSTANCE.toDayDto(dayBeingUpdated);
	}
	
	public void calculateTotalDayStats(Day day) {	
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
	
	public boolean accountIdCheck(Long objectAccountId) {
		if(objectAccountId == null)	//objectAccountId will only be null during unit tests, return true
			return true;
		
		if(!(objectAccountId == accountsService.getLoggedInUserId()))
			return false;
		
		return true;
	}
}
