package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.SocialPostCommentMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.mapper.SocialPostMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.AccountsModel;
import com.riptFitness.Ript_Fitness_Backend.domain.model.SocialPost;
import com.riptFitness.Ript_Fitness_Backend.domain.model.SocialPostComment;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.AccountsRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.SocialPostCommentRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.SocialPostRepository;
import com.riptFitness.Ript_Fitness_Backend.web.dto.SocialPostCommentDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.SocialPostDto;

@Service
public class SocialPostService {
	
	private SocialPostRepository socialPostRepository;
	
	private SocialPostCommentRepository socialPostCommentRepository;
	
	private AccountsRepository accountsRepository;
	
	private AccountsService accountsService;

	public SocialPostService(SocialPostRepository socialPostRepository, SocialPostCommentRepository socialPostCommentRepository, AccountsRepository accountsRepository, AccountsService accountsService) {
		this.socialPostRepository = socialPostRepository;
		this.socialPostCommentRepository = socialPostCommentRepository;
		this.accountsRepository = accountsRepository;
		this.accountsService = accountsService;
	}
	
	public SocialPostDto addPost(SocialPostDto socialPostDto) {
		SocialPost socialPostToBeAdded = SocialPostMapper.INSTANCE.toSocialPost(socialPostDto);
		socialPostToBeAdded.accountId = accountsService.getLoggedInUserId();
		socialPostToBeAdded = socialPostRepository.save(socialPostToBeAdded);
		return SocialPostMapper.INSTANCE.toSocialPostDto(socialPostToBeAdded);
	}
	
	public SocialPostDto getPost(Long socialPostId) {
		Optional<SocialPost> returnedOptionalSocialPostObject = socialPostRepository.findById(socialPostId);
		
		if(returnedOptionalSocialPostObject.isEmpty())
			throw new RuntimeException("SocialPost object not found in database with ID = " + socialPostId);
		
		SocialPost returnedSocialPostObject = returnedOptionalSocialPostObject.get();
		
		return SocialPostMapper.INSTANCE.toSocialPostDto(returnedSocialPostObject);
	}
	
	public ArrayList<Long> getPostsFromAccountId(){
		Long currentUsersAccountId = accountsService.getLoggedInUserId();
		
		Optional<ArrayList<Long>> postsFromAccountId = socialPostRepository.getPostsFromAccountId(currentUsersAccountId);
		
		if(postsFromAccountId.isEmpty())
			return new ArrayList<Long>();
		
		return postsFromAccountId.get();
	}
	
	public SocialPostDto editPostContent(Long socialPostId, String newSocialPostContent) {
		Optional<SocialPost> optionalSocialPostToBeEdited = socialPostRepository.findById(socialPostId);
		
		if(optionalSocialPostToBeEdited.isEmpty())
			throw new RuntimeException("SocialPost object not found in database with ID = " + socialPostId);
				
		SocialPost socialPostToBeEdited = optionalSocialPostToBeEdited.get();
		
		socialPostToBeEdited.content = newSocialPostContent;
		
		socialPostToBeEdited = socialPostRepository.save(socialPostToBeEdited);
		
		return SocialPostMapper.INSTANCE.toSocialPostDto(socialPostToBeEdited);
	}
	
	public SocialPostDto deletePost(Long socialPostId) {
		Optional<SocialPost> optionalSocialPostToBeDeleted = socialPostRepository.findById(socialPostId);
		
		if(optionalSocialPostToBeDeleted.isEmpty())
			throw new RuntimeException("SocialPost object not found in database with ID = " + socialPostId);

		SocialPost socialPostToBeDeleted = optionalSocialPostToBeDeleted.get();
		
		socialPostToBeDeleted.isDeleted = true;
		
		socialPostToBeDeleted = socialPostRepository.save(socialPostToBeDeleted);
		
		return SocialPostMapper.INSTANCE.toSocialPostDto(socialPostToBeDeleted);
	}
	
