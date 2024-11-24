import React, { Component, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import { DrawerActions, NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { httpRequests } from '@/api/httpRequests';
import { GlobalContext, ProfileObject } from '@/context/GlobalContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ProfileScreenNavigationProp } from '../../(tabs)/ProfileStack';
import GraphScreen from './GraphScreen'
import { ProfileContext } from '@/context/ProfileContext';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

const Tab = createMaterialTopTabNavigator();

const Drawer = createDrawerNavigator();


function getDateRange() {
  // Get the current date
  const currentDate = new Date();

  // Set endYear and endMonth to the current year and month
  const endYear = currentDate.getFullYear();
  const endMonth = currentDate.getMonth() + 1; // getMonth() is zero-based

  // Calculate last month's date
  const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 4, 1);

  // Set startYear and startMonth to the year and month of last month
  const startYear = lastMonthDate.getFullYear();
  const startMonth = lastMonthDate.getMonth() + 1; // Adjust for zero-based month

  // Return the results
  return { startYear, startMonth, endYear, endMonth };
}


const uploadPhoto = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      console.log("myURI: ", imageUri);
      const resizedUri = await resizeImage(imageUri, 250);

      const base64 = await FileSystem.readAsStringAsync(resizedUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return (base64);
    }
  } catch (error) {
    console.error("Error picking or resizing image:", error);
  }
};

const resizeImage = async (uri: string, maxDimension: number): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxDimension } }], // Resize only width to maintain aspect ratio
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    console.log("Resized Image URI:", result.uri);
    return result.uri;
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
};



const ProfileTabs = () => {
  return (
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#40bcbc', height:"100%"}, // Customize the active tab indicator color
          tabBarLabelStyle: { fontWeight: 'bold'},
          tabBarStyle: { overflow: "hidden", alignSelf:"center", backgroundColor: 'white', width:"80%", borderColor:'#40bcbc', borderRadius:50, borderWidth:2, marginBottom:10 }, // Tab bar background
          tabBarIndicatorContainerStyle: {},
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#40bcbc",
        }}
        style={styles.nav}
      >
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Photos" component={PhotosScreen} />
        <Tab.Screen name="Posts" component={PostsScreen} />
        
      </Tab.Navigator>
  );
}

function PhotosScreen() {
  const context = useContext(GlobalContext)
  const images:any = [
    { id: '1', img: require('../../../assets/images/profile/Profile.png') },
    { id: '2', img: require('../../../assets/images/profile/Profile.png') },

  ];
  
  const handlePhoto = async () => {
    const base64Image = await uploadPhoto();
    if (base64Image) {
      try {
        console.log(`${httpRequests.getBaseURL()}/userProfile/photo`)
        const response = await fetch(`${httpRequests.getBaseURL()}/userProfile/photo`, {
          method: 'POST', // Set method to POST
          headers: {
            'Content-Type': 'application/json', // Set content type to JSON
            "Authorization": `Bearer ${context?.data.token}`,
          },
          body: JSON.stringify(base64Image), // Convert the data to a JSON string
        }); // Use endpoint or replace with BASE_URL if needed
        if (!response.ok) {
          const text = await response.text()
          console.log(text)
          throw new Error(`Error: ${response.status}`);
        }
        const json = await response.json()
        console.log(json)

      } catch (error) {
        console.error(error)
      }
      //setSelectedImage(base64Image);
    }
  };


  return (
    <View style={{width:'100%', flex:1, backgroundColor:'#fff'}}>
<View style={styles.photosContainer}>
  <FlatList
    data={images}
    keyExtractor={(item) => item.id}
    numColumns={3} // Adjust the number of columns as needed
    renderItem={({ item }) => (
      <Image source={item.img} style={styles.photo} />
    )}
    contentContainerStyle={{
      justifyContent: 'flex-start',
      alignItems: 'flex-start', // Align items to the left
      paddingTop: 10,
      backgroundColor: "#fff",
    }} 
    ListFooterComponent={
      <TouchableOpacity style={styles.addPhotoButton} onPress={handlePhoto}>
      <Ionicons name="add" size={30} color="#fff" />
    </TouchableOpacity>
    }
    showsVerticalScrollIndicator={true}
  />
</View>
</View>
  );
}

