package com.riptFitness.Ript_Fitness_Backend.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.riptFitness.Ript_Fitness_Backend.domain.model.Note;

public interface NoteRepository extends JpaRepository <Note, Long>{

	// Given a note ID; return a list of Note objects that have a matching ID
	@Query("")
	List<Note> findByAccountIdAndNotDeleted(@Param("accountId") Long accountId);
	
	// Given a noteId and a currentUserId, return a single Note 
	@Query("")
	Optional<Note> findByLoggedInIdAndNoteId(@Param("noteId") Long noteId, @Param("accountId") Long accountId);

}
