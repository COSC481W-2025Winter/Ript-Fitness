package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;

import jakarta.transaction.Transactional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    //Finds userProfile by ID (will not be able to find users that have isDeleted set to true)
    @Override
    @Query("SELECT u FROM UserProfile u WHERE u.id = :id AND u.isDeleted = false")
    Optional<UserProfile> findById(@Param("id") Long id);

    //Finds user by username
    @Query("SELECT u FROM UserProfile u WHERE u.username = :username AND u.isDeleted = false")
    Optional<UserProfile> findByUsername(@Param("username") String username);

    //sets isDeleted flag to true meaning it is "deleted"
    @Modifying
    @Transactional
    @Query("UPDATE UserProfile u SET u.isDeleted = true WHERE u.id = :id")
    void softDeleteById(@Param("id") Long id);

    //Inserts a new user profile record into the database
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO UserProfile (firstName, lastName, username, isDeleted) VALUES (:firstName, :lastName, :username, :isDeleted)", nativeQuery = true)
    void saveUserProfile(@Param("firstName") String firstName, 
                         @Param("lastName") String lastName, 
                         @Param("username") String username, 
                         @Param("isDeleted") boolean isDeleted);
}
