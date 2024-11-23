package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.transaction.Transactional;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    // Finds user by username
    @Query("SELECT u FROM UserProfile u WHERE u.username = :username AND u.isDeleted = false")
    Optional<UserProfile> findByUsername(@Param("username") String username);

    // Soft deletes a user by username
    @Modifying
    @Transactional
    @Query("UPDATE UserProfile u SET u.isDeleted = true WHERE u.username = :username")
    void softDeleteByUsername(@Param("username") String username);
    
    // Retrieves user profile by accountId (Account associated with User)
    @Query("SELECT u FROM UserProfile u WHERE u.account.id = :id AND u.isDeleted = false")
    Optional<UserProfile> findUserProfileByAccountId(@Param("id") Long id);

    // Updates the restDays for a user profile (Maximum number of rest days per week)
    @Modifying
    @Transactional
    @Query("UPDATE UserProfile u SET u.restDays = :restDays WHERE u.username = :username")
    void updateRestDaysByUsername(@Param("username") String username, @Param("restDays") Integer restDays); // Updated to Integer for nullability

    // Retrieves the restDays for a user profile (Maximum number of rest days per week)
    @Query("SELECT u.restDays FROM UserProfile u WHERE u.username = :username AND u.isDeleted = false")
    Optional<Integer> findRestDaysByUsername(@Param("username") String username);

    // Updates the restDaysLeft for a user profile (Remaining rest days for the current week)
    @Modifying
    @Transactional
    @Query("UPDATE UserProfile u SET u.restDaysLeft = :restDaysLeft WHERE u.username = :username")
    void updateRestDaysLeftByUsername(@Param("username") String username, @Param("restDaysLeft") Integer restDaysLeft); // Updated to Integer for nullability

    // Retrieves the restDaysLeft for a user profile (Remaining rest days for the current week)
    @Query("SELECT u.restDaysLeft FROM UserProfile u WHERE u.username = :username AND u.isDeleted = false")
    Optional<Integer> findRestDaysLeftByUsername(@Param("username") String username);

    // Updates the restResetDate for a user profile (When the rest days reset)
    @Modifying
    @Transactional
    @Query("UPDATE UserProfile u SET u.restResetDate = :restResetDate WHERE u.username = :username")
    void updateRestResetDateByUsername(@Param("username") String username, @Param("restResetDate") LocalDate restResetDate);

    // Retrieves the restResetDate for a user profile (Date when rest days reset)
    @Query("SELECT u.restResetDate FROM UserProfile u WHERE u.username = :username AND u.isDeleted = false")
    Optional<LocalDate> findRestResetDateByUsername(@Param("username") String username);

    // Updates the restResetDayOfWeek for a user profile (Day of the week when rest resets)
    @Modifying
    @Transactional
    @Query("UPDATE UserProfile u SET u.restResetDayOfWeek = :restResetDayOfWeek WHERE u.username = :username")
    void updateRestResetDayOfWeekByUsername(@Param("username") String username, @Param("restResetDayOfWeek") Integer restResetDayOfWeek);

    // Retrieves the restResetDayOfWeek for a user profile (Day of the week when rest resets)
    @Query("SELECT u.restResetDayOfWeek FROM UserProfile u WHERE u.username = :username AND u.isDeleted = false")
    Optional<Integer> findRestResetDayOfWeekByUsername(@Param("username") String username);
    
    @Query("SELECT u FROM UserProfile u WHERE u.username IN :usernames AND u.isDeleted = false")
    List<UserProfile> findAllByUsernames(@Param("usernames") List<String> usernames);

}
