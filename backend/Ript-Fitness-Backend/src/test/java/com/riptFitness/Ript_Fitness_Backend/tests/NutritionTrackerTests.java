package com.riptFitness.Ript_Fitness_Backend.tests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Day;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Food;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.NutritionTrackerDayRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.NutritionTrackerFoodRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.NutritionTrackerService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.NutritionTrackerController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.DayDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.FoodDto;

@WebMvcTest(NutritionTrackerController.class)
public class NutritionTrackerTests {
	
	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private static NutritionTrackerService nutritionTrackerService;
	
	@Mock
	private NutritionTrackerFoodRepository nutritionTrackerFoodRepository;
	
	@Mock
	private NutritionTrackerDayRepository nutritionTrackerDayRepository;
	
	@InjectMocks
	private NutritionTrackerService nutritionTrackerServiceForServiceTests;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	private FoodDto foodDto;
	private FoodDto foodDtoTwo;
	private Food food;
	private Food foodTwo;
	private DayDto dayDto;
	private Day day;
	
	@BeforeEach
	public void setUp() {
		foodDto = new FoodDto();
		foodDto.name = "Protein bar";
		foodDto.calories = 400;
		foodDto.protein = 30;
		foodDto.carbs = 40;
		foodDto.fat = 21;
		foodDto.multiplier = 1.0;
		
		food = new Food();
		food.name = "Protein bar";
		food.calories = 400;
		food.protein = 30;
		food.carbs = 40;
		food.fat = 21;
		food.multiplier = 1.0;
		
		foodDtoTwo = new FoodDto();
		foodDtoTwo.name = "Chicken breast";
		foodDtoTwo.calories = 500;
		foodDtoTwo.protein = 100;
		foodDtoTwo.carbs = 0;
		foodDtoTwo.fat = 9;
		foodDtoTwo.multiplier = 0.5;
		
		foodTwo = new Food();
		foodTwo.name = "Chicken breast";
		foodTwo.calories = 500;
		foodTwo.protein = 100;
		foodTwo.carbs = 0;
		foodTwo.fat = 9;
		foodTwo.multiplier = 0.5;
				
		dayDto = new DayDto();
		dayDto.foodsEatenInDay = List.of(food, foodTwo);

		day = new Day();
		day.foodsEatenInDay = List.of(food, foodTwo);
	}
	
	@AfterAll
	public static void tearDown() {
		reset(nutritionTrackerService);
	}

