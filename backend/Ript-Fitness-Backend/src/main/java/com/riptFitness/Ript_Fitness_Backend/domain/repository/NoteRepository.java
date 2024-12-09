package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Note;

public interface NoteRepository extends JpaRepository <Note, Long>{

	//  Given an account ID, return all note(s) that are associated with that user ID.
	@Query("SELECT n FROM Note n WHERE n.account.id = :accountId AND n.isDeleted = false order by updatedAt desc")
	List<Note> findByAccountIdAndNotDeleted(@Param("accountId") Long accountId);

	
	// Given a noteId and a currentUserId, return a single Note 
	@Query("SELECT n FROM Note n WHERE n.noteId = :noteId AND n.account.id = :currentUserId")
	Optional<Note> findByLoggedInIdAndNoteId(@Param("noteId") Long noteId, @Param("currentUserId") Long currentUserId);

	
}
