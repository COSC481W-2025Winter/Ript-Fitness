package com.riptFitness.Ript_Fitness_Backend.web.controllerTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.AccountsService;
import com.riptFitness.Ript_Fitness_Backend.web.controller.AccountsController;
import com.riptFitness.Ript_Fitness_Backend.web.dto.AccountsDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.LoginRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


//... (imports and annotations remain the same)

@WebMvcTest(AccountsController.class)
public class AccountsControllerTest {
	
	

 @Autowired
 private MockMvc mockMvc;

 @MockBean
 private AccountsService accountsService;

 private ObjectMapper objectMapper;

 private AccountsDto accountsDto;

 @BeforeEach
 public void setUp() {
     // Initialize ObjectMapper first
     objectMapper = new ObjectMapper();

     // Register JavaTimeModule and configure serialization settings
     objectMapper.registerModule(new JavaTimeModule());
     objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

     // Set up test data
     accountsDto = new AccountsDto();
     accountsDto.setUsername("testUser");
     accountsDto.setPassword("password123");
     accountsDto.setEmail("test@example.com");
     accountsDto.setlastLogin(LocalDateTime.now());
 }


 // Test for createNewAccount - successful account creation
 @Test
 public void testCreateNewAccount_Success() throws Exception {
     // Mocking
     when(accountsService.createNewAccount(any(AccountsDto.class))).thenReturn(accountsDto);

     // Execute and Verify
     mockMvc.perform(post("/accounts/createNewAccount")
             .contentType(MediaType.APPLICATION_JSON)
             .content(objectMapper.writeValueAsString(accountsDto)))
             .andExpect(status().isCreated())
             .andExpect(jsonPath("$.username").value("testUser"))
             .andExpect(jsonPath("$.email").value("test@example.com"));
 }

 // Test for createNewAccount - username already exists
 @Test
 public void testCreateNewAccount_UsernameExists() throws Exception {
     // Mocking
     when(accountsService.createNewAccount(any(AccountsDto.class)))
             .thenThrow(new RuntimeException("The username: 'testUser' already has an account associated with it"));

     // Execute and Verify
     mockMvc.perform(post("/accounts/createNewAccount")
             .contentType(MediaType.APPLICATION_JSON)
             .content(objectMapper.writeValueAsString(accountsDto)))
             .andExpect(status().isInternalServerError())
             .andExpect(content().string("The username: 'testUser' already has an account associated with it"));
 }

 // Test for login - successful login
 @Test
 public void testLogin_Success() throws Exception {
     LoginRequestDto loginRequest = new LoginRequestDto();
     loginRequest.setUsername("testUser");
     loginRequest.setPassword("password123");
     loginRequest.setlastLogin(LocalDateTime.now());

     // Mocking
     when(accountsService.logIntoAccount(eq("testUser"), eq("password123"), any(LocalDateTime.class)))
             .thenReturn(accountsDto);

     // Execute and Verify
     mockMvc.perform(get("/accounts/login")
             .contentType(MediaType.APPLICATION_JSON)
             .content(objectMapper.writeValueAsString(loginRequest)))
             .andExpect(status().isOk())
             .andExpect(jsonPath("$.username").value("testUser"))
             .andExpect(jsonPath("$.email").value("test@example.com"));
 }

 // Test for login - incorrect password
 @Test
 public void testLogin_IncorrectPassword() throws Exception {
     LoginRequestDto loginRequest = new LoginRequestDto();
     loginRequest.setUsername("testUser");
     loginRequest.setPassword("wrongPassword");
     loginRequest.setlastLogin(LocalDateTime.now());

     // Mocking
     when(accountsService.logIntoAccount(eq("testUser"), eq("wrongPassword"), any(LocalDateTime.class)))
             .thenThrow(new RuntimeException("The password: 'wrongPassword' is incorrect"));

     // Execute and Verify
     mockMvc.perform(get("/accounts/login")
             .contentType(MediaType.APPLICATION_JSON)
             .content(objectMapper.writeValueAsString(loginRequest)))
             .andExpect(status().isInternalServerError())
             .andExpect(content().string("The password: 'wrongPassword' is incorrect"));
 }

 // Test for login - username does not exist
 @Test
 public void testLogin_UsernameDoesNotExist() throws Exception {
     LoginRequestDto loginRequest = new LoginRequestDto();
     loginRequest.setUsername("nonExistingUser");
     loginRequest.setPassword("password123");
     loginRequest.setlastLogin(LocalDateTime.now());

     // Mocking
     when(accountsService.logIntoAccount(eq("nonExistingUser"), eq("password123"), any(LocalDateTime.class)))
             .thenThrow(new RuntimeException("Account with username: 'nonExistingUser' does not exist..."));

     // Execute and Verify
     mockMvc.perform(get("/accounts/login")
             .contentType(MediaType.APPLICATION_JSON)
             .content(objectMapper.writeValueAsString(loginRequest)))
             .andExpect(status().isInternalServerError())
             .andExpect(content().string("Account with username: 'nonExistingUser' does not exist..."));
 }
}
