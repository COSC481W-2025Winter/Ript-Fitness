package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
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

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.JwtUtil;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.SecurityConfig;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Day;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Food;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.NutritionTrackerService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.NutritionTrackerController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.DayDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.FoodDto;

@WebMvcTest(NutritionTrackerController.class)
@ActiveProfiles("test")
@Import(SecurityConfig.class)
public class NutritionTrackerControllerTest {
	
	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private static NutritionTrackerService nutritionTrackerService;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	@MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;

	
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
		dayDto.totalWaterConsumed = 0;

		day = new Day();
		day.foodsEatenInDay = List.of(food, foodTwo);
		day.totalWaterConsumed = 0;
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
		when(nutritionTrackerService.getFoodStats(any(Long.class))).thenReturn(foodDto);
		
		mockMvc.perform(get("/nutritionCalculator/getFood/1")
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
		when(nutritionTrackerService.editFood(any(Long.class), any(FoodDto.class))).thenReturn(foodDto);
		
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
	public void testDeleteFoodValidRequest() throws Exception{
		foodDto.isDeleted = true;
		
		when(nutritionTrackerService.deleteFood(any(Long.class))).thenReturn(foodDto);
		
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
	public void testGetDayOfLoggedInUserValidRequest() throws Exception {
		when(nutritionTrackerService.getDayOfLoggedInUser(0)).thenReturn(dayDto);
		
		mockMvc.perform(get("/nutritionCalculator/getDayOfLoggedInUser/0")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("foodsEatenInDay.size()").value(2))
				.andReturn();
	}
	
	@Test
	public void testGetDayOfLoggedInUserInvalidRequestNoPathVariable() throws Exception {
		mockMvc.perform(get("/nutritionCalculator/getDayOfLoggedInUser"))
				.andExpect(status().isInternalServerError());
	}
	
	@Test
	public void testDeleteDayValidRequest() throws Exception{
		dayDto.isDeleted = true;
		
		when(nutritionTrackerService.deleteDay(any(Long.class))).thenReturn(dayDto);
		
		mockMvc.perform(delete("/nutritionCalculator/deleteDay/1")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.isDeleted").value(true))
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
	public void testAddFoodsToDayValidRequest() throws Exception {
		when(nutritionTrackerService.addFoodsToDay(any(Long.class), anyList())).thenReturn(dayDto);
		
		mockMvc.perform(post("/nutritionCalculator/addFoodsToDay/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content("[1]"))
				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.foodsEatenInDay.size()").value(2))
				.andReturn();
	}
	
	@Test
	public void testDeleteFoodsInDayValidRequest() throws Exception {
		when(nutritionTrackerService.deleteFoodsInDay(any(Long.class), anyList())).thenReturn(dayDto);
		
		mockMvc.perform(post("/nutritionCalculator/deleteFoodsInDay/0")
				.contentType(MediaType.APPLICATION_JSON)
				.content("[1]"))
				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.totalWaterConsumed").value(0))
				.andReturn();
	}
	
	@Test
	public void testEditWaterIntake() throws Exception{		
		when(nutritionTrackerService.editWaterIntake(any(Long.class), any(Integer.class))).thenReturn(dayDto);
		
		mockMvc.perform(put("/nutritionCalculator/editWaterIntake/1/5")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andReturn();
	}
	
}
