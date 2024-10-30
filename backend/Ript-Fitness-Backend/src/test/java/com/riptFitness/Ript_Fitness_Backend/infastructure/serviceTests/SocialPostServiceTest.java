package com.riptFitness.Ript_Fitness_Backend.infastructure.serviceTests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.riptFitness.Ript_Fitness_Backend.domain.mapper.SocialPostMapper;
import com.riptFitness.Ript_Fitness_Backend.domain.model.SocialPost;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.SocialPostCommentRepository;
import com.riptFitness.Ript_Fitness_Backend.domain.repository.SocialPostRepository;
import com.riptFitness.Ript_Fitness_Backend.infrastructure.service.SocialPostService;
import com.riptFitness.Ript_Fitness_Backend.web.dto.SocialPostCommentDto;
import com.riptFitness.Ript_Fitness_Backend.web.dto.SocialPostDto;

public class SocialPostServiceTest {

	@Mock
	private SocialPostRepository socialPostRepository;
	
	@Mock
	private SocialPostCommentRepository socialPostCommentRepository;
	
	@InjectMocks
	private SocialPostService socialPostService;
	
	private SocialPostDto socialPost;
	private SocialPost socialPostModel;
	private SocialPostCommentDto commentOne;
	private SocialPostCommentDto commentTwo;
	private SocialPostCommentDto commentThree;
	
	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
		
		socialPost = new SocialPostDto();
		socialPost.accountId = 1L;
		socialPost.content = "Just benched 500 pounds, my name is Chris and I'm so strong!!";
		socialPost.numberOfLikes = 2;
		socialPost.userIDsOfLikes = new ArrayList<>();
		socialPost.userIDsOfLikes.add(2L);
		socialPost.userIDsOfLikes.add(3L);
		socialPost.socialPostComments = new ArrayList<>();
		commentOne = new SocialPostCommentDto();
		commentTwo = new SocialPostCommentDto();
		commentThree = new SocialPostCommentDto();
		socialPost.socialPostComments.add(commentOne);
		socialPost.socialPostComments.add(commentTwo);
		
		commentOne.accountId = 2L;
		commentOne.content = "Great job Chris, OMG!";
		commentOne.postId = 1L;
		
		commentTwo.accountId = 3L;
		commentTwo.content = "Wow! So strong!!!";
		commentTwo.postId = 1L;
		
		commentThree.accountId = 4L;
		commentThree.content = "You can do better.";
		commentThree.postId = 1L;
		
		socialPostModel = SocialPostMapper.INSTANCE.toSocialPost(socialPost);
	}
	
	@Test
	void testServiceAddPostValid() {
		when(socialPostRepository.save(any(SocialPost.class))).thenReturn(socialPostModel);
		
		
	}
}
