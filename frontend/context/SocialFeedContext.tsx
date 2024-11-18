// SocialFeedContext.tsx
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { httpRequests } from '@/api/httpRequests';
import { GlobalContext } from './GlobalContext';

// Define the structure of a comment on a post
export interface SocialPostComment {
  id: string;
  content: string;
  postId: string;
  accountId: string;
  dateTimeCreated: string;
}

// Define the structure of a social post
export interface SocialPost {
  id: string;
  content: string;
  accountId: string;
  dateTimeCreated: string;
  likes: string[];
  comments: SocialPostComment[];
}

// Define the context type
interface SocialFeedContextType {
  posts: SocialPost[];
  loading: boolean;
  error: string | null;
  fetchPosts: (startIndex: number, endIndex: number) => Promise<void>;
  addPost: (content: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

// Create the context
const SocialFeedContext = createContext<SocialFeedContextType | undefined>(undefined);

// Provider component
export function SocialFeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { data: { token } } = useContext(GlobalContext);

const fetchPosts = useCallback(async (startIndex: number = 0, endIndex: number = 10) => {
    if (!token) {
      console.error('No token available for fetching posts.');
      setError('Authentication token is missing.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // If we're refreshing (startIndex === 0), we'll get all available posts up to endIndex
      // If we're paginating, we'll check if we already have all posts
      if (startIndex > 0 && posts.length < startIndex) {
        // We've already loaded all available posts
        setLoading(false);
        return;
      }

      const endpoint = `/socialPost/getPostsFromAccountId/${startIndex}/${endIndex}`;
      const postIdsResponse = await httpRequests.get(endpoint, token, {});
      
      // If we get a 500 error or empty response, assume we've reached the end
      if (!postIdsResponse || !Array.isArray(postIdsResponse)) {
        if (startIndex === 0) {
          // If this is a refresh, clear the posts
          setPosts([]);
        }
        setLoading(false);
        return;
      }

      // Clear existing posts if this is a refresh (startIndex === 0)
      if (startIndex === 0) {
        setPosts([]);
      }

      // Process the response to get post IDs
      const postIds = postIdsResponse.map(post => {
        if (typeof post === 'object' && post !== null && 'id' in post) {
          return String(post.id);
        }
        return String(post);
      });

      // Create set of existing post IDs
      const existingPostIds = new Set(posts.map(p => p.id));
      
      // Filter out duplicates
      const uniqueNewPostIds = postIds.filter(id => !existingPostIds.has(id));

      if (uniqueNewPostIds.length > 0) {
        const newPostsData = await Promise.all(
          uniqueNewPostIds.map(async (id) => {
            try {
              const postData = await httpRequests.get(`/socialPost/getPost/${id}`, token, {});
              return {
                ...postData,
                id: String(postData.id),
                likes: Array.isArray(postData.userIDsOfLikes) ? postData.userIDsOfLikes : [],
                comments: Array.isArray(postData.socialPostComments) ? postData.socialPostComments : [],
                dateTimeCreated: postData.dateTimeCreated || new Date().toISOString()
              };
            } catch (error) {
              console.error(`Error fetching post ${id}:`, error);
              return null;
            }
          })
        );

        // Filter out null responses and sort
        const validNewPosts = newPostsData
          .filter((post): post is SocialPost => post !== null)
          .sort((a, b) => new Date(b.dateTimeCreated).getTime() - new Date(a.dateTimeCreated).getTime());

        setPosts(currentPosts => {
          const allPosts = startIndex === 0 ? validNewPosts : [...currentPosts, ...validNewPosts];
          return allPosts.sort((a, b) => 
            new Date(b.dateTimeCreated).getTime() - new Date(a.dateTimeCreated).getTime()
          );
        });
      }
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      // Don't set error if it's just because we've reached the end of available posts
      if (startIndex === 0 || (err.message !== 'Error: Error 500' && !err.message.includes('500'))) {
        setError('Failed to fetch posts. Please try again later.');
      }
      // If this was a refresh attempt that failed, clear posts
      if (startIndex === 0) {
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [token, posts]);

  /**
   * Add a new post.
   */
  const addPost = useCallback(async (content: string) => {
    if (!token) {
      console.error('No token available for adding a post.');
      setError('Authentication token is missing.');
      return;
    }

    try {
      const response = await httpRequests.post('/socialPost/addPost', token, { content });
      if (!response.ok) {
        throw new Error('Failed to add post');
      }
      
      const newPost = await response.json();
      const formattedPost: SocialPost = {
        ...newPost,
        id: String(newPost.id),
        likes: Array.isArray(newPost.userIDsOfLikes) ? newPost.userIDsOfLikes : [],
        comments: Array.isArray(newPost.socialPostComments) ? newPost.socialPostComments : [],
        dateTimeCreated: newPost.dateTimeCreated || new Date().toISOString()
      };

      // Prepend the new post to maintain chronological order
      setPosts(currentPosts => [formattedPost, ...currentPosts]);
    } catch (err: any) {
      console.error('Error adding post:', err);
      setError('Failed to add post. Please try again.');
    }
  }, [token]);

  /**
   * Delete a post by its ID.
   */
  const deletePost = useCallback(async (postId: string) => {
    if (!token) {
      console.error('No token available for deleting a post.');
      setError('Authentication token is missing.');
      return;
    }

    try {
      await httpRequests.delete(`/socialPost/deletePost/${postId}`, token);
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
    } catch (err: any) {
      console.error(`Error deleting post with ID ${postId}:`, err);
      setError('Failed to delete post. Please try again.');
    }
  }, [token]);

  /**
   * Toggle like status for a post.
   */
  const toggleLike = useCallback(async (postId: string) => {
    if (!token) {
      console.error('No token available for toggling like.');
      setError('Authentication token is missing.');
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) {
        throw new Error('Post not found');
      }

      const isLiked = post.likes.includes(token);
      const endpoint = isLiked ? 
        `/socialPost/deleteLike/${postId}` : 
        `/socialPost/addLike/${postId}`;

      const response = await httpRequests.put(endpoint, token, {});
      
      if (response.ok) {
        setPosts(currentPosts => 
          currentPosts.map(p => {
            if (p.id === postId) {
              const updatedLikes = isLiked ?
                p.likes.filter(id => id !== token) :
                [...p.likes, token];
              return { ...p, likes: updatedLikes };
            }
            return p;
          })
        );
      }
    } catch (err: any) {
      console.error(`Error toggling like for post ID ${postId}:`, err);
      setError('Failed to update like status. Please try again.');
    }
  }, [token, posts]);

  /**
   * Add a comment to a post.
   */
  const addComment = useCallback(async (postId: string, content: string) => {
    if (!token) {
      console.error('No token available for adding a comment.');
      setError('Authentication token is missing.');
      return;
    }

    try {
      const response = await httpRequests.put('/socialPost/addComment', token, {
        content,
        postId,
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newComment = await response.json();
      const formattedComment: SocialPostComment = {
        id: String(newComment.id),
        content: newComment.content,
        postId: String(newComment.postId),
        accountId: newComment.accountId || token,
        dateTimeCreated: newComment.dateTimeCreated || new Date().toISOString()
      };

      setPosts(currentPosts =>
        currentPosts.map(post =>
          post.id === postId
            ? { ...post, comments: [...post.comments, formattedComment] }
            : post
        )
      );
    } catch (err: any) {
      console.error(`Error adding comment to post ID ${postId}:`, err);
      setError('Failed to add comment. Please try again.');
    }
  }, [token]);

  /**
   * Delete a comment by its ID.
   */
  const deleteComment = useCallback(async (commentId: string) => {
    if (!token) {
      console.error('No token available for deleting a comment.');
      setError('Authentication token is missing.');
      return;
    }

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
      console.error(`Error deleting comment with ID ${commentId}:`, err);
      setError('Failed to delete comment. Please try again.');
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

// Custom hook to use the SocialFeedContext
export function useSocialFeed() {
  const context = useContext(SocialFeedContext);
  if (context === undefined) {
    throw new Error('useSocialFeed must be used within a SocialFeedProvider');
  }
  return context;
}