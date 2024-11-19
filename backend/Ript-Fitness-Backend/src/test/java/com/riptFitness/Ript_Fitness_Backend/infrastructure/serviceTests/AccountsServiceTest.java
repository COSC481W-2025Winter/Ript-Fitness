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
import com.riptFitness.Ript_Fitness_Backend.domain.repository.UserProfileRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.config.JwtUtil;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.AccountsService;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.UserProfileService;
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

    @Mock
    private UserProfileService userProfileService;

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private AccountsService accountsService;

    private AccountsDto accountsDto;
    private AccountsModel accountsModel;

    @BeforeEach
    public void setUp() {
        // Mock repositories and services
        accountsRepository = mock(AccountsRepository.class);
        streakRepository = mock(StreakRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtUtil = mock(JwtUtil.class);
        userProfileService = mock(UserProfileService.class);
        userProfileRepository = mock(UserProfileRepository.class);

        // Inject mocks into AccountsService
        accountsService = new AccountsService(
            accountsRepository,
            streakRepository,
            passwordEncoder,
            jwtUtil,
            userProfileService,
            userProfileRepository
        );

        // Initialize AccountsDto
        accountsDto = new AccountsDto();
        accountsDto.setUsername("testUser");
        accountsDto.setPassword("password123");
        accountsDto.setEmail("test@example.com");
        accountsDto.setlastLogin(LocalDateTime.now());

        // Initialize AccountsModel
        accountsModel = AccountsMapper.INSTANCE.convertToModel(accountsDto);
    }

    @Test
    public void testCreateNewAccount_Success() {
        String encodedPassword = "encodedPassword123";
        String encodedEmail = "encodedEmail123";
        String mockedToken = "mocked-jwt-token";

        when(accountsRepository.existsByUsername(accountsDto.getUsername())).thenReturn(0L);
        when(accountsRepository.findAllEncodedEmails()).thenReturn(Collections.emptyList());
        when(passwordEncoder.encode("password123")).thenReturn(encodedPassword);
        when(passwordEncoder.encode("test@example.com")).thenReturn(encodedEmail);
        when(jwtUtil.generateToken(accountsDto.getUsername())).thenReturn(mockedToken);

        String token = accountsService.createNewAccount(accountsDto);

        assertNotNull(token);
        assertEquals(mockedToken, token);
        verify(accountsRepository).save(any(AccountsModel.class));
    }

    @Test
    public void testCreateNewAccount_UsernameExists() {
        when(accountsRepository.existsByUsername(accountsDto.getUsername())).thenReturn(1L);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            accountsService.createNewAccount(accountsDto);
        });

        assertEquals("Username is already taken.", exception.getMessage());
        verify(accountsRepository, never()).save(any(AccountsModel.class));
    }

    @Test
    public void testCreateNewAccount_EmailExists() {
        String encodedEmail = "encodedEmail123";
        List<String> encodedEmails = Arrays.asList(encodedEmail);

        when(accountsRepository.existsByUsername(accountsDto.getUsername())).thenReturn(0L);
        when(accountsRepository.findAllEncodedEmails()).thenReturn(encodedEmails);
        when(passwordEncoder.matches("test@example.com", encodedEmail)).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            accountsService.createNewAccount(accountsDto);
        });

        assertEquals("Email is already taken.", exception.getMessage());
        verify(accountsRepository, never()).save(any(AccountsModel.class));
    }

    @Test
    public void testChangePassword() {
        String currentPassword = "password123";
        String newPassword = "newPassword123";

        AccountsModel accountsModel = new AccountsModel();
        accountsModel.setId(1L);
        accountsModel.setUsername("testUser");
        accountsModel.setPassword("encodedPassword123");

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("testUser");
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, new ArrayList<>());
        SecurityContextHolder.setContext(SecurityContextHolder.createEmptyContext());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        try {
            when(accountsRepository.findByUsername("testUser")).thenReturn(Optional.of(accountsModel));
            when(accountsRepository.findById(1L)).thenReturn(Optional.of(accountsModel));
            when(passwordEncoder.matches(currentPassword, "encodedPassword123")).thenReturn(true);
            when(passwordEncoder.encode(newPassword)).thenReturn("encodedNewPassword123");
            when(jwtUtil.generateToken(accountsModel.getUsername())).thenReturn("mocked-jwt-token");

            String token = accountsService.changePassword(currentPassword, newPassword);

            assertNotNull(token);
            assertEquals("mocked-jwt-token", token);
            verify(accountsRepository).save(accountsModel);
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
        existingAccount.setPassword("encodedPassword123");

        when(accountsRepository.findIdByUsername(username)).thenReturn(Optional.of(id));
        when(accountsRepository.findById(id)).thenReturn(Optional.of(existingAccount));
        when(passwordEncoder.matches(password, "encodedPassword123")).thenReturn(true);
        when(jwtUtil.generateToken(username)).thenReturn("mocked-jwt-token");

        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername(username);
        loginRequest.setPassword(password);
        loginRequest.setlastLogin(lastLogin);

        String token = accountsService.logIntoAccount(loginRequest);

        assertNotNull(token);
        assertEquals("mocked-jwt-token", token);
        verify(accountsRepository).updateLoginDate(username, lastLogin);
    }
}