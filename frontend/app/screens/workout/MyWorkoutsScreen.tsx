import { TextInput, StyleSheet, ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemedText } from '@/components/ThemedText';
import SearchBar from '@/components/custom/CustomSearchBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useLayoutEffect } from "react";
import PreCreatedWorkoutButton from '@/components/custom/PreCreatedWorkoutButton'
import StreakHeader from '@/components/StreakHeader';

export default function MyWorkoutsScreen() {
  const SearchBarHeader = () => {
    return (
      <View style={styles.searchContainer}>
        <Text style={styles.text}>My History</Text>
        <SearchBar></SearchBar>
      </View>
    )
    }

  return (
    <ScrollView style= {styles.safeView}>    
      <View style= {styles.container}> 
        <StreakHeader></StreakHeader>
        <View style={styles.searchContainer}>
          {/* <Text>My History</Text> */}
          <SearchBar/>
        </View>
        {/* <SafeAreaView style= {styles.safeView}> */}
          <ScrollView
            showsVerticalScrollIndicator={false}>
            <PreCreatedWorkoutButton></PreCreatedWorkoutButton>
          </ScrollView>
        {/* </SafeAreaView> */}
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  searchContainer: {
    // height: 'auto',
    marginVertical: 15,
    // gap: 8, 
    alignItems: 'center',
  },
  safeView: {
    flex:1,
    backgroundColor: '#fff',
    width:'100%',
    height: '100%', 
  },
  text: {
    fontSize: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    color:'gray',
  },
  container: {
    // width:'100%',
    // height: '100%', 
    // alignItems: 'center',
    // gap: 8, 
    // paddingBottom: 29,
    // backgroundColor: '#fff',
  },
});
