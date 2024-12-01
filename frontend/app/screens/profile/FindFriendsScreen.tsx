import React, { useContext, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '@/context/GlobalContext';
import { httpRequests } from '@/api/httpRequests';
import { useNavigation } from '@react-navigation/native';
import DEFAULT_PROFILE_PICTURE from '@/assets/base64/defaultPicture';
import { ProfileContext } from '@/context/ProfileContext';


export interface FriendObject {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  displayname: string;
  bio: string;
  profilePicture: string;
  isDeleted: false;
  restDays: number;
  restDaysLeft: number;
  restResetDate: string;
  restRestDayOfWeek: number;
}

const FindFriendsScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
const context = useContext(GlobalContext)
const [loading, setLoading] = useState(false);
const [adding, setAdding] = useState<number[]>([])



const [potentialFriends, setPotentialFriends] = useState<FriendObject[]>([]);



const updatePotentialFriends = (newFriends: FriendObject[]) => {
  setPotentialFriends((prevFriends) => 
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

  const filteredPotentialFriends = potentialFriends.filter((friend: any) =>
    friend.username.toLowerCase().includes(search.toLowerCase())
  );


  

  const searchForFriends = async () => {
    if (search.length >= 3) {
      try { 
        setLoading(true)
      const response = await fetch(`${httpRequests.getBaseURL()}/userProfile/search?searchTerm=${search}&startIndex=0&endIndex=10`, {
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
      const json = await response.json()
      updatePotentialFriends(json)
      setLoading(false)
    } catch (error) {
      // If access denied
      // Send to login page
      //context?.setToken("")
      console.error('0003 GET request failed:', error);
      setLoading(false)
      throw error; // Throw the error for further handling if needed
    }
    }
  }
  const profContext = useContext(ProfileContext)
  const sendFriendRequest = async (id: number, username: string) => {
    //Get Account ID
    console.log(id)
    //Send Request to Account ID
   const request = {
      "accountIdOfToAccount": id,
      "status": "SENT"
  }
  if (adding.indexOf(id) == -1 && !profContext?.sentFriendRequests.includes(username)) {
    setAdding((prevNumbers) => [...prevNumbers, id]);
  try {
    const response = await fetch(`${httpRequests.getBaseURL()}/friendRequest/sendNewRequest`, {
      method: 'POST', // Set method to POST
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
        "Authorization": `Bearer ${context?.data.token}`,
      },
      body: JSON.stringify(request), // Convert the data to a JSON string
    }); // Use endpoint or replace with BASE_URL if needed
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json() //.json(); // Parse the response as JSON
    profContext?.handleAddSentFriendRequest(username)
    //return json; // Return the JSON data directly
  } catch (error) {
    console.error('GET request failed:', error);
    throw error; // Throw the error for further handling if needed
  } finally {
  setAdding((prev) => {
    const updated = [...prev];
    updated.splice(prev.indexOf(id), 1); // Remove the item
    return updated; // Return the updated array
  });
}
  }
}

  const renderItem = ({ item }: any) => { 
    return (

    <View style={styles.friendItem}>
      <TouchableOpacity style={{flex:1, flexDirection:'row', alignItems: 'center'}} onPress={() => {navigation.navigate("VisitProfileScreen", {item})}}>
        <Image source={{ uri: `data:image/png;base64,${item.profilePicture}` }} style={styles.profileImage} />
        <View style={{flex:1}}>
        <Text style={styles.friendName}>{item.displayname}</Text>
        <Text style={styles.friendUserName}>@{item.username}</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity
  style={[
    styles.addButton,
    (adding.includes(item.id) || 
     context?.friends.some((friend) => friend.id === item.id) || 
     profContext?.sentFriendRequests.includes(item.username)) && styles.disabledButton
  ]}
  onPress={() => sendFriendRequest(item.id, item.username)}
  disabled={
    adding.includes(item.id) ||
    context?.friends.some((friend) => friend.id === item.id) ||
    profContext?.sentFriendRequests.includes(item.username)
  }
>
  <Text style={styles.addButtonText}>
    {adding.includes(item.id)
      ? "Sending..."
      : context?.friends.some((friend) => friend.id === item.id)
      ? "Already Friends"
      : profContext?.sentFriendRequests.includes(item.username)
      ? "Request Sent"
      : "Send Request"}
  </Text>
</TouchableOpacity>

    </View>
  );}

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: Platform.OS === "ios" ? 30 : 0, // Add paddingTop for iOS
            height: Platform.OS === "ios" ? 80 : 60,    // Adjust header height if necessary
            backgroundColor: 'white', }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Find Friends</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search Potential Friends"
        value={search}
        onChangeText={setSearch}
        onEndEditing={searchForFriends}
        returnKeyType="search"
      />

      {/* Potential Friends List */}


      {loading ? (
  <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
) : filteredPotentialFriends.length > 0 ? (
  <FlatList
    data={filteredPotentialFriends}
    keyExtractor={(item) => item.id}
    renderItem={renderItem}
    contentContainerStyle={styles.list}
  />
) : (
  <View style={[styles.emptyStateContainer]}>
    <Text style={styles.emptyStateText}>Search for friends to add!</Text>
  </View>
)}

      




    </View>
  );
};

const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1, // Make the container fill the entire available space
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Center the content horizontally
    marginBottom:'25%'
  },
  emptyStateText: {
    textAlign: "center",
  },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  loader: {
    marginTop: 20,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 8 },
  searchBar: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    margin: 16,
    borderRadius: 8,
  },
  list: { paddingHorizontal: 16 },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold', 
},

  friendUserName: {     
    fontSize: 14,
    color: '#888', 
},
addButton: {
  backgroundColor: '#40bcbc',
  padding: 10,
  borderRadius: 5,
  alignItems: "center",
},
disabledButton: {
  backgroundColor: "#d3d3d3", // Light grey
},
addButtonText: {
  color: "white",
  fontWeight: "bold",
},
});

export default FindFriendsScreen;
