package com.example.services;

import com.example.models.CalendarModel;
import com.example.repositories.CalendarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CalendarService {

    @Autowired
    private CalendarRepository calendarRepository;

    // Get calendar for a user
    public List<CalendarModel> getCalendar(Long userId) {
        return calendarRepository.findByUserId(userId);
    }

    // Log a workout
    public void logWorkout(Long userId, LocalDate date) {
        updateOrCreateCalendarEntry(userId, date, "workout", "green");
    }

    // Log a rest day
    public void logRestDay(Long userId, LocalDate date) {
        updateOrCreateCalendarEntry(userId, date, "rest", "yellow");
    }

    // Private helper method to handle updates/creates
    private void updateOrCreateCalendarEntry(Long userId, LocalDate date, String activityType, String colorCode) {
        Optional<CalendarModel> existingEntry = calendarRepository.findByUserIdAndDate(userId, date);
        CalendarModel entry = existingEntry.orElse(new CalendarModel(userId, date, activityType, colorCode));
        entry.setActivityType(activityType);
        entry.setColorCode(colorCode);
        calendarRepository.save(entry);
    }
}
