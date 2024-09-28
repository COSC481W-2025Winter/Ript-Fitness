package com.riptFitness.Ript_Fitness_Backend.infastructure.serviceTests;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.AccountsMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.AccountsService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.AccountsDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AccountsServiceTest {

    @Mock
    private AccountsRepository accountsRepository;

    @InjectMocks
    private AccountsService accountsService;

    private AccountsMapper accountsMapper = AccountsMapper.INSTANCE;

    private AccountsDto accountsDto;
    private AccountsModel accountsModel;

    @BeforeEach
    public void setUp() {
        // Initialize test data
        accountsDto = new AccountsDto();
        accountsDto.setUsername("testUser");
        accountsDto.setPassword("password123");
        accountsDto.setEmail("test@example.com");
        accountsDto.setlastLogin(LocalDateTime.now());

        accountsModel = accountsMapper.convertToModel(accountsDto);
    }

    // Test for createNewAccount when username does not exist
    @Test
    public void testCreateNewAccount_Success() {
        // Mocking
        when(accountsRepository.existsByUsername(accountsDto.getUsername())).thenReturn(false);
        when(accountsRepository.save(any(AccountsModel.class))).thenReturn(accountsModel);

        // Execute
        AccountsDto result = accountsService.createNewAccount(accountsDto);

        // Verify
        assertNotNull(result);
        assertEquals(accountsDto.getUsername(), result.getUsername());

        // Capture the argument passed to save method
        ArgumentCaptor<AccountsModel> accountCaptor = ArgumentCaptor.forClass(AccountsModel.class);
        verify(accountsRepository).save(accountCaptor.capture());
        AccountsModel savedAccount = accountCaptor.getValue();

        assertEquals(accountsDto.getUsername(), savedAccount.getUsername());
        assertEquals(accountsDto.getPassword(), savedAccount.getPassword());
        assertEquals(accountsDto.getEmail(), savedAccount.getEmail());
    }

    // Test for createNewAccount when username already exists
    @Test
    public void testCreateNewAccount_UsernameExists() {
        // Mocking
        when(accountsRepository.existsByUsername(accountsDto.getUsername())).thenReturn(true);

        // Execute and Verify
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            accountsService.createNewAccount(accountsDto);
        });

        assertEquals("The username: 'testUser' already has an account associated with it", exception.getMessage());
        verify(accountsRepository, never()).save(any(AccountsModel.class));
    }

    // Test for logIntoAccount with successful login
    @Test
    public void testLogIntoAccount_Success() {
        String username = "testUser";
        String password = "password123";
        LocalDateTime lastLogin = LocalDateTime.now();
        Long id = 1L;

        AccountsModel existingAccount = new AccountsModel();
        existingAccount.setId(id);
        existingAccount.setUsername(username);
        existingAccount.setPassword(password);
        existingAccount.setEmail("test@example.com");

        // Mocking
        when(accountsRepository.findIdByUsername(username)).thenReturn(Optional.of(id));
        when(accountsRepository.findById(id)).thenReturn(Optional.of(existingAccount));

        // Execute
        AccountsDto result = accountsService.logIntoAccount(username, password, lastLogin);

        // Verify
        assertNotNull(result);
        assertEquals(username, result.getUsername());

        verify(accountsRepository).updateLoginDate(username, lastLogin);
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

        // Mocking
        when(accountsRepository.findIdByUsername(username)).thenReturn(Optional.of(id));
        when(accountsRepository.findById(id)).thenReturn(Optional.of(existingAccount));

        // Execute and Verify
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            accountsService.logIntoAccount(username, password, lastLogin);
        });

        assertEquals("An unexpected error has occured. Message: The password: 'wrongPassword' is incorrect", exception.getMessage());
        verify(accountsRepository, never()).updateLoginDate(anyString(), any(LocalDateTime.class));
    }

    // Test for logIntoAccount with non-existing username
    @Test
    public void testLogIntoAccount_UsernameDoesNotExist() {
        String username = "nonExistingUser";
        String password = "password123";
        LocalDateTime lastLogin = LocalDateTime.now();

        // Mocking
        when(accountsRepository.findIdByUsername(username)).thenReturn(Optional.empty());

        // Execute and Verify
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            accountsService.logIntoAccount(username, password, lastLogin);
        });

        assertEquals("Account with username: 'nonExistingUser' does not exist...", exception.getMessage());
        verify(accountsRepository, never()).updateLoginDate(anyString(), any(LocalDateTime.class));
    }
}
