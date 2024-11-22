package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Calendar;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.CalendarRepository;

@Service
public class CalendarService {

    @Autowired
    private CalendarRepository calendarRepository;

    @Autowired
    private AccountsRepository accountsRepository;

    @Autowired
    private AccountsService accountsService;

    public void logWorkoutDay(LocalDate date) {
        Long accountId = accountsService.getLoggedInUserId();

        AccountsModel account = accountsRepository.findById(accountId)
            .orElseThrow(() -> new IllegalStateException("Account not found with ID: " + accountId));

        Optional<Calendar> existingEntry = calendarRepository.findByAccountIdAndDate(accountId, date);
        if (existingEntry.isPresent()) {
            throw new IllegalStateException("Workout already logged for this date.");
        }

        Calendar workoutEntry = new Calendar(account, date, 1);
        calendarRepository.save(workoutEntry);
    }

    public void logRestDay(LocalDate date) {
        Long accountId = accountsService.getLoggedInUserId();

        AccountsModel account = accountsRepository.findById(accountId)
            .orElseThrow(() -> new IllegalStateException("Account not found with ID: " + accountId));

        Optional<Calendar> existingEntry = calendarRepository.findByAccountIdAndDate(accountId, date);
        if (existingEntry.isPresent()) {
            throw new IllegalStateException("Rest day already logged for this date.");
        }

        Calendar restDayEntry = new Calendar(account, date, 2);
        calendarRepository.save(restDayEntry);
    }

    public List<Calendar> getMonth(LocalDate startDate, LocalDate endDate) {
        Long accountId = accountsService.getLoggedInUserId();
        return calendarRepository.findByAccountIdAndDateBetween(accountId, startDate, endDate);
    }
}
