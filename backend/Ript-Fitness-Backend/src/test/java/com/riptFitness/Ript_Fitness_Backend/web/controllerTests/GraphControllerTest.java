package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

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

import java.time.LocalDateTime;
import java.util.ArrayList;
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
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.GraphService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.GraphController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.GraphDto;

@WebMvcTest(GraphController.class)
@ActiveProfiles("test")
@Import(SecurityConfig.class)
public class GraphControllerTest {

	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private static GraphService graphService;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	@MockBean
	private JwtUtil jwtUtil;
	
	@MockBean
	private UserDetailsService userDetailsService;
	
	@AfterAll
	public static void tearDown() {
		reset(graphService);
	}
	
	private GraphDto graphDto;
	
	@BeforeEach
	public void setUp() {
		graphDto = new GraphDto();
		graphDto.id = 1L;
		graphDto.xAxisName = "Dates";
		graphDto.yAxisName = "Body Weight";
		graphDto.title = "Body Weight Graph";
		graphDto.xAxis = List.of(LocalDateTime.of(2024, 12, 4, 11, 30));
		graphDto.yAxis = List.of(190.1);		
	}
	
	@Test
	public void testAddNewGraphValidRequest() throws Exception {
		when(graphService.addNewGraph(any(GraphDto.class))).thenReturn(graphDto);
		
		mockMvc.perform(post("/graph/addNewGraph")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsBytes(graphDto)))
				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value(1L))
				.andExpect(jsonPath("$.xAxisName").value("Dates"))
				.andExpect(jsonPath("$.yAxisName").value("Body Weight"))
				.andExpect(jsonPath("$.title").value("Body Weight Graph"))
				.andReturn();
	}
	
	@Test
	public void testAddNewGraphInvalidRequestEmptyBody() throws Exception {
		mockMvc.perform(post("/graph/addNewGraph")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
	
	@Test
	public void testGetGraphsOfCurrentlyLoggedInUserValidRequest() throws Exception {
		when(graphService.getGraphsOfCurrentlyLoggedInUser()).thenReturn(new ArrayList<>(List.of(graphDto)));
		
		mockMvc.perform(get("/graph/getGraphsOfCurrentlyLoggedInUser")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$[0].id").value(1L))
				.andExpect(jsonPath("$[0].xAxisName").value("Dates"))
				.andExpect(jsonPath("$[0].yAxisName").value("Body Weight"))
				.andExpect(jsonPath("$[0].title").value("Body Weight Graph"))
				.andExpect(jsonPath("$[0].yAxis[0]").value(190.1))				
				.andReturn();
	}
	
	@Test
	public void testAddValueValidRequest() throws Exception {
		when(graphService.addValue(any(Double.class), any(String.class))).thenReturn(graphDto);
		
		mockMvc.perform(put("/graph/addValue/189")
				.contentType(MediaType.APPLICATION_JSON)
				.content("Body Weight Graph"))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value(1L))
				.andExpect(jsonPath("$.xAxisName").value("Dates"))
				.andExpect(jsonPath("$.yAxisName").value("Body Weight"))
				.andReturn();
	}
	
	@Test
	public void testAddValueInvalidRequestNoPathVariable() throws Exception {
		mockMvc.perform(put("/graph/addValue")
				.contentType(MediaType.APPLICATION_JSON)
				.content("Body Weight Graph"))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
	
	@Test
	public void testAddValueInvalidRequestEmptyBody() throws Exception {
		mockMvc.perform(put("/graph/addValue/189")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
	
	@Test
	public void testDeleteValueValidRequest() throws Exception {
		when(graphService.deleteValue(any(Integer.class), any(String.class))).thenReturn(graphDto);
		
		mockMvc.perform(put("/graph/deleteValue/0")
				.contentType(MediaType.APPLICATION_JSON)
				.content("Body Weight Graph"))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value(1L))
				.andExpect(jsonPath("$.xAxisName").value("Dates"))
				.andExpect(jsonPath("$.yAxisName").value("Body Weight"))
				.andReturn();
	}
	
	@Test
	public void testDeleteValueInvalidRequestNoPathVariable() throws Exception {
		mockMvc.perform(put("/graph/deleteValue")
				.contentType(MediaType.APPLICATION_JSON)
				.content("body Weight Graph"))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
	
	@Test
	public void testDeleteValueInvalidRequestEmptyBody() throws Exception {
		mockMvc.perform(put("/graph/deleteValue/0")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
	
	@Test
	public void testDeleteGraphValidRequest() throws Exception {
		when(graphService.deleteGraph(any(Long.class))).thenReturn(graphDto);
		
		mockMvc.perform(delete("/graph/deleteGraph/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value(1L))
				.andExpect(jsonPath("$.xAxisName").value("Dates"))
				.andExpect(jsonPath("$.yAxisName").value("Body Weight"))
				.andReturn();
	}
	
	@Test
	public void testDeleteGraphInvalidRequestNoPathVariable() throws Exception {
		mockMvc.perform(delete("/graph/deleteGraph")
				.contentType(MediaType.APPLICATION_JSON)
				.content(""))
				.andExpect(status().isInternalServerError())
				.andReturn();
	}
}








