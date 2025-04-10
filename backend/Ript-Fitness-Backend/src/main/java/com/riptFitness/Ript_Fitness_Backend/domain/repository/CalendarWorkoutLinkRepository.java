package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.time.LocalDate;
import java.util.List;

import com.riptFitness.Ript_Fitness_Backend.domain.model.CalendarWorkoutLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Calendar;
import com.riptFitness.Ript_Fitness_Backend.domain.model.Workouts;

public interface CalendarWorkoutLinkRepository extends JpaRepository<CalendarWorkoutLink, Long> {

    List<CalendarWorkoutLink> findByCalendarEntry(Calendar calendarEntry);

    @Query(""" 
SELECT w FROM CalendarWorkoutLink l JOIN l.calendarEntry ce JOIN l.workout w WHERE ce.account.id = :accountId AND FUNCTION('DATE', ce.date) = :logDate AND w.isDeleted = false
    """)
    List<Workouts> findWorkoutsByAccountAndDate(@Param("accountId") Long accountId,
                                                @Param("logDate") LocalDate logDate);
}
