import React, { useState, useCallback, useEffect, useContext, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  RefreshControl,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import PostItem from '@/components/socialfeed/PostItem';
import { useNavigation } from '@react-navigation/native';
import { useStreak } from '@/context/StreakContext';
import StreakCounter from '@/components/StreakCounter';
import StreakHeader from '@/components/StreakHeader';
import { GlobalContext } from '@/context/GlobalContext';
import { useSocialFeed } from '@/context/SocialFeedContext';

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
  const { 
    posts, 
    loading, 
    error, 
    fetchPosts, 
    toggleLike 
  } = useSocialFeed();

  const { data: { token } } = useContext(GlobalContext);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = useCallback((id: string) => {
    toggleLike(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  }, [toggleLike]);

  const renderItem = useCallback(({ item }: { item: ApiPost }) => (
    <PostItem
      item={{
        id: item.id,
        type: 'text', // Assuming all posts are text for now
        content: item.content,
        user: {
          name: item.accountId, // Ideally, map accountId to user name
          profilePicture: 'https://avatar.iran.liara.run/public/boy?username=Ash', // Replace with actual profile picture in future
        },
        dateTimeCreated: item.dateTimeCreated,
        likes: Array.isArray(item.likes) ? item.likes : [],
        comments: Array.isArray(item.comments) ? item.comments.map(comment => ({ ...comment, timestamp: comment.dateTimeCreated })) : [],
      }}
      liked={Array.isArray(item.likes) && item.likes.includes(token)}
      onLikePress={() => handleLike(item.id)}
    />
  ), [handleLike, token]);

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Error loading posts: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StreakHeader />
      <StatusBar barStyle="default" />
      <FlatList
        ListHeaderComponent={() => <View style={{ marginTop: StatusBar.currentHeight || 0 }} />}
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts available</Text>
            <Text style={styles.emptyEmoji}>😭</Text>
          </View>
        }
      />
    </SafeAreaView>
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
  }
});