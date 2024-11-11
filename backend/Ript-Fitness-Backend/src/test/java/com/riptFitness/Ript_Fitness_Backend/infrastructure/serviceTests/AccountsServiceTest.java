package com.riptFitness.Ript_Fitness_Backend.infrastructure.serviceTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.AccountsMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.StreakRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.JwtUtil;
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
    private JwtUtil jwtUtil;

    @InjectMocks
    private AccountsService accountsService;

    private AccountsDto accountsDto;
    private AccountsModel accountsModel;

    @BeforeEach
    public void setUp() {
        // Initialize accountsDto for all tests
        accountsDto = new AccountsDto();
        accountsDto.setUsername("testUser");
        accountsDto.setPassword("password123");
        accountsDto.setEmail("test@example.com");
        accountsDto.setlastLogin(LocalDateTime.now());

        // Initialize accountsModel
        accountsModel = AccountsMapper.INSTANCE.convertToModel(accountsDto);
    }

    @Test
    public void testCreateNewAccount_Success() {
        // Mocking the encoded values for both the password and email
        String encodedPassword = "encodedPassword123";
        String encodedEmail = "encodedEmail123"; // Mocked encoded email
        String mockedToken = "mocked-jwt-token"; // Mocked JWT token

        // Username does not exist
        when(accountsRepository.existsByUsername(accountsDto.getUsername())).thenReturn(0L);

        // Mocking accountsRepository.findAllEncodedEmails()
        List<String> encodedEmails = new ArrayList<>(); // Empty list, no emails in use
        when(accountsRepository.findAllEncodedEmails()).thenReturn(encodedEmails);

        // Remove the unnecessary stubbing of passwordEncoder.matches(...)
        // when(passwordEncoder.matches(eq("test@example.com"), anyString())).thenReturn(false);

        // Adjust stubbing to match actual method calls
        when(passwordEncoder.encode("password123")).thenReturn(encodedPassword);
        when(passwordEncoder.encode("test@example.com")).thenReturn(encodedEmail);

        // Mock the JWT token generation
        when(jwtUtil.generateToken(accountsDto.getUsername())).thenReturn(mockedToken);

        // Execute the method under test
        String token = accountsService.createNewAccount(accountsDto);

        // Verify the result
        assertNotNull(token);
        assertEquals(mockedToken, token); // Verify that the correct token is returned

        // Verify that save was called
        verify(accountsRepository).save(any(AccountsModel.class));
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

    // Test for createNewAccount when email already exists
    @Test
    public void testCreateNewAccount_EmailExists() {
        // Username does not exist
        when(accountsRepository.existsByUsername(accountsDto.getUsername())).thenReturn(0L);

        // Mocking accountsRepository.findAllEncodedEmails()
        String encodedEmail = "encodedEmail123"; // Mocked encoded email
        List<String> encodedEmails = Arrays.asList(encodedEmail); // Contains the encoded email
        when(accountsRepository.findAllEncodedEmails()).thenReturn(encodedEmails);

        // Mock passwordEncoder.matches to return true when matching the email
        when(passwordEncoder.matches("test@example.com", encodedEmail)).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            accountsService.createNewAccount(accountsDto);
        });

        assertEquals("Email is already taken.", exception.getMessage());
        verify(accountsRepository, never()).save(any(AccountsModel.class));
    }

    @Test
    public void testChangePassword() {
        // Mock input data
        String currentPassword = "password123";
        String newPassword = "newPassword123";
        String samePassword = "password123";  // Same as current password

        // Mock the accounts model
        AccountsModel accountsModel = new AccountsModel();
        accountsModel.setId(1L);
        accountsModel.setUsername("testUser");
        accountsModel.setPassword("encodedPassword123");

        // Set up the SecurityContext with a mock Authentication
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("testUser");
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, new ArrayList<>());
        SecurityContextHolder.setContext(SecurityContextHolder.createEmptyContext());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        try {
            // Test Case 1: Valid password change
            // Mock dependencies
            when(accountsRepository.findByUsername("testUser")).thenReturn(Optional.of(accountsModel));
            when(accountsRepository.findById(1L)).thenReturn(Optional.of(accountsModel));
            when(passwordEncoder.matches(currentPassword, "encodedPassword123")).thenReturn(true);
            when(passwordEncoder.encode(newPassword)).thenReturn("encodedNewPassword123");
            when(jwtUtil.generateToken(accountsModel.getUsername())).thenReturn("mocked-jwt-token");

            String token = accountsService.changePassword(currentPassword, newPassword);
            assertNotNull(token);
            assertEquals("mocked-jwt-token", token);
            verify(accountsRepository).save(accountsModel);

            // Reset interactions and data for the next test case
            reset(accountsRepository, passwordEncoder, jwtUtil);
            accountsModel.setPassword("encodedPassword123"); // Reset password

            // Test Case 2: Incorrect current password
            // Mock dependencies
            when(accountsRepository.findByUsername("testUser")).thenReturn(Optional.of(accountsModel));
            when(accountsRepository.findById(1L)).thenReturn(Optional.of(accountsModel));
            when(passwordEncoder.matches(currentPassword, "encodedPassword123")).thenReturn(false);

            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                accountsService.changePassword(currentPassword, newPassword);
            });
            assertEquals("Current password does not match", exception.getMessage());
            verify(accountsRepository, never()).save(any(AccountsModel.class));

            // Reset interactions and data for the next test case
            reset(accountsRepository, passwordEncoder);
            accountsModel.setPassword("encodedPassword123"); // Reset password

            // Test Case 3: New password same as current password
            // Mock dependencies
            when(accountsRepository.findByUsername("testUser")).thenReturn(Optional.of(accountsModel));
            when(accountsRepository.findById(1L)).thenReturn(Optional.of(accountsModel));
            when(passwordEncoder.matches(samePassword, "encodedPassword123")).thenReturn(true);

            RuntimeException exception2 = assertThrows(RuntimeException.class, () -> {
                accountsService.changePassword(samePassword, samePassword);
            });
            assertEquals("New password cannot be the same as the current password", exception2.getMessage());
            verify(accountsRepository, never()).save(any(AccountsModel.class));
        } finally {
            SecurityContextHolder.clearContext();
        }
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
        existingAccount.setPassword("encodedPassword123");
        existingAccount.setEmail("test@example.com");

        when(accountsRepository.findIdByUsername(username)).thenReturn(Optional.of(id));
        when(accountsRepository.findById(id)).thenReturn(Optional.of(existingAccount));
        when(passwordEncoder.matches(password, "encodedPassword123")).thenReturn(false);

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
