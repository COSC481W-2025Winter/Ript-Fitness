import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type PostItemType = {
  id: string;
  type: 'text' | 'image';
  content?: string;
  imageUrl?: string;
  caption?: string;
  user: {
    name: string;
    profilePicture: string;
  };
  timestamp: string;
};

type ItemProps = {
  item: PostItemType;
  liked: boolean;
  onLikePress: () => void;
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, //converts to 12 hour format
  });
};

const PostItem = ({ item, liked, onLikePress }: ItemProps) => {
  const navigation = useNavigation<NavigationProp<any>>();

  const handlePostPress = () => {
    if (item.type === 'text') {
      navigation.navigate('TextPostScreen', { postId: item.id, content: item.content });
    } else if (item.type === 'image') {
      navigation.navigate('ImagePostScreen', { postId: item.id, imageUrl: item.imageUrl });
    }
  };

  const handleCommentPress = () => {
    navigation.navigate('CommentsScreen', { postId: item.id });
  };


  return (
    <TouchableOpacity onPress={handlePostPress}
    >
      <View style={styles.item}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.profile} source={{ uri: item.user.profilePicture }} />
          <Text style={styles.username}>{item.user.name}</Text>
        </View>

        {/* Content */}
        {item.type === 'text' && item.content && (
          <Text style={styles.contentText}>{item.content}</Text>
        )}
        {item.type === 'image' && item.imageUrl && (
          <Image style={styles.postImage} source={{ uri: item.imageUrl }} />
        )}
        {item.type === 'image' && item.caption && (
          <Text style={styles.caption}>{item.caption}</Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>

          <View style={styles.likecomment}>
            <TouchableOpacity 
              onPress={onLikePress} 
              style={styles.likeButton}
              accessibilityLabel="Like comment"
              accessibilityHint="Toggles the like state for this comment"
              >
              <Ionicons name="heart" size={24} color={liked ? '#FF3B30' : '#B1B6C0'} />
            </TouchableOpacity>
            <Text style={styles.likeCounter}>120</Text>
            <TouchableOpacity 
            onPress={handleCommentPress} 
            style={styles.commentButton}
            accessibilityLabel="Open comments"
            accessibilityHint="Opens the comments screen for this post"
            >
            <Ionicons name="chatbubble" color="#B1B6C0" size={23} />
            </TouchableOpacity>
            <Text style={styles.commentCounter}>9</Text>
          </View>
          <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
        </View>
        
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderColor: '#B1B6C0',
    borderWidth: 1,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 7,
  },
  contentText: {
    fontSize: 16,
    marginTop: 5,
    lineHeight: 22,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  caption: {
    fontSize: 16,
    marginTop: 5,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  timestamp: {
    fontSize: 13,
    color: '#999',
    alignSelf: 'flex-end',
  },
  likeButton: {
    padding: 7,
    borderRadius: 10,
  },
  commentButton: {
    padding: 7,
    borderRadius: 10,
  },
  likecomment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCounter: {
    color: 'black',
    padding: 7,
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentCounter: {
    color: 'black',
    padding: 7,
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default PostItem;