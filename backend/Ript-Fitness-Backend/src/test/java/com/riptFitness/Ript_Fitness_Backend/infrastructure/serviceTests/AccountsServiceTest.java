package com.riptFitness.Ript_Fitness_Backend.infastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.riptFitness.Ript_Fitness_Backend.config.JwtUtil;
import com.riptFitness.Ript_Fitness_Backend.domain.mapper.AccountsMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.StreakRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.AccountsService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.AccountsDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.LoginRequestDto;

@ExtendWith(MockitoExtension.class)
public class AccountsServiceTest {

    @Mock
    private AccountsRepository accountsRepository;

    @Mock
    private StreakRepository streakRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil; // Ensure JwtUtil is properly mocked

    @InjectMocks
    private AccountsService accountsService;

    private AccountsMapper accountsMapper = AccountsMapper.INSTANCE;

    private AccountsDto accountsDto;
    private AccountsModel accountsModel;

    @BeforeEach
    public void setUp() {
        // Initialize test data
        jwtUtil = mock(JwtUtil.class);
        accountsRepository = mock(AccountsRepository.class);
        streakRepository = mock(StreakRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);

        accountsService = new AccountsService(accountsRepository, streakRepository, passwordEncoder, jwtUtil);

        // Initialize accountsDto for all tests
        accountsDto = new AccountsDto();
        accountsDto.setUsername("testUser");
        accountsDto.setPassword("password123");
        accountsDto.setEmail("test@example.com");
        accountsDto.setlastLogin(LocalDateTime.now());

        // Initialize accountsModel
        accountsModel = AccountsMapper.INSTANCE.convertToModel(accountsDto);
    }



    // Test for createNewAccount when username does not exist
    @Test
    public void testCreateNewAccount_Success() {
        // Mocking the encoded values for both the password and email
        String encodedPassword = "encodedPassword123";
        String encodedEmail = "encodedEmail123"; // Mocked encoded email
        String mockedToken = "mocked-jwt-token"; // Mocked JWT token

        // Mock the behavior of passwordEncoder for both the password and email
        when(passwordEncoder.encode("password123")).thenReturn(encodedPassword);
        when(passwordEncoder.encode("test@example.com")).thenReturn(encodedEmail);

        // Mocking the save method to return the model with the encoded values
        AccountsModel accountsModel = new AccountsModel();
        accountsModel.setUsername("testUser");
        accountsModel.setPassword(encodedPassword); // Use the mocked encoded password
        accountsModel.setEmail(encodedEmail);       // Use the mocked encoded email
        accountsModel.setlastLogin(LocalDateTime.now());

        when(accountsRepository.existsByUsername(accountsDto.getUsername())).thenReturn((long) 0);
        when(accountsRepository.save(any(AccountsModel.class))).thenReturn(accountsModel);

        // Mock the JWT token generation
        when(jwtUtil.generateToken(accountsModel.getUsername())).thenReturn(mockedToken);

        // Execute the method under test
        String token = accountsService.createNewAccount(accountsDto);

        // Verify the result
        assertNotNull(token);
        assertEquals(mockedToken, token); // Verify that the correct token is returned
    }

    @Test
    public void testLogIntoAccount_Success() {
        String username = "testUser";
        String password = "password123";
        LocalDateTime lastLogin = LocalDateTime.now();
        Long id = 1L;

        AccountsModel existingAccount = new AccountsModel();
        existingAccount.setId(id);
        existingAccount.setUsername(username);
        existingAccount.setPassword("encodedPassword123"); // Assume this is the encoded password
        existingAccount.setEmail("test@example.com");

        // Mocking
        when(accountsRepository.findIdByUsername(username)).thenReturn(Optional.of(id));
        when(accountsRepository.findById(id)).thenReturn(Optional.of(existingAccount));
        when(passwordEncoder.matches(password, "encodedPassword123")).thenReturn(true); // Mock password comparison
        when(jwtUtil.generateToken(username)).thenReturn("mocked-jwt-token"); // Mock the token generation

        // Execute
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername(username);
        loginRequest.setPassword(password);
        loginRequest.setlastLogin(lastLogin);
        String token = accountsService.logIntoAccount(loginRequest); // Now it returns a token (String)

        // Verify the returned token
        assertNotNull(token);
        assertEquals("mocked-jwt-token", token); // Verify the token is the mocked one

        // Verify the repository calls
        verify(accountsRepository).updateLoginDate(username, lastLogin);
        verify(accountsRepository).findIdByUsername(username);
        verify(accountsRepository).findById(id);
        verify(passwordEncoder).matches(password, "encodedPassword123");
    }

    // Test for createNewAccount when username already exists
    @Test
    public void testCreateNewAccount_UsernameExists() {
        when(accountsRepository.existsByUsername(accountsDto.getUsername())).thenReturn(1L);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            accountsService.createNewAccount(accountsDto);
        });

        assertEquals("Username is already taken.", exception.getMessage());
        verify(accountsRepository, never()).save(any(AccountsModel.class));
    }

    // Test for logIntoAccount with incorrect password
    @Test
    public void testLogIntoAccount_IncorrectPassword() {
        String username = "testUser";
        String password = "wrongPassword";
        LocalDateTime lastLogin = LocalDateTime.now();
        Long id = 1L;

        AccountsModel existingAccount = new AccountsModel();
        existingAccount.setId(id);
        existingAccount.setUsername(username);
        existingAccount.setPassword("password123");
        existingAccount.setEmail("test@example.com");

        when(accountsRepository.findIdByUsername(username)).thenReturn(Optional.of(id));
        when(accountsRepository.findById(id)).thenReturn(Optional.of(existingAccount));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            LoginRequestDto loginRequest = new LoginRequestDto();
            loginRequest.setUsername(username);
            loginRequest.setPassword(password);
            loginRequest.setlastLogin(lastLogin);
            accountsService.logIntoAccount(loginRequest);
        });

        assertEquals("Incorrect password.", exception.getMessage());
        verify(accountsRepository, never()).updateLoginDate(anyString(), any(LocalDateTime.class));
    }

    // Test for logIntoAccount with non-existing username
    @Test
    public void testLogIntoAccount_UsernameDoesNotExist() {
        String username = "nonExistingUser";
        String password = "password123";
        LocalDateTime lastLogin = LocalDateTime.now();

        when(accountsRepository.findIdByUsername(username)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            LoginRequestDto loginRequest = new LoginRequestDto();
            loginRequest.setUsername(username);
            loginRequest.setPassword(password);
            loginRequest.setlastLogin(lastLogin);
            accountsService.logIntoAccount(loginRequest);
        });

        assertEquals("Username does not exist.", exception.getMessage());
        verify(accountsRepository, never()).updateLoginDate(anyString(), any(LocalDateTime.class));
    }
}