function PostsScreen() {
  const [requested, setRequested] = useState(false);
  const [returned, setReturned] = useState(false);

  const [postIds, setPostIds] = useState<number[]>([]); // Explicitly define type as number[]
  const [posts, setPosts] = useState<Post[]>([]);

  const context = useContext(GlobalContext)

  const [refreshing, setRefreshing] = React.useState(false);
  
  const [loadingMore, setLoadingMore] = useState(false)

  const [postsPerLoad, setPostsPerLoad] = useState(9)

  const [AllPostsLoaded, setAllPostsLoaded] = useState(false)

  let [currentEndIndex, setCurrentEndIndex] = useState(postsPerLoad)


  interface Post {
    numberOfLikes: number;
    dateTimeCreated: string;
    id: number;
    content: string;
    userProfile: ProfileObject;
    userIdsOfLikes: number[];
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setLoadingMore(false);
    setAllPostsLoaded(false)
    await setCurrentEndIndex(postsPerLoad);
    await fetchPostList(0, postsPerLoad);
    setTimeout(() => {
      setRefreshing(false);
    },  0);
  }, []);

  const fetchPostList = async (startIndex: number, endIndex: number, clear:boolean = true) => {
    try {
      const response = await fetch(`${httpRequests.getBaseURL()}/socialPost/getPostsFromAccountId/${14}/${startIndex}/${endIndex}`, {
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
      const json = await response.json() //.json(); // Parse the response as JSON
      if (clear) {
        setPosts(json)
      } else {
        setPosts((prevPosts) => [...prevPosts, ...json]);
      }
      setReturned(true);
      return json; // Return the JSON data directly
    } catch (error) {
      setReturned(true);
      setLoadingMore(false);
      setAllPostsLoaded(true)
      // If access denied
      // Send to login page
  
      //console.error('GET request failed:', error);
      //throw error; // Throw the error for further handling if needed
    }
    }





  if (!requested) {
    setRequested(true);
    fetchPostList(0, currentEndIndex);
  }

  // Fetch details for each post based on postIds
  /*useEffect(() => {
    if (!requested) {
      setRequested(true);
      const fetchPosts = async () => {
        try {
          // Fetch details for the first 10 post IDs
          const first10Posts = await fetchPostList(0, 10);
          setPosts(first10Posts);
        } catch (error) {
          console.error('Error fetching post details:', error);
        }
      };
      fetchPosts();
    }
  }, [requested, postIds]);*/

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
  const renderPostItem = ({ item: post }: { item: Post }) => (
    <View style={styles.postItem}>
      <Image
        source={{ uri: `data:image/png;base64,${post.userProfile.profilePicture}` }}
        style={styles.postAvatar}
      />
      <View style={styles.postContent}>
        <Text style={styles.postText}>{post.content}</Text>
        <View style={styles.postFooter}>
          <View style={styles.likeCommentContainer}>
            <Ionicons name="heart" size={24} color="#FF3B30" />
            <Text style={styles.likeCounter}>{post.numberOfLikes}</Text>
          </View>
          <Text style={styles.dateText}>{formatTimestamp(post.dateTimeCreated)}</Text>
        </View>
      </View>
    </View>
  );

  const handleLoadMore = async () => {
    if (returned && !loadingMore && !AllPostsLoaded) {
    setLoadingMore(true)
    let start = currentEndIndex+1;
    await fetchPostList(start, currentEndIndex + postsPerLoad, false);
    setCurrentEndIndex(currentEndIndex + postsPerLoad);
    setLoadingMore(false)
    // Fetch or load more data here
    }
  };
  
  const renderFooter = () => {
    if (!returned || loadingMore) {
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } else {
    return null
  }
  };

  //refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
  return (
    <View style={styles.postView}>
      {true ? 
            <FlatList
            data={posts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderPostItem}
            //contentContainerStyle={styles.postsContainer} // Optional, to style the FlatList container
            contentContainerStyle={{
              alignItems: 'center',
              paddingTop:10,
              backgroundColor:"#fff",
            }}
            showsVerticalScrollIndicator={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            //columnWrapperStyle={{ padding: 0, margin: 0 }}
          />
      :
      <ActivityIndicator size="large" color="#40bcbc" />
      
      }

    </View>
  );
}



function ProgressScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const context = useContext(GlobalContext);
  const [loadingDates, setLoadingDates] = useState<Date[]>([])

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  let spacerKey = 100
  const renderCalendarDay = (day: number, month: number, year: number, type: number) => { 
    let myStyle;
    let textStyle;
    if (day == 0) {
      spacerKey++;
      day = spacerKey;
    }

    if (type == 1) {
        myStyle = styles.activeDay
    } else if (type == 2) {
        myStyle = styles.restDay
    } else if (type == 3) {
        myStyle = styles.inactiveDay
    } else if (type == 4) {
        myStyle = styles.upcomingDay
        textStyle = styles.dayTextOverwrite;
    } else if (type == 5) {
        myStyle = styles.hiddenDay
        textStyle = styles.hiddenDayText;
    }
    return (
     
    <View style={[styles.day, myStyle]} key={day}>
      <Text style={[styles.dayText,textStyle]}>{day}</Text>
    </View>
  );}

  const getActivityType = (myDate: Date): number => {
    if (context && context.calendar[formatDate(myDate)]) {
      // If date is in context, use the context date
      return context.calendar[formatDate(myDate)];
    } else if (new Date(myDate) < new Date()) {
      // If date is not in context and is before today, return 3
      return 3;
    } else {
      // If date is today or after, return 4
      return 4;
    }
  };
  const addLoadingDate = (date: Date) => {
    setLoadingDates((prevLoadingDates) => {
      // Check if the date already exists in the array
      const exists = prevLoadingDates.some((d) => d.getTime() === date.getTime());
      // If not, append the date; otherwise, return the previous state
      return exists ? prevLoadingDates : [...prevLoadingDates, date];
    });
  };
  const adjustDate = (year: number, month: number) => {
    // Handle month overflows and underflows
    const adjustedDate = new Date(year, month);
    return {
      year: adjustedDate.getFullYear(),
      month: adjustedDate.getMonth() + 1, // Convert to 1-based month
    };
  };
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger re-render
  const Calendar = () => {
    const daysInMonth = new Date(myDate.getFullYear(), myDate.getMonth(), 0).getDate(); // Directly calculate days
    
    React.useEffect(() => {
      console.log('Calendar refreshed!');
      console.log(context?.calendar)
    }, [refreshKey]);


    if (context) {
      const loadedStartDate = new Date(context.calendarLoadTracker.startDate)
      if (new Date(loadedStartDate.getFullYear(), loadedStartDate.getMonth() + 2, loadedStartDate.getDate()) > myDate) {
        const exists = loadingDates.some((d) => d.getTime() === myDate.getTime());
        if (!exists) {
          const startDate = adjustDate(myDate.getFullYear(), myDate.getMonth() - 3); // Subtract 3 months
        const endDate = adjustDate(loadedStartDate.getFullYear(), loadedStartDate.getMonth() + 1); // Add 1 month

        // Call the function with the corrected date ranges
        context?.loadCalendarDays({
          startYear: startDate.year,
          startMonth: startDate.month,
          endYear: endDate.year,
          endMonth: endDate.month,
        });
      }
    }
      if (loadedStartDate > myDate) {
        return (<ActivityIndicator size="large" color="#00ff00" />)
      }
    }
    
    let spacers: JSX.Element[] = [];
    const calendarDays = [...Array(daysInMonth)].map((_, i) => {
      const day = i + 1;
  
      if (i === 0) {
        const firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1).getDay(); // Get first weekday of the month
        for (let j = 0; j < firstDay; j++) {
          spacers.push(renderCalendarDay(0, myDate.getFullYear(), myDate.getMonth(), 5)); // Render empty spacers
        }
      }
      //if date is in context
      //use context date
      //else if date is not in context
      //if date is before today, 3
      //if date is today or after, 4
      return (
        <React.Fragment key={i}>
          {renderCalendarDay(day, myDate.getFullYear(), myDate.getMonth(), getActivityType(new Date(myDate.getFullYear(), myDate.getMonth(), day)))}
        </React.Fragment>
      );
    });
    return (     <View style={styles.calendarContainer}><View style={styles.daysContainer}>
      {spacers}
      {calendarDays}
    </View></View>);
  }

    const [myDate, setMyDate] = useState(new Date(Date.now()));
    //const [year, setYear] = useState(today.getFullYear())
    //const [month, setMonth] = useState(today.getMonth())
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const setToFirstOfPreviousMonth = () => {
      const date = new Date(myDate);
      date.setMonth(date.getMonth() - 1);
      date.setDate(1);
      setMyDate(date);
    };
    
    // Set myDate to the 1st of the next month
    const setToFirstOfNextMonth = () => {
      const date = new Date(myDate);
      date.setMonth(date.getMonth() + 1);
      date.setDate(1);
      setMyDate(date);
    };

    const useRestDay = async () => {
      if (context && context?.userProfile.restDaysLeft > 0) {
        const currentRestDays = context?.userProfile.restDaysLeft
          context?.updateUserProfile({
            ...context.userProfile, // Spread existing userProfile to retain all required fields
            restDaysLeft: Math.max((context.userProfile?.restDaysLeft || 0) - 1, 0),
          });
        
        
          const today = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-MM-dd format

          try {
            const response = await fetch(`${httpRequests.getBaseURL()}/calendar/logRestDay?date=${today}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json', // Set content type to JSON
                "Authorization": `Bearer ${context?.data.token}`, // Replace with the correct token
              },
            });
        
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Error: ${response.status} - ${errorText}`);
            }
        
            const result = await response.text();
            console.log('Rest day logged successfully:', result);
            //context?.clearCalendar()
            const dateRange = getDateRange();
            await context?.loadCalendarDays(dateRange)
            setRefreshKey((prevKey) => prevKey + 1);
          } catch (error) {
            context?.updateUserProfile({
              ...context.userProfile, // Spread existing userProfile to retain all required fields
              restDaysLeft: currentRestDays, //change failed. Reset local data.
            });

            console.error('Error logging rest day:', error);
          }
        };



      }

  return (
    <ScrollView>
    <View style={styles.calendar}>
    <View style={styles.calendarHeader}>
      <TouchableOpacity  onPress={setToFirstOfPreviousMonth}>
      <Ionicons name="chevron-back-outline" size={24} />
      </TouchableOpacity>
      <View style={styles.minWidth}>
      <Text style={styles.month}>{monthNames[myDate.getMonth()]} {myDate.getFullYear()}</Text>
      </View>
      <TouchableOpacity  onPress={setToFirstOfNextMonth}>
      <Ionicons name="chevron-forward-outline" size={24} />
      </TouchableOpacity>
    </View>

   
    <Calendar/>

    <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
  <Text>Rest Days Remaining: {context?.userProfile.restDaysLeft}</Text>
  <TouchableOpacity
    style={{
      marginLeft: 10,
      backgroundColor: '#e3c067',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5, // Adds shadow on Android
    }}
    onPress={useRestDay}
  >
    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Use Rest Day</Text>
  </TouchableOpacity>
</View>


    <View style={styles.links}>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate("GraphScreen")}>
          <Text style={styles.linkText}>Graphs</Text>
          <Ionicons name="chevron-forward-outline" size={24} style={styles.linkIcon}/>
        </TouchableOpacity>
    </View>

  </View>
  </ScrollView>
  );
}

