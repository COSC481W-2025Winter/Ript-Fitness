// SocialFeed.tsx
import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  RefreshControl,
  View,
  TouchableOpacity,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalProvider } from '@gorhom/portal';
import PostItem from '@/components/socialfeed/PostItem';
import CreatePostSheet from './CreatePostSheet';
import { useSocialFeed, SocialPost } from '@/context/SocialFeedContext';
import { Ionicons } from '@expo/vector-icons';
import { CreatePostSheetRef } from './CreatePostSheet';
import StreakHeader from '@/components/StreakHeader';
import { GlobalContext } from '@/context/GlobalContext';

export default function SocialFeed() {
  const createPostSheetRef = useRef<CreatePostSheetRef>(null);
  const { posts, loading, error, fetchPosts, toggleLike } = useSocialFeed(); // Added toggleLike here
  const { data: { token } } = useContext(GlobalContext);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  
  // Track if initial load has happened
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  // Reference to track if a fetch is in progress
  const isFetchingRef = useRef(false);

  // Fetch initial posts on component mount
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
      console.error('Error during initial load:', error);
    }
  };

  // Inside your SocialFeed component:
  const handleLoadMore = useCallback(async () => {
    // Check if we should fetch more posts
    if (
      loading || 
      !hasMorePosts || 
      isFetchingRef.current || 
      posts.length < page * pageSize || // This means we got fewer posts than expected
      posts.length === 0 // No posts available
    ) {
      setHasMorePosts(false);
      return;
    }

    try {
      isFetchingRef.current = true;
      const nextPage = page + 1;
      const startIndex = nextPage * pageSize;
      const endIndex = startIndex + pageSize;
      
      // Store current posts length to check if we got new posts
      const currentLength = posts.length;
      
      await fetchPosts(startIndex, endIndex);
      
      // Check if we got any new posts
      if (posts.length === currentLength) {
        setHasMorePosts(false);
      } else {
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
      setHasMorePosts(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [loading, hasMorePosts, page, posts.length, fetchPosts]);

  // Update onRefresh to handle errors better
  const onRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      setPage(0); // Reset pagination
      setHasMorePosts(true);
      await fetchPosts(0, pageSize);
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchPosts, isRefreshing]);

  // Like handler
  const handleLike = useCallback((id: string) => {
    toggleLike(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  }, [toggleLike]);

  // Open Create Post Sheet handler
  const handleOpenCreatePost = useCallback(() => {
    createPostSheetRef.current?.snapToIndex(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  }, []);

  // Render individual post items
  const renderItem = useCallback(
    ({ item }: { item: SocialPost }) => (
      <PostItem
        key={`post-${item.id}`}
        item={{
          id: item.id,
          type: 'text',
          content: item.content,
          user: {
            name: item.accountId,
            profilePicture: 'https://avatar.iran.liara.run/public/boy?username=Ash',
          },
          dateTimeCreated: item.dateTimeCreated,
          likes: Array.isArray(item.likes) ? item.likes : [],
          comments: Array.isArray(item.comments)
            ? item.comments.map((comment) => ({ ...comment, timestamp: comment.dateTimeCreated }))
            : [],
        }}
        liked={Array.isArray(item.likes) && item.likes.includes(token)}
        onLikePress={() => handleLike(item.id)}
      />
    ),
    [handleLike, token]
  );

  // Render footer component for loading indicator
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <Text>Loading more posts...</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PortalProvider>
        <SafeAreaView style={styles.container}>
          <StreakHeader />
          <StatusBar barStyle="default" />

          <FlatList
            ListHeaderComponent={() => <View style={{ marginTop: StatusBar.currentHeight || 0 }} />}
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => `post-${item.id}`}
            refreshControl={
              <RefreshControl 
                refreshing={isRefreshing} 
                onRefresh={onRefresh} 
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No posts available</Text>
                <Text style={styles.emptyEmoji}>😭</Text>
              </View>
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />

          <TouchableOpacity style={styles.createPostButton} onPress={handleOpenCreatePost}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>

          <CreatePostSheet ref={createPostSheetRef} />
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
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 20,
    color: '#999',
    margin: 7,
  },
  emptyEmoji: {
    fontSize: 48,
    color: '#999',
    margin: 7,
  },
  createPostButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#21BFBF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  footer: {
    padding: 10,
    alignItems: 'center',
  },
});