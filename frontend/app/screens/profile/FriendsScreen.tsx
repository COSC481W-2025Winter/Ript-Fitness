import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const friendsData = [
  { id: '1', name: 'gymbroo', imageUrl: 'https://example.com/image1.jpg' },
  { id: '2', name: 'muscleman99', imageUrl: 'https://example.com/image2.jpg' },
  { id: '3', name: 'yoga4life', imageUrl: 'https://example.com/image3.jpg' },
  { id: '4', name: 'gymfluence', imageUrl: 'https://example.com/image4.jpg' },
];

const FriendsScreen = ({ navigation } : any) => {
  const [search, setSearch] = useState('');

  const filteredFriends = friendsData.filter(friend => 
    friend.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item } : any) => (
    <View style={styles.friendItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
      <Text style={styles.friendName}>{item.name}</Text>
      <TouchableOpacity style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Friends</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search Friends"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredFriends}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <View style={styles.navbar}>
        <Ionicons name="home-outline" size={24} color="gray" />
        <Ionicons name="star-outline" size={24} color="gray" />
        <Ionicons name="arrow-up-outline" size={24} color="gray" />
        <Ionicons name="person-outline" size={24} color="blue" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
  friendName: { flex: 1, fontSize: 16 },
  removeButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: { color: '#888' },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default FriendsScreen;
