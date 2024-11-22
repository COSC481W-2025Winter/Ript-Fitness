package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Calendar;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.CalendarRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.UserProfileRepository;

@Service
public class CalendarService {

    @Autowired
    private CalendarRepository calendarRepository;

    @Autowired
    private AccountsRepository accountsRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private AccountsService accountsService; // To get the logged-in user's ID

    public void logWorkoutDay(LocalDate date) {
        Long accountId = accountsService.getLoggedInUserId();

        // Fetch the account
        AccountsModel account = accountsRepository.findById(accountId)
            .orElseThrow(() -> new IllegalStateException("Account not found with ID: " + accountId));

        // Check if an entry already exists
        Calendar existingEntry = calendarRepository.findByAccountIdAndDate(accountId, date);
        if (existingEntry != null) {
            throw new IllegalStateException("Workout already logged for this date.");
        }

        // Add a workout entry
        Calendar workoutEntry = new Calendar(
            account,
            date,
            1, // Activity Type: Workout
            1  // Color Code: Green
        );
        calendarRepository.save(workoutEntry);
    }

    public void logRestDay(LocalDate date) {
        Long accountId = accountsService.getLoggedInUserId();

        // Fetch the user profile
        UserProfile userProfile = userProfileRepository.findUserProfileByAccountId(accountId)
            .orElseThrow(() -> new IllegalStateException("User profile not found for account ID: " + accountId));

        // Check/reset weekly rest days
        if (userProfile.getRestResetDate() == null || userProfile.getRestResetDate().isBefore(LocalDate.now())) {
            userProfile.setRestDaysLeft(userProfile.getAllowedRestDaysPerWeek());
            userProfile.setRestResetDate(LocalDate.now().with(TemporalAdjusters.nextOrSame(userProfile.getRestResetDayOfWeek())));
        }

        if (userProfile.getRestDaysLeft() <= 0) {
            throw new IllegalStateException("No rest days remaining for this week.");
        }

        userProfile.setRestDaysLeft(userProfile.getRestDaysLeft() - 1);

        // Add a rest day entry
        Calendar restDayEntry = new Calendar(
            accountsRepository.findById(accountId)
                .orElseThrow(() -> new IllegalStateException("Account not found with ID: " + accountId)),
            date,
            2, // Activity Type: Rest
            2  // Color Code: Yellow
        );
        calendarRepository.save(restDayEntry);
    }

    public List<Calendar> getMonth(LocalDate startDate, LocalDate endDate) {
        Long accountId = accountsService.getLoggedInUserId();
        return calendarRepository.findByAccountIdAndDateBetween(accountId, startDate, endDate);
    }
}
