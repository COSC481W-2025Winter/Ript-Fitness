package com.riptFitness.Ript_Fitness_Backend.domain.mapper;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Calendar;
import com.riptFitness.Ript_Fitness_Backend.web.dto.CalendarDto;

import java.util.List;
import java.util.stream.Collectors;

public class CalendarMapper {

    public static CalendarDto toDto(Calendar calendar) {
        return new CalendarDto(
                calendar.getDate(),
                calendar.getActivityType()
        );
    }

    public static List<CalendarDto> toDtoList(List<Calendar> calendarEntries) {
        return calendarEntries.stream()
                .map(CalendarMapper::toDto)
                .collect(Collectors.toList());
    }
}
