package com.example.controllers;

import com.example.models.CalendarModel;
import com.example.services.CalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/calendar")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    // Get the user's calendar
    @GetMapping
    public List<CalendarModel> getCalendar(@RequestParam Long userId) {
        return calendarService.getCalendar(userId);
    }

    // Log a workout
    @PostMapping("/logWorkout")
    public void logWorkout(@RequestParam Long userId, @RequestParam String date) {
        calendarService.logWorkout(userId, LocalDate.parse(date));
    }

    // Log a rest day
    @PostMapping("/logRestDay")
    public void logRestDay(@RequestParam Long userId, @RequestParam String date) {
        calendarService.logRestDay(userId, LocalDate.parse(date));
    }
}
