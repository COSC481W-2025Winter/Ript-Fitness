import React, {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  Keyboard,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSocialFeed, SocialPostComment } from '@/context/SocialFeedContext';
import ProfileImage from '../../../assets/images/profile/Profile.png';

export interface CommentsSheetRef {
  snapToIndex: (index: number) => void;
  close: () => void;
  showCommentsForPost: (postId: string) => void;
}

interface CommentItemProps {
  comment: SocialPostComment;
  onReply?: () => void;
}

const formatCommentTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

const CommentItem = ({ comment, onReply }: CommentItemProps) => (
  <View style={styles.commentContainer}>
    <Image source={ProfileImage} style={styles.commentAvatar} />
    <View style={styles.commentContent}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUsername}>{comment.accountId}</Text>
        <Text style={styles.commentTime}>
          {formatCommentTime(comment.dateTimeCreated)}
        </Text>
      </View>
      <Text style={styles.commentText}>{comment.content}</Text>
      <TouchableOpacity style={styles.replyButton} onPress={onReply}>
        <Text style={styles.replyButtonText}>Reply</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const CommentsSheet = forwardRef<CommentsSheetRef>((props, ref) => {
  const [commentText, setCommentText] = useState('');
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const { posts, addComment } = useSocialFeed();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const snapPoints = React.useMemo(() => ['85%'], []);

  const currentPost = posts.find(post => post.id === currentPostId);
  const comments = currentPost?.comments || [];

  useImperativeHandle(ref, () => ({
    snapToIndex: (index: number) => {
      console.log('Snapping to index:', index);
      setIsOpen(true);
      bottomSheetRef.current?.snapToIndex(index);
    },
    close: () => {
      console.log('Closing comments sheet');
      Keyboard.dismiss();
      setIsOpen(false);
      bottomSheetRef.current?.close();
      setCurrentPostId(null);
    },
    showCommentsForPost: (postId: string) => {
      console.log('Opening comments for post:', postId);
      setCurrentPostId(postId);
      setIsOpen(true);
      bottomSheetRef.current?.snapToIndex(0);
    },
  }));

  const handleSubmitComment = async () => {
    if (commentText.trim() && currentPostId) {
      await addComment(currentPostId, commentText);
      setCommentText('');
      Keyboard.dismiss();
    }
  };

  const handleSheetChange = useCallback((index: number) => {
    console.log('Sheet index changed to:', index);
    if (index === -1) {
      Keyboard.dismiss();
      setIsOpen(false);
      setCurrentPostId(null);
    } else {
      setIsOpen(index === 0);
    }
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={handleSheetChange}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CommentItem
                comment={item}
                onReply={() => {
                  inputRef.current?.focus();
                  setCommentText(`@${item.accountId} `);
                }}
              />
            )}
            contentContainerStyle={styles.commentsList}
          />

          <View style={styles.inputContainer}>
            <Image source={ProfileImage} style={styles.inputAvatar} />
            <View style={styles.textInputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Add a comment"
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={1000}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !commentText.trim() && styles.sendButtonDisabled,
                ]}
                onPress={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUsername: {
    fontWeight: '600',
    marginRight: 8,
  },
  commentTime: {
    color: '#666',
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  replyButton: {
    marginTop: 4,
  },
  replyButtonText: {
    color: '#666',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'flex-end',
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 50,
    fontSize: 14,
  },
  sendButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#21BFBF',
    fontWeight: '600',
  },
});

export default CommentsSheet;