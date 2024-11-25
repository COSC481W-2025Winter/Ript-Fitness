import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { httpRequests } from "@/api/httpRequests";
import { GlobalContext } from "./GlobalContext";

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
  socialPostComments: SocialPostComment[];
  isDeleted: boolean;
  numberOfLikes: number;
  userIDsOfLikes: string[];
  userProfile: {
    username?: string;
  } | null;
}

// Define friend-related interfaces
export interface Friend {
  username: string;
  accountId: string;
}

// Define loading states interface
interface LoadingStates {
  isAddingPost: boolean;
  isDeletingPost: boolean;
  isAddingComment: boolean;
  isDeletingComment: boolean;
  isTogglingLike: boolean;
  isAddingFriend: boolean;
  isDeletingFriend: boolean;
}

// Define the context type
interface SocialFeedContextType {
  posts: SocialPost[];
  friends: Friend[];
  loading: boolean;
  loadingStates: LoadingStates;
  error: string | null;
  clearError: () => void;
  fetchPosts: (startIndex: number, endIndex: number) => Promise<void>;
  addPost: (content: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  fetchFriends: () => Promise<void>;
}

// Create the context
const SocialFeedContext = createContext<SocialFeedContextType | undefined>(
  undefined
);

// Retry in case of network errors
const retry = async (fn: () => Promise<any>, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
};

// Provider component
export function SocialFeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const context = useContext(GlobalContext)

  const token: string = context?.data?.token ?? '';

