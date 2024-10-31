package com.riptFitness.Ript_Fitness_Backend.web.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riptFitness.Ript_Fitness_Backend.domain.model.SocialPostComment;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.SocialPostService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.SocialPostCommentDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.SocialPostDto;

@RestController
@RequestMapping("/socialPost")
public class SocialPostController {
	
	SocialPostService socialPostService;
	
	public SocialPostController(SocialPostService socialPostService) {
		this.socialPostService = socialPostService;
	}
	
	@PostMapping("/addPost")
	public ResponseEntity<SocialPostDto> addPost(@RequestBody SocialPostDto socialPostDto){
		SocialPostDto savedSocialPostObject = socialPostService.addPost(socialPostDto);
		return new ResponseEntity<>(savedSocialPostObject, HttpStatus.CREATED);
	}
	
	@GetMapping("/getPost/{socialPostId}")
	public ResponseEntity<SocialPostDto> getPost(@PathVariable Long socialPostId){
		SocialPostDto returnedSocialPostObject = socialPostService.getPost(socialPostId);
		return new ResponseEntity<>(returnedSocialPostObject, HttpStatus.OK);
	}
	
	@GetMapping("/getPostsFromAccountId")
	public ResponseEntity<ArrayList<Long>> getPostsFromAccountId(){
		ArrayList<Long> returnedListOfPostIds = socialPostService.getPostsFromAccountId();
		return new ResponseEntity<>(returnedListOfPostIds, HttpStatus.OK);
	}
	
	@GetMapping("/getCommentsFromAccountId")
	public ResponseEntity<ArrayList<Long>> getCommentsFromAccountId(){
		ArrayList<Long> returnedListOfCommentIds = socialPostService.getCommentsFromAccountId();
		return new ResponseEntity<>(returnedListOfCommentIds, HttpStatus.OK);
	}
	
	@PutMapping("/editPostContent/{socialPostId}")
	public ResponseEntity<SocialPostDto> editPostContent(@PathVariable Long socialPostId, @RequestBody String newSocialPostContent){
		SocialPostDto editedSocialPostObject = socialPostService.editPostContent(socialPostId, newSocialPostContent);
		return new ResponseEntity<>(editedSocialPostObject, HttpStatus.OK);
	}

	@DeleteMapping("/deletePost/{socialPostId}")
	public ResponseEntity<SocialPostDto> deletePost(@PathVariable Long socialPostId){
		SocialPostDto deletedSocialPostObject = socialPostService.deletePost(socialPostId);
		return new ResponseEntity<>(deletedSocialPostObject, HttpStatus.OK);
	}
	
	@PutMapping("/addLike/{socialPostId}")
	public ResponseEntity<SocialPostDto> addLike(@PathVariable Long socialPostId){
		SocialPostDto socialPostObject = socialPostService.addLike(socialPostId);
		return new ResponseEntity<>(socialPostObject, HttpStatus.OK);
	}
	
	@PutMapping("/deleteLike/{socialPostId}")
	public ResponseEntity<SocialPostDto> deleteLike(@PathVariable Long socialPostId){
		SocialPostDto socialPostObject = socialPostService.deleteLike(socialPostId);
		return new ResponseEntity<>(socialPostObject, HttpStatus.OK);
	}
	
	@PutMapping("/addComment")
	public ResponseEntity<SocialPostDto> addComment(@RequestBody SocialPostCommentDto socialPostComment){
		SocialPostDto socialPostObject = socialPostService.addComment(socialPostComment);
		return new ResponseEntity<>(socialPostObject, HttpStatus.OK);
	}
	
	@PutMapping("/deleteComment/{socialPostCommentId}")
	public ResponseEntity<SocialPostDto> deleteComment(@PathVariable Long socialPostCommentId){
		SocialPostDto socialPostObject = socialPostService.deleteComment(socialPostCommentId);
		return new ResponseEntity<>(socialPostObject, HttpStatus.OK);
	}
}
