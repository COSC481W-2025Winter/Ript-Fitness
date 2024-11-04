package com.riptFitness.Ript_Fitness_Backend.domain.repository;

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
}
