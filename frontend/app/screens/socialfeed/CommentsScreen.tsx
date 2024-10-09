import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList,
   RefreshControl,
    StatusBar,
   } from 'react-native';

// potential information to used in comments (profile picture isn't implemented yet)
interface Comment {
  id: number;
  user: string;
  content: string;
  timestamp: string;
  profilePicture?: string;
}

interface CommentItemProps {
  item: Comment;
}

// Mock data for comments
const mockComments: Comment[] = [
  { id: 1, user: 'John Doe', content: 'Great post!~', timestamp: '2023-04-20T10:30:00Z' },
  { id: 2, user: 'Bart Simpson', content: 'lookin good 💪', timestamp: '2023-04-20T11:15:00Z' },
  { id: 3, user: 'Andrew Renner', content: 'You made some awesome gains!', timestamp: '2023-04-20T12:00:00Z' },
  { id: 4, user: 'Rob H', content: 'Great post!~', timestamp: '2024-04-20T10:30:00Z' },
  { id: 5, user: 'Franky McDonald', content: 'You have terrible form bro', timestamp: '2023-06-20T12:00:00Z' },
  { id: 6, user: 'Joshua B', content: 'Great post!~', timestamp: '2024-07-20T10:30:00Z' },
  { id: 7, user: 'Ben W', content: 'You made some awesome gains! 💪🔥', timestamp: '2023-08-20T11:15:00Z' },
  { id: 8, user: 'Ethan D', content: 'Sample Comment', timestamp: '2023-09-20T12:00:00Z' },
  { id: 9, user: 'Olivia S', content: 'Great post!~', timestamp: '2023-10-20T10:30:00Z' },
  { id: 10, user: 'Megan O', content: '🔥🔥🔥🔥', timestamp: '2023-11-20T11:15:00Z' },
  { id: 11, user: 'Frank F', content: 'Crushed my leg day today too! Feeling the burn 🔥🔥', timestamp: '2023-04-20T12:00:00Z' },
];

const CommentItem = ({ item }: CommentItemProps) => (
  <View style={styles.commentItem}>
    <Text style={styles.commentUser}>{item.user}</Text>
    <Text style={styles.commentText}>{item.content}</Text>
  </View>
);

const CommentsScreen = () => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // Put logic for fetching new comments here
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderItem = useCallback(({ item }: { item: Comment }) => <CommentItem item={item} />, []);

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={() => <View style={{ marginTop: StatusBar.currentHeight || 0 }} />}
        data={comments}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<Text>No comments yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  commentItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commentUser: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333333',
  },
  commentText: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 20,
  },
});

export default CommentsScreen;