	//Controller tests
	@Test
	public void testAddFoodValidRequest() throws Exception{
		when(nutritionTrackerService.addFood(any(FoodDto.class))).thenReturn(foodDto);
			
		mockMvc.perform(post("/nutritionCalculator/addFood")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsBytes(foodDto)))
				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.name").value("Protein bar"))
				.andExpect(jsonPath("$.calories").value(400))
				.andExpect(jsonPath("$.protein").value(30))
				.andExpect(jsonPath("$.carbs").value(40))
				.andExpect(jsonPath("$.fat").value(21))
				.andExpect(jsonPath("$.multiplier").value(1.0))
				.andReturn();	
	}
	
	@Test
	public void testAddFoodInvalidRequestEmptyBody() throws Exception{
		mockMvc.perform(post("/nutritionCalculator/addFood")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}	
	@Test
	public void testGetFoodValidRequest() throws Exception{
		when(nutritionTrackerService.getFoodStats(any(String.class))).thenReturn(foodDto);
		
		mockMvc.perform(get("/nutritionCalculator/getFood/test")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.name").value("Protein bar"))
				.andExpect(jsonPath("$.calories").value(400))
				.andExpect(jsonPath("$.protein").value(30))
				.andExpect(jsonPath("$.carbs").value(40))
				.andExpect(jsonPath("$.fat").value(21))
				.andExpect(jsonPath("$.multiplier").value(1.0))
				.andReturn();	
	}

	@Test
	public void testEditFoodValidRequest() throws Exception{
		when(nutritionTrackerService.editFood(any(String.class), any(FoodDto.class))).thenReturn(foodDto);
		
		mockMvc.perform(put("/nutritionCalculator/editFood/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(foodDto)))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.name").value("Protein bar"))
				.andExpect(jsonPath("$.calories").value(400))
				.andExpect(jsonPath("$.protein").value(30))
				.andExpect(jsonPath("$.carbs").value(40))
				.andExpect(jsonPath("$.fat").value(21))
				.andExpect(jsonPath("$.multiplier").value(1.0))
				.andReturn();	
	}
	
	@Test
	public void testEditFoodInvalidRequestEmptyBody() throws Exception{
		mockMvc.perform(put("/nutritionCalculator/editFood/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
	
	@Test
	public void testDeleteFood() throws Exception{
		foodDto.isDeleted = true;
		
		when(nutritionTrackerService.deleteFood(any(String.class))).thenReturn(foodDto);
		
		mockMvc.perform(delete("/nutritionCalculator/deleteFood/1")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.isDeleted").value(true))
				.andReturn();	
	}
	
	@Test
	public void testAddDayValidRequest() throws Exception{
		when(nutritionTrackerService.addDay(any(DayDto.class))).thenReturn(dayDto);
				
		mockMvc.perform(post("/nutritionCalculator/addDay")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(dayDto)))
				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andReturn();
	}
	
	@Test
	public void testAddDayInvalidRequestEmptyBody() throws Exception{
		mockMvc.perform(post("/nutritionCalculator/addDay")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
	
	@Test
	public void testGetDayValidRequest() throws Exception{
		when(nutritionTrackerService.getDayStats(any(Long.class))).thenReturn(dayDto);
		
		mockMvc.perform(put("/nutritionCalculator/getDay/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andReturn();
	}
	
	@Test
	public void testAddFoodsToDayInvalidRequestEmptyBody() throws Exception{
		mockMvc.perform(post("/nutritionCalculator/addFoodsToDay/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
	
	@Test
	public void testDeleteFoodsInDayInvalidRequestEmptyBody() throws Exception{
		mockMvc.perform(post("/nutritionCalculator/deleteFoodsInDay/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
	
	@Test
	public void testDeleteDay() throws Exception{
		dayDto.isDeleted = true;
		
		when(nutritionTrackerService.deleteDay(any(Long.class))).thenReturn(dayDto);
		
		mockMvc.perform(delete("/nutritionCalculator/deleteDay/1")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.isDeleted").value(true))
				.andReturn();
	}
	
	//Service tests
	@Test
	void testServiceAddFoodValid() {
		when(nutritionTrackerFoodRepository.save(any(Food.class))).thenReturn(food);
		
		FoodDto result = nutritionTrackerServiceForServiceTests.addFood(foodDto);
		
		assertNotNull(result);
		assertEquals("Protein bar", result.name);
		assertEquals(21, result.fat);
	}
	
	@Test
	void testServiceAddFoodInvalidNullFoodDto() {
		FoodDto result = nutritionTrackerServiceForServiceTests.addFood(null);
		
		assertNull(result);
	}
	
	@Test
	void testServiceGetFoodStatsValid() {
		when(nutritionTrackerFoodRepository.findByName("Chicken breast")).thenReturn(Optional.of(food));
		
		FoodDto result = nutritionTrackerServiceForServiceTests.getFoodStats("Chicken breast");
		
		assertNotNull(result);
		assertEquals(40, result.carbs);
	}
	
	@Test
	void testServiceGetFoodStatsInvalidNotInDatabase() {
		when(nutritionTrackerFoodRepository.findByName("Chicken breast")).thenReturn(Optional.empty());
		
		assertThrows(RuntimeException.class, () -> nutritionTrackerServiceForServiceTests.getFoodStats("Chicken breast"));
	}
	
	@Test
	void testServiceEditFoodValid() {
		when(nutritionTrackerFoodRepository.findByName("Chicken breast")).thenReturn(Optional.of(food));
		when(nutritionTrackerFoodRepository.save(any(Food.class))).thenReturn(food);
		
		FoodDto result = nutritionTrackerServiceForServiceTests.editFood("Chicken breast", foodDto);
		
		assertNotNull(result);
		assertEquals(400, result.calories);
	}
	
	@Test
	void testServiceEditFoodNotInDatabase() {
		when(nutritionTrackerFoodRepository.findByName("Chicken breast")).thenReturn(Optional.empty());
		
		assertThrows(RuntimeException.class, () -> nutritionTrackerServiceForServiceTests.editFood("Chicken breast", foodDto));
	}
	
	@Test
	void testServiceDeleteFoodValid() {
		when(nutritionTrackerFoodRepository.findByName("Chicken breast")).thenReturn(Optional.of(food));
		
		FoodDto result = nutritionTrackerServiceForServiceTests.deleteFood("Chicken breast");
		
		assertNotNull(result);
		assertTrue(result.isDeleted);
	}
	
	@Test
	void testServiceDeleteFoodInvalidNotInDatabase() {
		when(nutritionTrackerFoodRepository.findByName("Chicken breast")).thenReturn(Optional.empty());
		
		assertThrows(RuntimeException.class, () -> nutritionTrackerServiceForServiceTests.deleteFood("Chicken breast"));
	}
	
	@Test
	void testServiceAddDayValid() {
		when(nutritionTrackerDayRepository.save(any(Day.class))).thenReturn(day);
		
		DayDto result = nutritionTrackerServiceForServiceTests.addDay(dayDto);
		
		assertNotNull(result);
	}
	
	@Test
	void testServiceAddDayInvalidNullDayDto() {
		DayDto result = nutritionTrackerServiceForServiceTests.addDay(null);
		
		assertNull(result);
	}
	
	@Test
	void testServiceGetDayStatsValid() {
		when(nutritionTrackerDayRepository.findById(1L)).thenReturn(Optional.of(day));
		when(nutritionTrackerDayRepository.save(any(Day.class))).thenReturn(day);
		
		DayDto result = nutritionTrackerServiceForServiceTests.getDayStats(1L);
		
		assertNotNull(result);
	}
	
	@Test
	void testServiceGetDayStatsInvalidNotInDatabase() {
		when(nutritionTrackerDayRepository.findById(1L)).thenReturn(Optional.empty());
		
		assertThrows(RuntimeException.class, () -> nutritionTrackerServiceForServiceTests.getDayStats(1L));
	}
	
	@Test
	void testServiceDeleteDayValid() {
		when(nutritionTrackerDayRepository.findById(1L)).thenReturn(Optional.of(day));
		
		DayDto result = nutritionTrackerServiceForServiceTests.deleteDay(1L);
		
		assertNotNull(result);
		assertTrue(result.isDeleted);
	}
	
	@Test
	void testServiceDeleteDayInvalidNotInDatabase() {
		when(nutritionTrackerDayRepository.findById(1L)).thenReturn(Optional.empty());
		
		assertThrows(RuntimeException.class, () -> nutritionTrackerServiceForServiceTests.deleteDay(1L));
	}
	
	@Test
	void testServiceAddFoodsToDayInvalidFoodNotInDatabase() {
		when(nutritionTrackerDayRepository.findById(1L)).thenReturn(Optional.of(day));
		when(nutritionTrackerFoodRepository.findByName("Chicken breast")).thenReturn(Optional.empty());
		
		assertThrows(RuntimeException.class, () -> nutritionTrackerServiceForServiceTests.addFoodsToDay(1L, List.of(2L)));
	}
	
	@Test
	void testServiceDeleteFoodsInDayInvalidDayNotInDatabase() {
		when(nutritionTrackerDayRepository.findById(1L)).thenReturn(Optional.empty());
		
		assertThrows(RuntimeException.class, () -> nutritionTrackerServiceForServiceTests.deleteFoodsInDay(1L, List.of(2L, 3L)));
	}
	
	@Test
	void testServiceDeleteFoodsInDayInvalidFoodNotInDatabase() {
		when(nutritionTrackerDayRepository.findById(1L)).thenReturn(Optional.of(day));
		when(nutritionTrackerFoodRepository.findByName("Chicken breast")).thenReturn(Optional.empty());
		
		assertThrows(RuntimeException.class, () -> nutritionTrackerServiceForServiceTests.deleteFoodsInDay(1L, List.of(2L)));
	}
	
	@Test
	public void testServiceCalculateTotalDayStatsValidRatiosAddTo100() {		
		nutritionTrackerServiceForServiceTests.calculateTotalDayStats(day);
		
		assertEquals(650, day.calories);
		assertEquals(80, day.totalProtein);
		assertEquals(40, day.totalCarbs);
		assertEquals(25, day.totalFat);
	}

	@Test
	public void testCalculateTotalDayStatsInvalidNullDay() {
		day = null;
				
		assertThrows(IllegalArgumentException.class, () -> nutritionTrackerServiceForServiceTests.calculateTotalDayStats(day));
	}
}