import React, {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
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
} from "react-native";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useSocialFeed, SocialPostComment } from "@/context/SocialFeedContext";
import ProfileImage from "../../../assets/images/profile/Profile.png";

//Interface for external control of the CommentsSheet
export interface CommentsSheetRef {
  snapToIndex: (index: number) => void;
  close: () => void;
  showCommentsForPost: (postId: string) => void;
}

//Props for individual comment items in the list
interface CommentItemProps {
  comment: SocialPostComment;
  onReply?: () => void;
}

/**
 * Formats a date string into a human-readable relative time
 * @param dateString - ISO date string to format
 * @returns Formatted string like "just now", "5m ago", "2h ago", etc.
 */
const formatCommentTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "just now";
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

/**
 * A bottom sheet component for displaying and managing comments on social posts.
 * Uses forwardRef to expose methods for external control of the sheet.
 */
const CommentsSheet = forwardRef<CommentsSheetRef>((props, ref) => {
  // State Management
  const [commentText, setCommentText] = useState("");
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Context and Refs
  const { posts, addComment } = useSocialFeed();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const inputRef = useRef<TextInput>(null);

  // How far up on the screen the bottom sheet will go
  const snapPoints = React.useMemo(() => ["85%"], []);

  // Get current post and it's comments
  const currentPost = posts.find((post) => post.id === currentPostId);
  const comments = currentPost?.comments || [];

  // Expose methods for external control
  useImperativeHandle(ref, () => ({
    snapToIndex: (index: number) => {
      console.log("Snapping to index:", index);
      setIsOpen(true);
      bottomSheetRef.current?.snapToIndex(index);
    },
    close: () => {
      console.log("Closing comments sheet");
      Keyboard.dismiss();
      setIsOpen(false);
      bottomSheetRef.current?.close();
      setCurrentPostId(null);
    },
    showCommentsForPost: (postId: string) => {
      console.log("Opening comments for post:", postId);
      setCurrentPostId(postId);
      setIsOpen(true);
      bottomSheetRef.current?.snapToIndex(0);
    },
  }));

  /**
   * Handles submission of a new comment
   * Adds the comment to the post and clears the input
   */
  const handleSubmitComment = async () => {
    if (commentText.trim() && currentPostId) {
      console.log("[DEBUG] Submitting comment:", {
        postId: currentPostId,
        commentText: commentText,
      });

      try {
        console.log("[DEBUG] Calling addComment...");
        await addComment(currentPostId, commentText);
        console.log("[DEBUG] addComment completed");

        const updatedPost = posts.find((p) => p.id === currentPostId);
        console.log("[DEBUG] Post state after API call:", updatedPost);

        setCommentText("");
        Keyboard.dismiss();
      } catch (error) {
        console.error("[DEBUG] Error in handleSubmitComment:", error);
      }
    }
  };

  /**
   * Handles changes in the bottom sheet position
   * Updates state and keyboard when sheet is closed
   */
  const handleSheetChange = useCallback((index: number) => {
    console.log("Sheet index changed to:", index);
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
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>
          </View>

          {/* Comments list */}
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

          {/* Comment input section */}
          <View style={styles.inputContainer}>
            <Image source={ProfileImage} style={styles.inputAvatar} />
            <View style={styles.textInputContainer}>
              <BottomSheetTextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Add a comment"
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={1000}
                onSubmitEditing={handleSubmitComment}
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
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentContainer: {
    flexDirection: "row",
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentUsername: {
    fontWeight: "600",
    marginRight: 8,
  },
  commentTime: {
    color: "#666",
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
    color: "#666",
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "flex-end",
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: "row",
    //alignItems: "flex-end",
    alignItems: "center",
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    fontSize: 14,
    paddingVertical: 9,
  },
  sendButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#21BFBF",
    fontWeight: "600",
  },
});

export default CommentsSheet;