  // Loading states for individual operations
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    isAddingPost: false,
    isDeletingPost: false,
    isAddingComment: false,
    isDeletingComment: false,
    isTogglingLike: false,
    isAddingFriend: false,
    isDeletingFriend: false,
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setLoadingState = useCallback(
    (key: keyof LoadingStates, value: boolean) => {
      setLoadingStates((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Fetch friends list
  const fetchFriends = useCallback(async () => {
    if (!token) {
      console.error("No token available for fetching friends.");
      setError("Authentication token is missing.");
      return;
    }

    try {
      const response = await retry(() =>
        httpRequests.get(
          "/friends/getFriendsListOfCurrentlyLoggedInUser",
          token
        )
      );
      if (Array.isArray(response)) {
        const friendsList = response.map((username) => ({
          username,
          accountId: username,
        }));
        setFriends(friendsList);
      }
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError("Failed to fetch friends list.");
    }
  }, [token]);

  // Fetch posts
  const fetchPosts = useCallback(
    async (startIndex: number = 0, endIndex: number = 10) => {
      if (!token) {
        console.error("No token available for fetching posts.");
        setError("Authentication token is missing.");
        return;
      }

      setLoading(true);
      setError(null);
      const abortController = new AbortController();

      try {
        console.log(`[DEBUG] Fetching posts from ${startIndex} to ${endIndex}`);

        const response = await retry(() =>
          httpRequests.get(
            `/socialPost/getSocialFeed/${startIndex}/${endIndex}`,
            token
          )
        );

        console.log("[DEBUG] Raw response from server:", response);

        if (!response || !Array.isArray(response)) {
          if (startIndex === 0) {
            setPosts([]);
          }
          return;
        }

        const formattedPosts = response.map((post) => {
          //console.log("[DEBUG] Processing post:", post);
          console.log("[DEBUG] Post accountId:", post.accountId);
          //console.log("[DEBUG] Post userProfile:", post.userProfile);

          console.log("[DEBUG] comment:", post.socialPostComments);

          return {
            ...post,
            id: String(post.id),
            accountId: post.accountId || "Unknown User",
            likes: Array.isArray(post.userIDsOfLikes)
              ? post.userIDsOfLikes
              : [],
            comments: Array.isArray(post.socialPostComments)
              ? post.socialPostComments.map((comment: any) => ({
                  ...comment,
                  accountId: comment.accountId || "Unknown User",
                }))
              : [],
            socialPostComments: Array.isArray(post.socialPostComments)
              ? post.socialPostComments.map((comment : any) => ({
                  ...comment,
                  accountId: comment.accountId || "Unknown User",
                }))
              : [],
            dateTimeCreated: post.dateTimeCreated || new Date().toISOString(),
            userProfile: post.userProfile || { username: post.accountId },
          };
        });

        setPosts((currentPosts) => {
          if (startIndex === 0) {
            return formattedPosts;
          }
          const existingPostIds = new Set(currentPosts.map((p) => p.id));
          const uniqueNewPosts = formattedPosts.filter(
            (post) => !existingPostIds.has(post.id)
          );
          return [...currentPosts, ...uniqueNewPosts].sort(
            (a, b) =>
              new Date(b.dateTimeCreated).getTime() -
              new Date(a.dateTimeCreated).getTime()
          );
        });
        clearError();
      } catch (err: any) {
        if (err.name === "AbortError") {
          return;
        }
        console.error("[DEBUG] Error fetching posts:", err);
        if (startIndex === 0) {
          setPosts([]);
        }
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }

      return () => {
        abortController.abort();
      };
    },
    [token, clearError]
  );

  // Add post
  const addPost = useCallback(
    async (content: string) => {
      if (!token) {
        console.error("No token available for adding a post.");
        setError("Authentication token is missing.");
        return;
      }

      setLoadingState("isAddingPost", true);
      try {
        const response = await retry(() =>
          httpRequests.post("/socialPost/addPost", token, { content })
        );

        if (!response.ok) {
          throw new Error("Failed to add post");
        }

        const newPost = await response.json();
        const formattedPost: SocialPost = {
          ...newPost,
          id: String(newPost.id),
          likes: Array.isArray(newPost.userIDsOfLikes)
            ? newPost.userIDsOfLikes
            : [],
          comments: Array.isArray(newPost.socialPostComments)
            ? newPost.socialPostComments
            : [],
          dateTimeCreated: newPost.dateTimeCreated || new Date().toISOString(),
        };

        setPosts((prevPosts) => [formattedPost, ...prevPosts]);
        clearError();
      } catch (err: any) {
        console.error("Error adding post:", err);
        setError("Failed to add post. Please try again.");
      } finally {
        setLoadingState("isAddingPost", false);
      }
    },
    [token, clearError]
  );

  // Delete post
  const deletePost = useCallback(
    async (postId: string) => {
      if (!token) {
        console.error("No token available for deleting a post.");
        setError("Authentication token is missing.");
        return;
      }

      setLoadingState("isDeletingPost", true);
      try {
        await retry(() =>
          httpRequests.delete(`/socialPost/deletePost/${postId}`, token)
        );
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        clearError();
      } catch (err: any) {
        console.error(`Error deleting post with ID ${postId}:`, err);
        setError("Failed to delete post. Please try again.");
      } finally {
        setLoadingState("isDeletingPost", false);
      }
    },
    [token, clearError]
  );

  // Update post helper
  const updatePost = useCallback(
    (postId: string, updateFn: (post: SocialPost) => SocialPost) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? updateFn(post) : post))
      );
    },
    []
  );

  // Toggle like
  const toggleLike = useCallback(
    async (postId: string) => {
      if (!token) return;

      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      setLoadingState("isTogglingLike", true);
      const isLiked = post.likes.includes(token);

      // Optimistic update
      updatePost(postId, (post) => ({
        ...post,
        likes: isLiked
          ? post.likes.filter((id) => id !== token)
          : [...post.likes, token],
      }));

      try {
        await retry(() =>
          httpRequests.put(`/socialPost/toggleLike/${postId}`, token, {})
        );
        clearError();
      } catch (err) {
        // Revert on error
        updatePost(postId, (post) => ({
          ...post,
          likes: isLiked
            ? [...post.likes, token]
            : post.likes.filter((id) => id !== token),
        }));
        setError("Failed to update like status.");
      } finally {
        setLoadingState("isTogglingLike", false);
      }
    },
    [posts, token, updatePost, clearError]
  );

