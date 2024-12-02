import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { ProfileStackParamList } from "@/app/(tabs)/ProfileStack";
import { httpRequests } from "@/api/httpRequests";

type PostItemType = {
  id: string;
  type: "text" | "image";
  content?: string;
  imageUrl?: string;
  caption?: string;
  user: {
    name: string;
    profilePicture: any;
    id?: string;
  };
  dateTimeCreated: string;
  likes: string[];
  numberOfLikes: number;
  comments: Array<{
    id: string;
    content: string;
    postId: string;
    accountId: string;
    dateTimeCreated: string;
  }>;
  // Add userProfile for debugging
  userProfile?: {
    id?: string;
    username?: string;
  } | null;
};

type ItemProps = {
  item: PostItemType;
  liked: boolean;
  onLikePress: () => void;
  onCommentPress: () => void;
};

const formatTimestamp = (dateTimeCreated: string): string => {
  //console.log("Original Timestamp:", dateTimeCreated);

  const trimmedTimestamp = dateTimeCreated.includes(".")
    ? dateTimeCreated.split(".")[0] +
      "." +
      dateTimeCreated.split(".")[1].slice(0, 3)
    : dateTimeCreated;

  const date = new Date(trimmedTimestamp);
  //console.log("Date:", date);

  if (isNaN(date.getTime())) {
    console.warn("Invalid date:", trimmedTimestamp);
    return "Invalid Date";
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const PostItem = ({ item, liked, onLikePress, onCommentPress }: ItemProps) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const context = useContext(GlobalContext);

  console.log("[DEBUG] PostItem received:", {
    id: item.id,
    user: item.user,
    rawName: item.user.name,
  });

  const handleUsernamePress = () => {
    const userProfile = item.userProfile;

    if (!userProfile || !userProfile.id) {
      console.log("Navigation failed: No userProfile available", { item });
      return;
    }

    // Navigate to VisitProfileScreen directly with userProfile data
    navigation.navigate("VisitProfileScreen", { item: userProfile });
  };

  const handlePostPress = () => {
    if (item.type === "text") {
      navigation.navigate("TextPostScreen", {
        postId: item.id,
        content: item.content,
      });
    } else if (item.type === "image") {
      navigation.navigate("ImagePostScreen", {
        postId: item.id,
        imageUrl: item.imageUrl,
      });
    }
  };

  return (
    <View style={styles.item}>
      {/* Header */}
      <TouchableOpacity onPress={handleUsernamePress}>
        <View style={styles.header}>
          <Image style={styles.profile} source={item.user.profilePicture} />
          <Text style={styles.username}>{item.user.name}</Text>
        </View>
      </TouchableOpacity>

      {/* Content */}
      {item.type === "text" && item.content && (
        <Text style={styles.contentText}>{item.content}</Text>
      )}
      {item.type === "image" && item.imageUrl && (
        <Image style={styles.postImage} source={{ uri: item.imageUrl }} />
      )}
      {item.type === "image" && item.caption && (
        <Text style={styles.caption}>{item.caption}</Text>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.likecomment}>
          <TouchableOpacity
            onPress={onLikePress}
            style={styles.likeButton}
            accessibilityLabel="Like post"
            accessibilityHint="Toggles the like state for this post"
          >
            <Ionicons
              name="heart"
              size={24}
              color={liked ? "#FF3B30" : "#B1B6C0"}
            />
          </TouchableOpacity>
          <Text style={styles.likeCounter}>{item.numberOfLikes}</Text>

          <TouchableOpacity
            onPress={onCommentPress}
            style={styles.commentButton}
            accessibilityLabel="Open comments"
            accessibilityHint="Opens the comments for this post"
          >
            <Ionicons name="chatbubble" color="#B1B6C0" size={23} />
          </TouchableOpacity>
          <Text style={styles.commentCounter}>{item.comments.length}</Text>
        </View>
        <Text style={styles.timestamp}>
          {formatTimestamp(item.dateTimeCreated)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    borderColor: "#B1B6C0",
    borderWidth: 1,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 7,
  },
  contentText: {
    fontSize: 16,
    marginTop: 5,
    lineHeight: 22,
  },
  postImage: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    resizeMode: "cover",
  },
  caption: {
    fontSize: 16,
    marginTop: 5,
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  timestamp: {
    fontSize: 13,
    color: "#999",
    alignSelf: "flex-end",
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
    flexDirection: "row",
    alignItems: "center",
  },
  likeCounter: {
    color: "black",
    padding: 7,
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 30,
  },
  commentCounter: {
    color: "black",
    padding: 7,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PostItem;