function CustomDrawerContent({navigation} : any) {
  const drawerNav = async (navigation : any) => {
    navigation.closeDrawer()
    navigation.navigate('SettingsScreen');
  }

  const context = useContext(GlobalContext)
  return (
    <View style={styles.drawerContent}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          // Navigate to Settings screen or handle accordingly
          drawerNav(navigation)
          //navigation.navigate('SettingsScreen');
        }}
      >
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          // Handle logout logic here
          navigation.closeDrawer();
          context?.setToken("");
          // Perform logout actions
        }}
      >
        <Text style={styles.drawerItemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const MainScreen = () => {
  const context = useContext(GlobalContext)
  const ProfContext = useContext(ProfileContext)
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [adding, setAdding] = useState<number[]>([])


  useFocusEffect(
    useCallback(() => {
      ProfContext?.reloadFriendRequests(); // Example: Fetch profile data or perform actions

      // Optionally, return a cleanup function if needed
      return () => {

      };
    }, [])
  );


const handleAddFriend = () => {
  navigation.navigate("FriendsScreen")
}

const handleAcceptFriendRequest = async (id: any) => {
    //Get Account ID
    //Send Request to Account ID
  if (adding.indexOf(id) == -1) {
    setAdding((prevNumbers) => [...prevNumbers, id]);
  try {
    const response = await fetch(`${httpRequests.getBaseURL()}/friends/addFriend/${id}`, {
      method: 'POST', // Set method to POST
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
        "Authorization": `Bearer ${context?.data.token}`,
      },
      body: "", // Convert the data to a JSON string
    }); // Use endpoint or replace with BASE_URL if needed
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const json = await response.text() //.json(); // Parse the response as JSON
    //return json; // Return the JSON data directly
  } catch (error) {
    console.error('GET request failed:', error);
    throw error; // Throw the error for further handling if needed
  }
  setAdding((prev) => {
    const updated = [...prev];
    updated.splice(prev.indexOf(id), 1); // Remove the item
    return updated; // Return the updated array
  });
  }
}

const handlePressOutside = () => {
  ProfContext?.setRequestsOpen(false)
};
  return (

    <View style={styles.bg}>
      
      <Modal
      visible={ProfContext?.requestsOpen}
      transparent={true}
      animationType="fade" // Optional: adds a fade animation
      onRequestClose={() => ProfContext?.setRequestsOpen(false)}
    >
      <View style={styles.modalOverlay}>
        {/* Touchable area for dismissing the modal */}
        <TouchableWithoutFeedback onPress={handlePressOutside}>
          <View style={styles.overlayTouchable} />
        </TouchableWithoutFeedback>

        {/* Modal Content */}
        <View style={styles.popup}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            {ProfContext && ProfContext?.requestingFriends?.length > 0 ? (
              ProfContext?.requestingFriends.map((friend, index) => (
                <View
                  key={index}
                  style={[
                    styles.friendRequestItem,
                    index === ProfContext?.requestingFriends?.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <Image source={{ uri: `data:image/png;base64,${friend.profilePicture}` }} style={styles.friendReqAvatar} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{friend.displayname}</Text>
                    <Text style={styles.friendUsername}>@{friend.username}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAcceptFriendRequest(friend.id)}
                  >
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noRequests}>No friend requests.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
      <View style={styles.container}>


      <View style={styles.center}>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image source={{  uri: `data:image/png;base64,${context?.userProfile.profilePicture}`}} style={styles.avatar} />
          <Text style={styles.name}>{context?.userProfile.displayname}</Text>
          {context?.userProfile.bio ? (
  <View style={styles.bioStyle}>
    <TouchableOpacity
      onPress={() => {
        if (context?.userProfile) {
          navigation.navigate('FullBioScreen', { userProfile: context.userProfile });
        } else {
          console.error('User profile is undefined.');
        }
      }}
    >
      <Text style={styles.bio}>
        {context?.userProfile.bio.slice(0, 50)}{' >'}
      </Text>
    </TouchableOpacity>
  </View>
) : null}

          <View style={styles.friendsContainer}>
            <View style={styles.friendsSection}>
              <View style={styles.friendsList}>

{context?.friends.length === 0 ? (
  // Render "Add Friend" button when there are no friends
  <View style={styles.addFriendContainer}>
    <TouchableOpacity style={styles.addFriendButton} onPress={handleAddFriend}><Text><Ionicons name="person-add"/> Add Friend</Text></TouchableOpacity>
  </View>
) : (
  // Render the FlatList if there are friends
  <View>
  <TouchableOpacity style={styles.addFriendButtonOverlay} onPress={handleAddFriend}>
  <FlatList
  horizontal
  data={context?.friends.slice(0, 4)} // Display only the first 4 friends
  keyExtractor={(_, index) => index.toString()} // Use index as the key
  renderItem={({ item, index }) => (
    <Image source={{uri: `data:image/png;base64,${item.profilePicture}` }} style={[styles.friendAvatar, { zIndex: 5 - index }]} />
  )}
  ListFooterComponent={
    context && context?.friends.length > 4 ? (
      <View style={[styles.moreFriends, { marginLeft: -15 }]}>
        <Text style={styles.moreFriendsText}>+{context?.friends.length - 4}</Text>
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
        </View>
      </View>
    </View>
    <View style={styles.tabContainer}>
    <ProfileTabs />
    </View>

      {/* Navigation Links 
      <View style={styles.links}>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Food Log</Text>
          <Ionicons name="chevron-forward-outline" size={24} style={styles.linkIcon}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Graphs</Text>
          <Ionicons name="chevron-forward-outline" size={24} style={styles.linkIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Account Settings</Text>
          <Ionicons name="chevron-forward-outline" size={24} style={styles.linkIcon}/>
        </TouchableOpacity>
      </View>
*/}
</View>
  );
}


const ProfileScreen: React.FC = () => {
const navigation = useNavigation<ProfileScreenNavigationProp>();
const ProfContext = useContext(ProfileContext)

return (
  <Drawer.Navigator
  screenOptions={{
    drawerPosition: 'left',
  }}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen name="Profile" component={MainScreen} options={({ navigation }) => ({
          headerShown: true,
          headerTitleAlign: 'center', // Center the header title
          headerTitle:"",
          headerRight: () => <View style={{marginRight:15}}><TouchableOpacity onPress={() => {ProfContext?.setRequestsOpen(!ProfContext?.requestsOpen)}}><Ionicons name="notifications-outline" size={24}></Ionicons>{ ProfContext && ProfContext?.requestingFriends?.length > 0 ? <View style={styles.pendingFriend}></View> : <></>}</TouchableOpacity></View>/*() => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="menu" size={24} />
            </TouchableOpacity>
          ),*/
        })}
      />
  </Drawer.Navigator>
);
};

const styles = StyleSheet.create({
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  modalOverlay: {
  flex: 1,
  top:20,
  //backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  justifyContent: 'center',
  alignItems: 'center',
},

  popup: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex:5,
    marginTop: 20,
    position: 'absolute',
    top: 0, // Adjust as needed
    bottom: 0,
    height:'30%',
    width:'90%',
    alignSelf: 'center',
  },
  
  friendRequestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  friendReqAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendUsername: {
    fontSize: 14,
    color: '#888',
  },
  acceptButton: {
    backgroundColor: '#40bcbc',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    zIndex: 10, // Ensure it's on top
    elevation: 5, // For Android
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noRequests: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  



  addFriendContainer: {

  },
  addFriendButton: {
    backgroundColor:"#ececed",
    paddingVertical:8,
    paddingHorizontal:8,
    borderRadius:10
  },
  addFriendButtonOverlay: {
    margin:0,
    padding:0,
  },
  pendingFriend: {
    backgroundColor:"red",
    width:10,
    height:10,
    position:"absolute",
    right:0,
    borderRadius:5 
  },
  drawerContent: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  drawerItem: {
    padding: 20,
  },
  drawerItemText: {
    fontSize: 18,
  },
  postsContainer: {
  flex:1,
  //backgroundColor:"red",
  padding: 0,
   margin:0,
  },
  postContent: {
    paddingTop:15,
    flex: 1,
  },
  bioStyle: {
    flexDirection:'row'
  },
  postText: {
    fontSize: 16,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom:0,
  },
  likeCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likecomment: {
    flexDirection: 'row',
    alignItems: 'center',
    position:"relative",
    bottom:0,
    left:15,
    marginTop:10,
  },
  likeCounter: {
    color: 'black',
    padding: 7,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    bottom:0,
    right:15
    
  },
  avatarView: {
    height:"100%",
    justifyContent:"center",
    paddingBottom:10,
  }, 
  textView: {
    justifyContent:'center',
    alignContent:"center",
    alignItems:"center",
    width:"70%",
    //height:"100%",
    marginLeft:5,
    marginBottom:25,
    marginTop:10,
    borderRadius:15,
    //backgroundColor:"red",
    //backgroundColor:"#eee"
  },
  postAvatar: {
    width: 60,
    height: 60,
    marginLeft:10,
    marginTop:10,
    borderRadius: 30,
    marginRight: 10,
  },
  postItem: {
    marginBottom:10,
    width:"80%",
    minHeight:80,
    backgroundColor:"#eee",
    borderWidth:1,
    borderColor:"#ddd",
    borderRadius:10,
    flexDirection:"row",
  },
  photosContainer: {
    flex: 1, // Allows FlatList to take up full height and be scrollable
    padding: 0,
    margin:0,
    alignItems:'center',
  },
  addPhotoButton: {
    width: 100, // Adjust as needed for your layout
    height: 100,
    borderRadius: 10,
    margin:9,
    backgroundColor: '#40bcbc', // Attractive green color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Adds shadow on Android
  },
  
  photo: {
    width: 100, // Adjust as needed for your layout
    height: 100,
    borderRadius: 10,
    margin:9,
  },
  bg: {
    flex:1,
    backgroundColor:"#fff",
  },
  tabContainer: {
    flex:1,
    width:"100%",
    alignItems:"center",
    backgroundColor:"#fff"
  },
  container: {  backgroundColor:"#fff"},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  center: {
    alignItems:'center',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  profileSection: { alignItems: 'center', marginTop: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  bio: { fontSize: 13, fontWeight: 'bold', marginVertical: 0 },
  friendsContainer: { },
  friendsSection: { flexDirection: 'row', marginTop: 10},
  friendsLabel: { marginRight: 10, fontSize: 16 },
  friendAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 5 },
  moreFriends: {
    width: 40,
    height: 40,
    zIndex: 0,
    marginBottom:10,
    borderRadius: 20,
    backgroundColor: '#e9e8e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: { height:"10%", width:"100%", marginTop:5,marginBottom:5, backgroundColor:"#fff", flex:1},
  moreFriendsText: { fontWeight: 'bold' },
  friendsList: {alignContent:'center'},
  calendar: { paddingTop: 20, paddingBottom:20, alignItems: 'center' , width:'100%', backgroundColor:"white", height:"100%"},
  calendarHeader: { flexDirection: 'row', alignItems: 'center' , paddingBottom:'2%'},
  minWidth: { minWidth:'50%', alignItems:'center'},
  month: { marginHorizontal: 10, fontSize: 18, fontWeight: 'bold' },
  daysRow: { },
  calendarContainer: {
    //backgroundColor:"red",
    alignItems:"center",
    width:"90%",
    aspectRatio:1.166
  },
  daysContainer: {paddingLeft:"4%",flexDirection: 'row', flexWrap: 'wrap', justifyContent:'flex-start', width:'95%', height:"auto", alignItems: 'center', aspectRatio:1.1},
  day: { width: "11.42%", aspectRatio:1, margin: 4, borderRadius: 20, alignItems: 'center', justifyContent:'center' },
  
  activeDay: { backgroundColor: "#63c782" },
  inactiveDay: { backgroundColor: '#ff2434' },
  restDay: { backgroundColor: '#f4d47c' },
  upcomingDay:  { backgroundColor: '#f0ecec', color:'black'},
  dayText: { color: '#fff', fontWeight: 'bold' },
  dayTextOverwrite: { color: 'black', fontWeight: 'bold' },
  hiddenDay:  { backgroundColor: 'white', borderColor:'black', borderWidth:1, color:'black', opacity:0},
  hiddenDayText: { color: '#', fontWeight: 'bold', opacity:0 },
  links: { marginHorizontal: 16, width:'100%' },
  link: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  linkText: { fontSize: 18, paddingLeft:'5%' },
  linkIcon:{
    paddingRight:'5%'
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  postView: {
    backgroundColor:"#eee",
    flex: 1, // Allows FlatList to take up full height and be scrollable
    padding: 0,
    margin:0,
    //backgroundColor:"#fff",
    //alignItems:"center",
  },
});

export default ProfileScreen;
