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
import TestBottomSheet from './TestBottomSheet';
import { useNavigation } from '@react-navigation/native';
import { useStreak } from '@/context/StreakContext';
import StreakHeader from '@/components/StreakHeader';
import { GlobalContext } from '@/context/GlobalContext';
import { useSocialFeed } from '@/context/SocialFeedContext';
import { Ionicons } from '@expo/vector-icons';
import { CreatePostSheetRef } from './CreatePostSheet'

type ApiPost = {
  id: string;
  content: string;
  accountId: string;
  dateTimeCreated: string;
  likes: string[];
  comments: Array<{
    id: string;
    content: string;
    postId: string;
    accountId: string;
    dateTimeCreated: string;
  }>;
};

export default function SocialFeed() {
  const createPostSheetRef = useRef<CreatePostSheetRef>(null);
  const { posts, loading, error, fetchPosts, toggleLike } = useSocialFeed();
  const {
    data: { token },
  } = useContext(GlobalContext);

  

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = useCallback(
    (id: string) => {
      toggleLike(id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    },
    [toggleLike]
  );

const handleOpenCreatePost = useCallback(() => {
  console.log('createPostSheetRef.current:', createPostSheetRef.current);
  createPostSheetRef.current?.snapToIndex(0);
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  console.log('Opening create post sheet...');
}, [createPostSheetRef]);

  const renderItem = useCallback(
    ({ item }: { item: ApiPost }) => (
      <PostItem
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

  // if (error) {
  //   return (
  //     <View style={styles.emptyContainer}>
  //       <Text style={styles.emptyText}>Error loading posts: {error}</Text>
  //     </View>
  //   );
  // }

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
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No posts available</Text>
                <Text style={styles.emptyEmoji}>😭</Text>
              </View>
            }
          />

          {/* Create Post Button */}
          <TouchableOpacity style={styles.createPostButton} onPress={handleOpenCreatePost}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>

          {/* Create Post Sheet */}
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
});
