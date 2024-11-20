package com.example.repositories;

import com.example.models.CalendarModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Long> {

    // Find all calendar entries for a user
    List<Calendar> findByUserId(Long userId);

    // Find a specific entry by user and date
    Optional<Calendar> findByUserIdAndDate(Long userId, LocalDate date);
}
