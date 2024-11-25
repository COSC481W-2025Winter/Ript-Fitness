package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByUserProfile_Id(Long userProfileId);
}
