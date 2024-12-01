package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Calendar;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.CalendarRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.UserProfileRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.CalendarDto;

@Service
public class CalendarService {

    @Autowired
    private CalendarRepository calendarRepository;

    @Autowired
    private AccountsRepository accountsRepository;

    @Autowired
    private AccountsService accountsService;

    @Autowired
    private UserProfileRepository userProfileRepository;

    public void logWorkoutDay() { 
        LocalDate date = LocalDate.now(); 
        Long accountId = accountsService.getLoggedInUserId();

        AccountsModel account = accountsRepository.findById(accountId)
            .orElseThrow(() -> new IllegalStateException("Account not found with ID: " + accountId));

        Optional<Calendar> existingEntry = calendarRepository.findByAccountIdAndDate(accountId, date);
        if (existingEntry.isPresent()) {
            throw new IllegalStateException("Workout already logged for this date.");
        }

        // Retrieve the user's profile to update rest days
        UserProfile userProfile = userProfileRepository.findUserProfileByAccountId(accountId)
            .orElseThrow(() -> new IllegalStateException("User profile not found for account ID: " + accountId));

        if (LocalDate.now().isAfter(userProfile.getRestResetDate())) {
            LocalDate today = LocalDate.now();
            int todayDayOfWeek = today.getDayOfWeek().getValue();
            int daysUntilSunday = 7 - todayDayOfWeek;

            userProfile.setRestResetDate(today.plusDays(daysUntilSunday));
            userProfile.setRestDaysLeft(userProfile.getRestDays());
        }

        Calendar workoutEntry = new Calendar(account, date, 1); // Activity type 1 for workout
        calendarRepository.save(workoutEntry);
    }

    public void logRestDay() { 
        LocalDate date = LocalDate.now();
        Long accountId = accountsService.getLoggedInUserId();

        AccountsModel account = accountsRepository.findById(accountId)
            .orElseThrow(() -> new IllegalStateException("Account not found with ID: " + accountId));

        // Retrieve the user's profile to update rest days
        UserProfile userProfile = userProfileRepository.findUserProfileByAccountId(accountId)
            .orElseThrow(() -> new IllegalStateException("User profile not found for account ID: " + accountId));

        // Check if a rest day is already logged for the given date
        Optional<Calendar> existingEntry = calendarRepository.findByAccountIdAndDate(accountId, date);
        if (existingEntry.isPresent()) {
            throw new IllegalStateException("Rest day already logged for this date.");
        }

        if (LocalDate.now().isAfter(userProfile.getRestResetDate())) {
            LocalDate today = LocalDate.now();
            int todayDayOfWeek = today.getDayOfWeek().getValue();
            int daysUntilSunday = 7 - todayDayOfWeek;

            userProfile.setRestResetDate(today.plusDays(daysUntilSunday));
            userProfile.setRestDaysLeft(userProfile.getRestDays());
        }

        // Check if there are remaining rest days
        if (userProfile.getRestDaysLeft() > 0) {
            userProfile.setRestDaysLeft(userProfile.getRestDaysLeft() - 1);
        } else {
            throw new IllegalStateException("No rest days left for this week.");
        }

        // Save the updated user profile
        userProfileRepository.save(userProfile);

        // Log the rest day in the calendar
        Calendar restDayEntry = new Calendar(account, date, 2); // Activity type 2 for rest day
        calendarRepository.save(restDayEntry);
    }

    public List<CalendarDto> getMonth(LocalDate startDate, LocalDate endDate) {
        Long accountId = accountsService.getLoggedInUserId();
        List<Calendar> entries = calendarRepository.findByAccountIdAndDateBetween(accountId, startDate, endDate);
        return entries.stream()
                      .map(calendar -> new CalendarDto(calendar.getDate(), calendar.getActivityType()))
                      .collect(Collectors.toList());
    }
}
