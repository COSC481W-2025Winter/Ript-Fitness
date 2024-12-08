// OtherUserProfileScreen.tsx

import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FriendObject, GlobalContext } from "@/context/GlobalContext";
import { httpRequests } from "@/api/httpRequests";
import { ProfileScreenNavigationProp } from "@/app/(tabs)/ProfileStack";

const Tab = createMaterialTopTabNavigator();

interface Post {
  numberOfLikes: number;
  dateTimeCreated: string;
  content: string;
  // Add other fields as needed
}

const VisitProfileScreen: React.FC = () => {
  const context = useContext(GlobalContext);
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute();

  // Assume that the other user's profile data is passed via navigation params
  const { item } = route.params as any;

  const [addingFriend, setAddingFriend] = useState(false);
  const [DeletingFriend, setDeletingFriend] = useState(false);

  const handleAddFriend = async () => {
    if (addingFriend) return;

    setAddingFriend(true);
    try {
      context?.addFriend(item);
      const response = await fetch(
        `${httpRequests.getBaseURL()}/friends/addFriend/${item.profileID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context?.data.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      // Optionally, update the UI or state to reflect the friend request
      // For example, disable the "Add Friend" button or change its text
    } catch (error) {
      context?.removeFriend(item); //failed to add friend, remove from local data
      console.error("Error adding friend:", error);
    } finally {
      setAddingFriend(false);
    }
  };

  const handleDeleteFriend = async () => {
    if (DeletingFriend) return;

    setDeletingFriend(true);
    try {
      context?.removeFriend(item);
      const response = await fetch(
        `${httpRequests.getBaseURL()}/friends/deleteFriend/${item.profileID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context?.data.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Optionally, update the UI or state to reflect the friend request
      // For example, disable the "Add Friend" button or change its text
    } catch (error) {
      context?.addFriend(item); //failed to remove friend, add back to local data
      console.error("Error adding friend:", error);
    } finally {
      setDeletingFriend(false);
    }
  };

  if (!item) {
    // Show a loading indicator while fetching the profile
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#40bcbc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: `data:image/png;base64,${item.profilePicture}` }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{item.displayname}</Text>
        <View style={styles.bioStyle}>
          <TouchableOpacity
            onPress={() => {
              if (item) {
                navigation.navigate("FullBioScreen", { userProfile: item });
              } else {
                console.error("User profile is undefined.");
              }
            }}
          >
            <Text style={styles.bio}>
              {item.bio && item.bio?.slice(0, 50) + " >"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Friend Button */}
        <TouchableOpacity
          style={styles.addFriendButton}
          onPress={handleAddFriend}
          disabled={addingFriend}
        >
          <Text style={styles.addFriendButtonText}>
            {addingFriend
              ? "Adding..."
              : context?.friends.some(
                  (friend) => friend.username === item.username
                )
              ? "Remove Friend"
              : "Add Friend"}
          </Text>
        </TouchableOpacity>
      </View>

      {true ? <PostsScreen userId={item.id} userProfile={item} /> : null}
    </View>
  );
};

const PostsScreen: React.FC<any> = ({ userId, userProfile }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentEndIndex, setCurrentEndIndex] = useState(9);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);
  const context = useContext(GlobalContext);
  const fetchPosts = async (
    startIndex: number,
    endIndex: number,
    clear = true
  ) => {
    try {
      const response = await fetch(
        `${httpRequests.getBaseURL()}/socialPost/getPostsFromAccountId/${userId}/${startIndex}/${endIndex}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context?.data.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (clear) {
        setPosts(data);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
      }

      if (data.length < endIndex - startIndex) {
        setAllPostsLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setAllPostsLoaded(true);
    }
  };

  useEffect(() => {
    fetchPosts(0, currentEndIndex);
  }, [userId]);

  const onRefresh = async () => {
    setRefreshing(true);
    setAllPostsLoaded(false);
    setCurrentEndIndex(9);
    await fetchPosts(0, 9);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (loadingMore || allPostsLoaded) return;

    setLoadingMore(true);
    const newEndIndex = currentEndIndex + 9;
    await fetchPosts(currentEndIndex + 1, newEndIndex, false);
    setCurrentEndIndex(newEndIndex);
    setLoadingMore(false);
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
      return null;
    }
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={styles.postItem}>
      <Image
        source={
          userProfile.image
            ? { uri: userProfile.image }
            : require("../../../assets/images/profile/Profile.png")
        }
        style={styles.postAvatar}
      />
      <View style={styles.postContent}>
        <Text style={styles.postText}>{item.content}</Text>
        <View style={styles.postFooter}>
          <View style={styles.likeCommentContainer}>
            <Ionicons name="heart" size={24} color="#FF3B30" />
            <Text style={styles.likeCounter}>{item.numberOfLikes}</Text>
          </View>
          <Text style={styles.dateText}>
            {formatTimestamp(item.dateTimeCreated)}
          </Text>
        </View>
      </View>
    </View>
  );

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <View style={styles.postView}>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPostItem}
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: 10,
          backgroundColor: "#fff",
        }}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bioStyle: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#fff",
    // Positioning the header at the top
    position: "relative",
    zIndex: 10,
  },
  backButton: {
    // Style for the back button
  },
  profileSection: {
    alignItems: "center",
    marginTop: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  bioContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  bio: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  addFriendButton: {
    marginTop: 15,
    backgroundColor: "#40bcbc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addFriendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tabContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
  postView: {
    flex: 1,
    backgroundColor: "#eee",
  },
  postItem: {
    marginBottom: 10,
    width: "80%",
    minHeight: 80,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    flexDirection: "row",
  },
  postAvatar: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 30,
    marginRight: 10,
  },
  postContent: {
    paddingTop: 15,
    flex: 1,
  },
  postText: {
    fontSize: 16,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    bottom: 0,
  },
  likeCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCounter: {
    color: "black",
    padding: 7,
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    marginRight: 15,
  },
});

export default VisitProfileScreen;
