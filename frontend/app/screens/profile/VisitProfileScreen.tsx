// OtherUserProfileScreen.tsx

import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { User, UserCheck, UserMinus, UserPlus } from "react-native-feather";
import { useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FriendObject, GlobalContext } from '@/context/GlobalContext';
import { httpRequests } from '@/api/httpRequests';
import { ProfileScreenNavigationProp } from '@/app/(tabs)/ProfileStack';
import { ProfileContext } from '@/context/ProfileContext';
import DEFAULT_PROFILE_PICTURE from '@/assets/base64/defaultPicture';

const Tab = createMaterialTopTabNavigator();

interface Post {
  numberOfLikes: number;
  dateTimeCreated: string;
  content: string;
  // Add other fields as needed
}


const VisitProfileScreen: React.FC = () => {
  const context = useContext(GlobalContext);
  const profContext = useContext(ProfileContext)
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute();

  // Assume that the other user's profile data is passed via navigation params
  const { item } = route.params as any;


  const [addingFriend, setAddingFriend] = useState(false);
  const [DeletingFriend, setDeletingFriend] = useState(false);
  const [friends, setFriends] = useState<FriendObject[]>([]);
  const [loaded, setLoaded] = useState(false)

  const updateFriends = (newFriends: FriendObject[]) => {
    setFriends((prevFriends) => 
      newFriends.map((newFriend, index) => {
        const prevFriend = prevFriends[index] || {}; // Get the corresponding previous friend or an empty object
        return {
          ...prevFriend,
          ...newFriend,
          profilePicture: (newFriend.profilePicture == undefined || newFriend.profilePicture == "")
            ? DEFAULT_PROFILE_PICTURE
            : newFriend.profilePicture,
        };
      })
    );
  };

  const reloadFriends = async () => {
    try {
      const response = await fetch(`${httpRequests.getBaseURL()}/friends/getFriendsList/${item.id}`, {
        method: 'GET', // Set method to POST
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
          "Authorization": `Bearer ${context?.data.token}`,
        },
        body: "", // Convert the data to a JSON string
      }); // Use endpoint or replace with BASE_URL if needed
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const friendNames = await response.json()
      console.log(friendNames)
            try {
  
  
              const response = await fetch(`${httpRequests.getBaseURL()}/userProfile/getUserProfilesFromList`, {
                method: 'POST', // Set method to POST
                headers: {
                  'Content-Type': 'application/json', // Set content type to JSON
                  "Authorization": `Bearer ${context?.data.token}`,
                },
                body: JSON.stringify(friendNames), // Convert the data to a JSON string
              }); // Use endpoint or replace with BASE_URL if needed
              if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
              }
              const json = await response.json()
              console.log("foo " + JSON.stringify(json))
              updateFriends(json)
          
            } catch (error) {
              // If access denied
              // Send to login page
              //setToken("")
              console.error('0004 GET request failed:', error);
              throw error; // Throw the error for further handling if needed
            }
  
    } catch (error) {
      // If access denied
      // Send to login page
      //setToken("")
      console.error('0003 GET request failed:', error);
      throw error; // Throw the error for further handling if needed
    }
  }

  const handleAddFriend = async () => {
    if (addingFriend) return;

    setAddingFriend(true);
    try {
        context?.addFriend(item)
      const response = await fetch(
        `${httpRequests.getBaseURL()}/friends/addFriend/${item.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
        context?.removeFriend(item) //failed to add friend, remove from local data
      console.error('Error adding friend:', error);
    } finally {
      setAddingFriend(false);
    }
  };

  const handleDeleteFriend = async () => {
    if (DeletingFriend) return;

    setDeletingFriend(true);
    try {
    context?.removeFriend(item)
      const response = await fetch(
        `${httpRequests.getBaseURL()}/friends/deleteFriend/${item.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
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
        context?.addFriend(item)  //failed to remove friend, add back to local data
      console.error('Error adding friend:', error);
    } finally {
      setDeletingFriend(false);
    }
  };


  if (!item) {
    // Show a loading indicator while fetching the profile
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  const goBack = () => {
    navigation.goBack()
  }

  const load = async () => {
    await reloadFriends();
    setLoaded(true);
  }

  if (!loaded) {
    load();
  }
  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
  <TouchableOpacity
    onPress={goBack}
    style={styles.backButton}
  >
    <Ionicons name="arrow-back" size={24} color="#000" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>{item.username}</Text>
</View>
<View style={styles.headerBorder}></View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{uri: `data:image/png;base64,${item.profilePicture}` }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{item.displayname}</Text>
        <View style={styles.bioStyle}><TouchableOpacity 
        onPress={() => {
            if (item) {
              navigation.navigate('FullBioScreen', { userProfile: item });
            } else {
              console.error('User profile is undefined.');
            }
          }}>
            
            <Text style={styles.bio}>
  {item.bio != null
    ? `${(item.bio.split('\n')[0] || '').slice(0, 50)}`
    : ''}

{item.bio && (item.bio.length > item.bio.split('\n')[0].length || item.bio.split('\n')[0].length > 50)  ? <Text style={{ color: '#757575', fontWeight: 600 }}>{'...View more'}</Text> : <></>}
</Text>

</TouchableOpacity>

</View>
<View style={styles.friendsContainer}>
<View style={styles.friendsSection}>
<View style={styles.friendsList}>
                  {friends.length === 0 ? (
                    // Render "Add Friend" button when there are no friends
                    (loaded? <></> : <View><ActivityIndicator size="small" /></View>)
                  ) : (
                    // Render the FlatList if there are friends
                    <View>
                      <TouchableOpacity
                        style={styles.addFriendButtonOverlay}
                        onPress={() => navigation.navigate('VisitFriendsScreen', {friends : friends})}
                      >
                        <FlatList
                          horizontal
                          data={friends.slice(0, 4)} // Display only the first 4 friends
                          keyExtractor={(_, index) => index.toString()} // Use index as the key
                          renderItem={({ item, index }) => (
                            <Image
                              source={{ uri: `data:image/png;base64,${item.profilePicture}` }}
                              style={[styles.friendAvatar, { zIndex: 5 - index }]}
                            />
                          )}
                          ListFooterComponent={
                            friends.length > 4 ? (
                              <View style={[styles.moreFriends, { marginLeft: -15 }]}>
                                <Text style={styles.moreFriendsText}>
                                  +{friends.length - 4}
                                </Text>
                              </View>
                            ) : null
                          }
                          showsHorizontalScrollIndicator={false}
                          ItemSeparatorComponent={() => <View style={{ width: 0, marginLeft: -15 }} />}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                </View>
                </View>

        {/* Add Friend Button */}
        <TouchableOpacity style={[
    styles.addFriendButton,
            (context?.friends.some(friend => friend.username === item.username)
            ? styles.friendButton
            : styles.addFriendButtonStyle),


    (addingFriend || 
     context?.friends.some(friend => friend.username === item.username) || 
     profContext?.sentFriendRequests.includes(item.username)) && 
    styles.disabledButton
  ]}
            onPress={() => {
    if (addingFriend) {
      // Do nothing or show a loading indicator
    } else if (context?.friends.some(friend => friend.username === item.username)) {
      // Remove friend action
      handleDeleteFriend();
    } else if (profContext?.sentFriendRequests.includes(item.username)) {
      // Do nothing, request is pending
    } else {
      // Add friend action
      handleAddFriend();
    }
  }}
         disabled={addingFriend || profContext?.sentFriendRequests.includes(item.username)}
        >

  {context?.friends.some(friend => friend.username === item.username) ? (
          <UserCheck stroke={'#1D1B20'} strokeWidth={2.5} width={18} height={18} />
        ) : (
          profContext?.sentFriendRequests.includes(item.username) ?  <UserCheck stroke={'#1D1B20'} strokeWidth={2.5} width={18} height={18} /> :<UserPlus stroke={'#fff'} strokeWidth={2.5} width={18} height={18} /> 
        )}
          {/* <UserCheck stroke={'#1D1B20'} strokeWidth={2.5} width={18} height={18} /> */}
          <Text 
            // style={styles.addFriendButtonText}
            style={[
              styles.addFriendButtonText,
              (context?.friends.some(friend => friend.username === item.username) || profContext?.sentFriendRequests.includes(item.username))
                ? styles.friendButtonText
                : styles.addFriendButtonTextStyle,
            ]}
          >
               {addingFriend
      ? 'Adding...'
      : context?.friends.some(friend => friend.username === item.username)
      ? 'Friends'
      : profContext?.sentFriendRequests.includes(item.username)
      ? 'Requested'
      : 'Add Friend'}
          </Text>
        </TouchableOpacity>


 

      </View>

      {true ? (
          <PostsScreen
          userId={item.id}
          userProfile={item}
        />
) : null}
</View>
  );
};


const PostsScreen: React.FC<any> = ({
  userId,
  userProfile,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentEndIndex, setCurrentEndIndex] = useState(9);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false)

    const context = useContext(GlobalContext)


  const fetchPosts = async (
    startIndex: number,
    endIndex: number,
    clear = true
  ) => {
    try {
      const response = await fetch(
        `${httpRequests.getBaseURL()}/socialPost/getPostsFromAccountId/${userId}/${startIndex}/${endIndex}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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
      //console.error('Error fetching posts:', error);
      setAllPostsLoaded(true);
    } finally {
        setInitialLoadDone(true)
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
          <ActivityIndicator size="large" />
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
            userProfile.profilePicture
            ? { uri: `data:image/png;base64,${userProfile.profilePicture}` }
            : require('../../../assets/images/profile/Profile.png')
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
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <View style={styles.postView}>
        {posts.length > 0 && initialLoadDone ?       <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPostItem}
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: 10,
          backgroundColor: '#fff',
        }}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      /> : initialLoadDone ? <View style ={{flex:1, justifyContent:'center', backgroundColor:'#fff'}}><Text style={styles.emptyText}>No posts available</Text>
                  <Text style={styles.emptyEmoji}>😔</Text></View> : <ActivityIndicator size="large" color="#40bcbc" />}

    </View>
  );
};

const styles = StyleSheet.create({
    bioStyle: {
        flexDirection:'row'
      },
  container: {
    paddingTop:5,
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendsContainer: { },
  friendsSection: { flexDirection: 'row', marginTop: 10},
  emptyText: {
    fontSize: 20,
    color: "#999",
    margin: 7,
    textAlign:'center'
},
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
    // Positioning the header at the top
    position: 'relative',
    zIndex: 10,
    marginTop: Platform.OS === "ios" ? '10%' : 0
  },
  emptyEmoji: {
    fontSize: 48,
    color: "#999",
    margin: 7,
    textAlign:'center'
  },
  disabledButton: {
    backgroundColor: "#EDEDED", // Light grey
  },
    headerBorder: {
        borderBottomWidth:1,
        borderColor:'grey',
        opacity:0.5,
        marginBottom:5,
    },
    backButton: {
      position: 'absolute',
      left: 10, 
      padding: 10,
      zIndex:10,
    },
    headerTitle: {
      fontSize: 18, 
      fontWeight: 'bold',
      textAlign: 'center',
    },

  


  profileSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bioContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bio: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addFriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 7,
    marginBottom: 10,
  },
  addFriendButtonStyle: {
    backgroundColor: '#21BFBF',
  },
  friendButton: {
    backgroundColor: '#EDEDED', 
  },
  friendButtonText: {
    color: '#1D1B20'
  },
  addFriendButtonTextStyle: {
    color: '#fff'
  },
  addFriendButtonText: {
    color: '#1D1B20',
    fontWeight: 600,
    fontSize: 14,
    marginLeft: 5,
  },
  tabContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  postView: {
    flex: 1,
    backgroundColor: '#eee',
  },
  postItem: {
    marginBottom: 10,
    width: '90%',
    minHeight: 80,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    flexDirection: 'row',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 0,
  },
  likeCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCounter: {
    color: 'black',
    padding: 7,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    marginRight: 15,
  },
  addFriendContainer: {
    marginBottom: 5
  },
  addFriendButtonOverlay: {
    margin: 0,
    padding: 0,
  },
  moreFriendsText: { color: '#757575' },
  friendsList: {alignContent:'center'},
  friendAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 5, borderWidth: 1.5, borderColor: '#fff' },
  moreFriends: {
    width: 40,
    height: 40,
    zIndex: 0,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#e9e8e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VisitProfileScreen;
