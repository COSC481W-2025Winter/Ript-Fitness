package com.riptFitness.Ript_Fitness_Backend.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Calendar;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.CalendarService;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@RestController
@RequestMapping("/calendar")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    @PostMapping("/logWorkout")
    public void logWorkout(@RequestParam String date) {
        calendarService.logWorkoutDay(LocalDate.parse(date));
    }

    @PostMapping("/logRestDay")
    public void logRestDay(@RequestParam String date) {
        calendarService.logRestDay(LocalDate.parse(date));
    }

    @GetMapping("/getMonth")
    public List<Calendar> getMonth(@RequestParam String startYear, @RequestParam String startMonth, @RequestParam String endYear, @RequestParam String endMonth) {
        LocalDate startDate = LocalDate.of(Integer.parseInt(startYear), Integer.parseInt(startMonth), 1);
        LocalDate endDate = LocalDate.of(Integer.parseInt(endYear), Integer.parseInt(endMonth), 1)
                                     .with(TemporalAdjusters.lastDayOfMonth());
        return calendarService.getMonth(startDate, endDate);
    }
}