  // Add comment
  const addComment = useCallback(
    async (postId: string, content: string) => {
      console.log("[DEBUG] AddComment started:", { postId, content });

      if (!token) {
        console.error("[DEBUG] No token available for adding a comment.");
        setError("Authentication token is missing.");
        return;
      }

      setLoadingState("isAddingComment", true);
      try {
        console.log("[DEBUG] Making API request with comment payload:", {
          content,
          postId,
        });

        const response = await retry(() =>
          httpRequests.put("/socialPost/addComment", token, { content, postId })
        );

        console.log("[DEBUG] Raw API response:", response);

        if (!response.ok) {
          throw new Error("Failed to add comment");
        }

        const responseData = await response.json();

        const newComment =
          responseData.socialPostComments[
            responseData.socialPostComments.length - 1
          ];

        console.log("[DEBUG] Parsed API response (newComment):", newComment);

        if (newComment.content !== content) {
          console.warn("[DEBUG] Content mismatch!", {
            sent: content,
            received: newComment.content,
          });
        }

        const formattedComment: SocialPostComment = {
          id: String(newComment.id),
          content: newComment.content,
          postId: String(newComment.postId),
          accountId: newComment.accountId,
          dateTimeCreated: newComment.dateTimeCreated,
        };

        console.log("[DEBUG] Formatted comment:", formattedComment);

        setPosts((prevPosts) => {
          const updatedPosts = prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [...post.comments, formattedComment],
                  socialPostComments: [
                    ...post.socialPostComments,
                    formattedComment,
                  ],
                }
              : post
          );
          return updatedPosts;
        });
        clearError();
      } catch (err: any) {
        console.error(`Error adding comment to post ID ${postId}:`, err);
        setError("Failed to add comment. Please try again.");
      } finally {
        setLoadingState("isAddingComment", false);
      }
    },
    [token, clearError]
  );

  // Delete comment
  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!token) {
        console.error("No token available for deleting a comment.");
        setError("Authentication token is missing.");
        return;
      }

      setLoadingState("isDeletingComment", true);
      try {
        const response = await retry(() =>
          httpRequests.put(`/socialPost/deleteComment/${commentId}`, token, {})
        );

        if (response.ok) {
          setPosts((prevPosts) =>
            prevPosts.map((post) => ({
              ...post,
              comments: post.comments.filter(
                (comment) => comment.id !== commentId
              ),
            }))
          );
          clearError();
        }
      } catch (err: any) {
        console.error(`Error deleting comment with ID ${commentId}:`, err);
        setError("Failed to delete comment. Please try again.");
      } finally {
        setLoadingState("isDeletingComment", false);
      }
    },
    [token, clearError]
  );

  // Initial friends fetch
  useEffect(() => {
    let mounted = true;

    if (token) {
      const loadFriends = async () => {
        try {
          const response = await httpRequests.get(
            "/friends/getFriendsListOfCurrentlyLoggedInUser",
            token
          );
          if (mounted && Array.isArray(response)) {
            const friendsList = response.map((username) => ({
              username,
              accountId: username,
            }));
            setFriends(friendsList);
          }
        } catch (err) {
          if (mounted) {
            console.error("Error fetching friends:", err);
            setError("Failed to fetch friends list.");
          }
        }
      };

      loadFriends();
    }

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <SocialFeedContext.Provider
      value={{
        posts,
        friends,
        loading,
        loadingStates,
        error,
        clearError,
        fetchPosts,
        addPost,
        deletePost,
        toggleLike,
        addComment,
        deleteComment,
        fetchFriends,
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
    throw new Error("useSocialFeed must be used within a SocialFeedProvider");
  }
  return context;
}
