import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { httpRequests } from '@/api/httpRequests';
import { GlobalContext } from './GlobalContext';

interface SocialPost {
  id: string;
  content: string;
  accountId: string;
  dateTimeCreated: string;
  likes: string[];
  comments: SocialPostComment[];  
}

interface SocialPostComment {
  id: string;
  content: string;
  postId: string;
  accountId: string;
  dateTimeCreated: string;
}

interface SocialFeedContextType {
  posts: SocialPost[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  addPost: (content: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

const SocialFeedContext = createContext<SocialFeedContextType | undefined>(undefined);

export function SocialFeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: { token } } = useContext(GlobalContext);

  const fetchPosts = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      // Get all the post IDs for the current user
      const postIds: string[] = await httpRequests.get('/socialPost/getPostsFromAccountId', token, {});
      
      if (Array.isArray(postIds)) {
        const postsData: SocialPost[] = await Promise.all(
          postIds.map(async id => {
            const postData = await httpRequests.get(`/socialPost/getPost/${id}`, token, {});
            console.log('Fetched Post Data:', postData);

            return {
              ...postData,
              likes: Array.isArray(postData.likes) ? postData.likes : [],
              comments: Array.isArray(postData.comments) ? postData.comments : [],
            };
          })
        );
        
        // Sort posts by dateTimeCreated
        const sortedPosts = postsData.sort((a, b) => 
          new Date(b.dateTimeCreated).getTime() - new Date(a.dateTimeCreated).getTime()
        );
        
        setPosts(sortedPosts);
      } else {
        setPosts([]);
      }
    } catch (err: any) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addPost = useCallback(async (content: string) => {
    if (!token) return;
    
    try {
      const response = await httpRequests.post('/socialPost/addPost', token, { content });
      const newPost: SocialPost = await response.json();
      newPost.likes = Array.isArray(newPost.likes) ? newPost.likes : [];
      newPost.comments = Array.isArray(newPost.comments) ? newPost.comments : [];
      setPosts(currentPosts => [newPost, ...currentPosts]);
    } catch (err: any) {
      setError('Failed to add post');
      console.error('Error adding post:', err);
    }
  }, [token]);

  const deletePost = useCallback(async (postId: string) => {
    if (!token) return;
    
    try {
      await httpRequests.delete(`/socialPost/deletePost/${postId}`, token);
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
    } catch (err: any) {
      setError('Failed to delete post');
      console.error('Error deleting post:', err);
    }
  }, [token]);

  const toggleLike = useCallback(async (postId: string) => {
    if (!token) return;
    
    try {
      const post = posts.find(p => p.id === postId);
      const isLiked = post?.likes.includes(token);
      
      if (isLiked) {
        const response = await httpRequests.put(`/socialPost/deleteLike/${postId}`, token, {});
        if (response.ok) {
          setPosts(currentPosts => 
            currentPosts.map(post => 
              post.id === postId 
                ? { ...post, likes: post.likes.filter(id => id !== token) }
                : post
            )
          );
        }
      } else {
        const response = await httpRequests.put(`/socialPost/addLike/${postId}`, token, {});
        if (response.ok) {
          setPosts(currentPosts => 
            currentPosts.map(post => 
              post.id === postId 
                ? { ...post, likes: [...post.likes, token] }
                : post
            )
          );
        }
      }
    } catch (err: any) {
      setError('Failed to toggle like');
      console.error('Error toggling like:', err);
    }
  }, [token, posts]);

  const addComment = useCallback(async (postId: string, content: string) => {
    if (!token) return;
    
    try {
      const response = await httpRequests.put('/socialPost/addComment', token, {
        content,
        postId
      });

      if (response.ok) {
        const newComment: SocialPostComment = await response.json();
        newComment.id = newComment.id || '';
        newComment.content = newComment.content || '';
        newComment.postId = newComment.postId || '';
        newComment.accountId = newComment.accountId || '';
        newComment.dateTimeCreated = newComment.dateTimeCreated || new Date().toISOString();
        
        setPosts(currentPosts => 
          currentPosts.map(post => 
            post.id === postId 
              ? { ...post, comments: [...post.comments, newComment] }
              : post
          )
        );
      }
    } catch (err: any) {
      setError('Failed to add comment');
      console.error('Error adding comment:', err);
    }
  }, [token]);

  const deleteComment = useCallback(async (commentId: string) => {
    if (!token) return;
    
    try {
      const response = await httpRequests.put(`/socialPost/deleteComment/${commentId}`, token, {});
      if (response.ok) {
        setPosts(currentPosts => 
          currentPosts.map(post => ({
            ...post,
            comments: post.comments.filter(comment => comment.id !== commentId)
          }))
        );
      }
    } catch (err: any) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  }, [token]);

  return (
    <SocialFeedContext.Provider
      value={{
        posts,
        loading,
        error,
        fetchPosts,
        addPost,
        deletePost,
        toggleLike,
        addComment,
        deleteComment,
      }}
    >
      {children}
    </SocialFeedContext.Provider>
  );
}

export function useSocialFeed() {
  const context = useContext(SocialFeedContext);
  if (context === undefined) {
    throw new Error('useSocialFeed must be used within a SocialFeedProvider');
  }
  return context;
}