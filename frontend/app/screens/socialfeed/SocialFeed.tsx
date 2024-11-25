import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  RefreshControl,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "@gorhom/portal";
import PostItem from "@/components/socialfeed/PostItem";
import CreatePostSheet from "./CreatePostSheet";
import CommentsSheet, { CommentsSheetRef } from "./CommentsSheet";
import { useSocialFeed, SocialPost } from "@/context/SocialFeedContext";
import { Ionicons } from "@expo/vector-icons";
import { CreatePostSheetRef } from "./CreatePostSheet";
import ProfileImage from "../../../assets/images/profile/Profile.png";
import StreakHeader from "@/components/StreakHeader";
import { GlobalContext } from "@/context/GlobalContext";

export default function SocialFeed() {
  const createPostSheetRef = useRef<CreatePostSheetRef>(null);
  const commentsSheetRef = useRef<CommentsSheetRef>(null);
  const { posts, loading, error, fetchPosts, toggleLike } = useSocialFeed();

  const context = useContext(GlobalContext)

  const token: string = context?.data?.token ?? '';




  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!initialLoadDone) {
      handleInitialLoad();
    }
  }, []);

  const handleInitialLoad = async () => {
    try {
      await fetchPosts(0, pageSize);
      setInitialLoadDone(true);
    } catch (error) {
      console.error("Error during initial load:", error);
      setInitialLoadDone(true);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (
      loading ||
      !hasMorePosts ||
      isFetchingRef.current ||
      posts.length < page * pageSize ||
      posts.length === 0
    ) {
      console.log("[DEBUG] Skipping load more:", {
        loading,
        hasMorePosts,
        isFetching: isFetchingRef.current,
        currentPostCount: posts.length,
        expectedMinimum: page * pageSize,
      });
      setHasMorePosts(false);
      return;
    }

    try {
      isFetchingRef.current = true;
      const nextPage = page + 1;
      const startIndex = nextPage * pageSize;
      const endIndex = startIndex + pageSize;

      console.log("[DEBUG] Attempting to load more posts:", {
        startIndex,
        endIndex,
        currentPostCount: posts.length,
      });

      const currentLength = posts.length;

      await fetchPosts(startIndex, endIndex);

      if (posts.length === currentLength) {
        console.log("[DEBUG] No new posts received, reached end");
        setHasMorePosts(false);
      } else {
        setPage(nextPage);
      }
    } catch (error: any) {
      if (error.message?.includes("500")) {
        console.log("[DEBUG] Reached end of available posts");
        setHasMorePosts(false);
      } else {
        console.error("Error loading posts:", error);
        throw error;
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, [loading, hasMorePosts, page, posts.length, fetchPosts]);

  const onRefresh = useCallback(async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);
      setPage(0);
      setHasMorePosts(true);
      await fetchPosts(0, pageSize);
      setInitialLoadDone(true);
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchPosts, isRefreshing]);

  const handleLike = useCallback(
    (id: string) => {
      toggleLike(id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    },
    [toggleLike]
  );

  const handleOpenCreatePost = useCallback(() => {
    createPostSheetRef.current?.snapToIndex(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: SocialPost }) => {
      console.log("[DEBUG] Processing post for display:", {
        id: item.id,
        accountId: item.accountId,
        //userProfile: item.userProfile,
      });

      const username = item.userProfile?.username || item.accountId;

      console.log("[DEBUG] Resolved username:", {
        id: item.id,
        username,
        fromUserProfile: item.userProfile?.username,
        fromAccountId: item.accountId,
      });

      return (
        <PostItem
          key={`post-${item.id}`}
          item={{
            id: item.id,
            type: "text",
            content: item.content,
            user: {
              name: username !== "Unknown User" ? username : item.accountId,
              profilePicture: ProfileImage,
            },
            dateTimeCreated: item.dateTimeCreated,
            likes: Array.isArray(item.likes) ? item.likes : [],
            comments: Array.isArray(item.comments)
              ? item.comments.map((comment) => ({
                  ...comment,
                  timestamp: comment.dateTimeCreated,
                }))
              : [],
          }}
          liked={Array.isArray(item.likes) && item.likes.includes(token)}
          onLikePress={() => handleLike(item.id)}
          onCommentPress={() => {
            console.log(`Comment button pressed for post ID: ${item.id}`);
            commentsSheetRef.current?.showCommentsForPost(item.id);
          }}
        />
      );
    },
    [handleLike, token]
  );

  const renderFooter = () => {
    if (loading && !isRefreshing) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator
            size="large"
            color="#21BFBF"
            accessibilityLabel="Loading posts"
          />
        </View>
      );
    }
    return null;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PortalProvider>
        <SafeAreaView style={styles.container}>
          <StreakHeader />
          <StatusBar barStyle="default" />

          <FlatList
            ListHeaderComponent={() => (
              <View style={{ marginTop: StatusBar.currentHeight || 0 }} />
            )}
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => `post-${item.id}`}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              !loading && initialLoadDone ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No posts available</Text>
                  <Text style={styles.emptyEmoji}>😔</Text>
                </View>
              ) : null
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />

          <TouchableOpacity
            style={styles.createPostButton}
            onPress={handleOpenCreatePost}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>

          <CreatePostSheet ref={createPostSheetRef} />
          <CommentsSheet ref={commentsSheetRef} />
        </SafeAreaView>
      </PortalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 20,
    color: "#999",
    margin: 7,
  },
  emptyEmoji: {
    fontSize: 48,
    color: "#999",
    margin: 7,
  },
  createPostButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#21BFBF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  footer: {
    flex: 1,
    padding: 20,
    height: 600,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
