package com.riptFitness.Ript_Fitness_Backend.domain.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.Id;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity // Creates a DB table
@Table(name = "notes")
public class Note {

	@Id // Primary Key:
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long noteId;

	@ManyToOne
	@JoinColumn(name = "account_id") // Creates a foreign key column in the notes table
	private AccountsModel account; // Reference to the account that owns this exercise

	private String title; // Title of the note (Ex: My Push day 11/14/24)

	private String description; // Description of the Note (Ex: I did 12 push ups)

	private boolean isDeleted = false; // Soft deletion

	@CreationTimestamp
	@Column(updatable = false) // The creation timestamp should not change after the record is created
	private LocalDateTime createdAt; // Stores when the note was created

	@UpdateTimestamp
	private LocalDateTime updatedAt; // Stores when the note was last updated

	// Getters and Setters for the new fields
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public void setAccount(AccountsModel account) {
		this.account = account;
	}

	public Long getNoteId() {
		return noteId;
	}

	public void setNoteId(Long noteId) {
		this.noteId = noteId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

	public AccountsModel getAccount() {
		return account;
	}

}
