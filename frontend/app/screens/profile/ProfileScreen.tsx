import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { httpRequests } from '@/api/httpRequests';
import { GlobalContext } from '@/context/GlobalContext';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ProfileScreenNavigationProp } from '../../(tabs)/ProfileStack';
import GraphScreen from './GraphScreen'

const Tab = createMaterialTopTabNavigator();

const Drawer = createDrawerNavigator();
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
  const images:any = [
    { id: '1', img: require('../../../assets/images/profile/Profile.png') },
    { id: '2', img: require('../../../assets/images/profile/Profile.png') },
    { id: '3', img: require('../../../assets/images/profile/Profile.png') },
    { id: '4', img: require('../../../assets/images/profile/Profile.png') },
    { id: '5', img: require('../../../assets/images/profile/Profile.png') },
    { id: '6', img: require('../../../assets/images/profile/Profile.png') },
    { id: '7', img: require('../../../assets/images/profile/Profile.png') },
    { id: '8', img: require('../../../assets/images/profile/Profile.png') },
    { id: '9', img: require('../../../assets/images/profile/Profile.png') },
    { id: '10', img: require('../../../assets/images/profile/Profile.png') },
    { id: '11', img: require('../../../assets/images/profile/Profile.png') },
    { id: '12', img: require('../../../assets/images/profile/Profile.png') },
    { id: '13', img: require('../../../assets/images/profile/Profile.png') },
    { id: '14', img: require('../../../assets/images/profile/Profile.png') },
    { id: '15', img: require('../../../assets/images/profile/Profile.png') },
    { id: '16', img: require('../../../assets/images/profile/Profile.png') },
    { id: '17', img: require('../../../assets/images/profile/Profile.png') },
    { id: '18', img: require('../../../assets/images/profile/Profile.png') },
  ];


  return (
    <View style={styles.photosContainer}>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        numColumns={3} // Adjust the number of columns as needed
        renderItem={({ item }) => (
          <Image source={item.img} style={styles.photo} />
        )}
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop:10,
          backgroundColor:"#fff",
        }}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}

function PostsScreen() {
  const [requested1, setRequested1] = useState(false);
  const [returned1, setReturned1] = useState(false);
  const [requested2, setRequested2] = useState(false);
  const [returned2, setReturned2] = useState(false);

  const [postIds, setPostIds] = useState<number[]>([]); // Explicitly define type as number[]
  const [posts, setPosts] = useState<Post[]>([]);

  const context = useContext(GlobalContext)

  const [refreshing, setRefreshing] = React.useState(false);


  interface Post {
    numberOfLikes: number;
    dateTimeCreated: string;
    //id: number;
    content: string;
    // Add other fields as needed
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const fetchPostsList = async () => {
  try {
    const response = await fetch(`${httpRequests.getBaseURL()}/socialPost/getPostsFromAccountId`, {
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
    setPostIds(json)
    setReturned1(true);

    //return json; // Return the JSON data directly
  } catch (error) {
    setReturned1(true);
    // If access denied
    // Send to login page

    console.error('GET request failed:', error);
    throw error; // Throw the error for further handling if needed
  }
  }



  const fetchPost = async (id: number) => {
    try {
      console.log(`${httpRequests.getBaseURL()}/socialPost/getPost/${id}`)
      const response = await fetch(`${httpRequests.getBaseURL()}/socialPost/getPost/${id}`, {
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
      setPostIds(json)
      setReturned2(true);
      return json; // Return the JSON data directly
    } catch (error) {
      setReturned2(true);
      // If access denied
      // Send to login page
  
      console.error('GET request failed:', error);
      throw error; // Throw the error for further handling if needed
    }
    }





  if (!requested1) {
    fetchPostsList();
    setRequested1(true);
  }

  // Fetch details for each post based on postIds
  useEffect(() => {
    if (returned1 && !requested2) {
      setRequested2(true);
      const fetchPosts = async () => {
        try {
          // Fetch details for the first 10 post IDs
          const first10Posts = await Promise.all(
            postIds.slice(0, 10).map((id) => fetchPost(id))
          );
          setPosts(first10Posts);
        } catch (error) {
          console.error('Error fetching post details:', error);
        }
      };
      fetchPosts();
    }
  }, [returned1, requested2, postIds]);

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
        source={require('../../../assets/images/profile/Profile.png')}
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
  
  
  //refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
  return (
    <View style={styles.postView}>
      {returned2? 
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


  const Calendar = () => {
    const daysInMonth = new Date(myDate.getFullYear(), myDate.getMonth(), 0).getDate(); // Directly calculate days
    let spacers: JSX.Element[] = [];
    const calendarDays = [...Array(daysInMonth)].map((_, i) => {
      const day = i + 1;
  
      if (i === 0) {
        const firstDay = new Date(myDate.getFullYear(), myDate.getMonth(), 1).getDay(); // Get first weekday of the month
        for (let j = 0; j < firstDay; j++) {
          spacers.push(renderCalendarDay(0, myDate.getFullYear(), myDate.getMonth(), 5)); // Render empty spacers
        }
      }
      return (
        <React.Fragment key={i}>
          {renderCalendarDay(day, myDate.getFullYear(), myDate.getMonth(), i > 10 ? 4 : exampleDays[i])}
        </React.Fragment>
      );
    });
    return (     <View style={styles.calendarContainer}><View style={styles.daysContainer}>
      {spacers}
      {calendarDays}
    </View></View>);
  }
  
  let exampleDays = [1,2,3,1,3,1,2,2,3,1,1]

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
  //const navigation = useNavigation<ProfileScreenNavigationProp>();
  const context = useContext(GlobalContext)
  return (
    <View style={styles.drawerContent}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          // Navigate to Settings screen or handle accordingly
          navigation.closeDrawer();
          navigation.navigate('ApiScreen');
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
  const friends:any = [
    { id: '1', avatar: require('../../../assets/images/profile/Profile.png') },
    { id: '2', avatar: require('../../../assets/images/profile/Profile.png') },
    { id: '3', avatar: require('../../../assets/images/profile/Profile.png') },
  ];
  return (
    <View style={styles.bg}><View style={styles.container}>
      <View style={styles.center}>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image source={require('../../../assets/images/profile/Profile.png')} style={styles.avatar} />
          <Text style={styles.name}>Steve</Text>
          <View style={styles.friendsContainer}>
            <View style={styles.friendsSection}>
              <Text style={styles.friendsLabel}>Friends:</Text>
              <View style={styles.friendsList}>
                <FlatList
                  horizontal
                  data={friends}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <Image source={item.avatar} style={styles.friendAvatar} />
                  )}
                  ListFooterComponent={<View style={styles.moreFriends}>
                    <Text style={styles.moreFriendsText}>+1</Text>
                  </View>}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View style={{ width: 0 }} />} />
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
          headerRight: () => <View style={{ marginRight: 15 }} />/*() => (
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
  name: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  friendsContainer: {alignItems:'center',alignContent:'center',},
  friendsSection: { flexDirection: 'row', alignItems: 'center', marginTop: 10},
  friendsLabel: { marginRight: 10, fontSize: 16 },
  friendAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 5 },
  moreFriends: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9e8e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: { height:"10%", width:"100%", marginTop:5,marginBottom:5, backgroundColor:"#fff", flex:1},
  moreFriendsText: { fontWeight: 'bold' },
  friendsList: {width:"auto"},
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