	public SocialPostDto addLike(Long socialPostId) {
		Optional<SocialPost> optionalSocialPostObject = socialPostRepository.findById(socialPostId);
		
		if(optionalSocialPostObject.isEmpty())
			throw new RuntimeException("SocialPost object not found in database with ID = " + socialPostId);

		Long userId = accountsService.getLoggedInUserId();
		
		Optional<AccountsModel> accountsModelObject = accountsRepository.findById(userId);
		
		if(accountsModelObject.isEmpty())
			throw new RuntimeException("AccountsModel object not found in database with UserID = " + userId);
		
		SocialPost socialPostObject = optionalSocialPostObject.get();
		
		if(socialPostObject.userIDsOfLikes.contains(userId))
			throw new RuntimeException("The user with user ID = " + userId + " already liked the SocialPost with ID = " + socialPostId + ". No changes were made to the SocialPost.");
		
		socialPostObject.userIDsOfLikes.add(userId);
		
		socialPostObject.numberOfLikes++;
		
		socialPostObject = socialPostRepository.save(socialPostObject);
		
		return SocialPostMapper.INSTANCE.toSocialPostDto(socialPostObject);
	}
	
	public SocialPostDto deleteLike(Long socialPostId) {
		Optional<SocialPost> optionalSocialPostObject = socialPostRepository.findById(socialPostId);
		
		if(optionalSocialPostObject.isEmpty())
			throw new RuntimeException("SocialPost object not found in database with ID = " + socialPostId);

		Long userId = accountsService.getLoggedInUserId();
		
		Optional<AccountsModel> accountsModelObject = accountsRepository.findById(userId);
		
		if(accountsModelObject.isEmpty())
			throw new RuntimeException("AccountsModel object not found in database with UserID = " + userId);
		
		SocialPost socialPostObject = optionalSocialPostObject.get();
		
		if(!socialPostObject.userIDsOfLikes.contains(userId))
			throw new RuntimeException("The user with user ID = " + userId + " has not already liked the SocialPost with ID = " + socialPostId + ". No changes were made to the SocialPost.");
	
		socialPostObject.userIDsOfLikes.remove(userId);
		
		socialPostObject.numberOfLikes--;
		
		socialPostRepository.save(socialPostObject);
		
		return SocialPostMapper.INSTANCE.toSocialPostDto(socialPostObject);
	}
	
	public SocialPostDto addComment(SocialPostCommentDto socialPostComment) {
		socialPostComment.accountId = accountsService.getLoggedInUserId();
		
		Optional<SocialPost> optionalSocialPostObject = socialPostRepository.findById(socialPostComment.postId);
		
		if(optionalSocialPostObject.isEmpty())
			throw new RuntimeException("SocialPost object not found in database with ID = " + socialPostComment.postId);
		
		SocialPost socialPostObject = optionalSocialPostObject.get();
		
		SocialPostComment socialPostCommentModel = SocialPostCommentMapper.INSTANCE.toSocialPostComment(socialPostComment);
				
		socialPostObject.socialPostComments.add(socialPostCommentModel);
		
		socialPostObject = socialPostRepository.save(socialPostObject);
		
		return SocialPostMapper.INSTANCE.toSocialPostDto(socialPostObject);
	}
	
	public SocialPostDto deleteComment(Long socialPostCommentId) {
		Optional<SocialPostComment> optionalSocialPostCommentObject = socialPostCommentRepository.findById(socialPostCommentId);
		
		if(optionalSocialPostCommentObject.isEmpty())
			throw new RuntimeException("SocialPostComment object not found in database with ID = " + socialPostCommentId);
		
		SocialPostComment socialPostCommentObject = optionalSocialPostCommentObject.get();
		
		socialPostCommentObject.isDeleted = true;
		
		SocialPost socialPostContainingDeletedComment = socialPostRepository.findById(socialPostCommentObject.postId).get();
		
		SocialPostComment socialPostCommentToBeDeleted = null;
		
		for(SocialPostComment socialPostComment : socialPostContainingDeletedComment.socialPostComments) {
			if(socialPostComment.id == socialPostCommentId)
				socialPostCommentToBeDeleted = socialPostComment;
		}
		
		socialPostContainingDeletedComment.socialPostComments.remove(socialPostCommentToBeDeleted);
		
		SocialPost updatedSocialPost = socialPostRepository.save(socialPostContainingDeletedComment);
						
		socialPostCommentRepository.save(socialPostCommentObject);
		
		return SocialPostMapper.INSTANCE.toSocialPostDto(updatedSocialPost);
	}
	
	public ArrayList<Long> getCommentsFromAccountId(){
		Long currentUsersAccountId = accountsService.getLoggedInUserId();
		
		Optional<ArrayList<Long>> commentsFromAccountId = socialPostCommentRepository.getPostsFromAccountId(currentUsersAccountId);
		
		if(commentsFromAccountId.isEmpty())
			return new ArrayList<Long>();
		
		return commentsFromAccountId.get();
	}
}
