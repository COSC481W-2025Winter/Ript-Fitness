import { TextInput, StyleSheet, ScrollView, Text, View, Dimensions } from "react-native";
import SearchBar from '@/components/custom/CustomSearchBar';
import React, { useEffect, useLayoutEffect, useState } from "react";
import PreCreatedWorkoutButton from '@/components/custom/PreCreatedWorkoutButton'
import StreakHeader from '@/components/StreakHeader';
import { SavedWorkoutButton } from "@/components/custom/SavedWorkoutButton";
import workouts from '@/app/screens/riptworkouts/RiptWorkouts';
import { FlatList } from "react-native-gesture-handler";

export default function RiptWorkoutsScreen() {

  const SearchBarHeader = () => {
    return (
      <View style={styles.searchContainer}>
        <Text style={styles.text}>Ript Database</Text>
        <SearchBar></SearchBar>
      </View>
    )
    }

    return (
        <View style={styles.container}>
            <StreakHeader></StreakHeader>
            <SearchBarHeader></SearchBarHeader>
            <FlatList style={styles.workoutContainer}
                data={workouts}
                renderItem={({ item }) => (
                    <SavedWorkoutButton
                        key={item.id}
                        title={item.name}
                        level={item.level}
                        time={item.time} 

                    />
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
      );
}


const styles = StyleSheet.create({
  searchContainer: {
    margin: 10,
    gap: 8, 
  },
  workoutContainer: {
    flex:1,
    flexDirection:"row",
    flexWrap:"wrap",
  },
  text: {
    fontSize: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    color:'gray',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 8, 
  },
  columnWrapper: {
    justifyContent: 'space-between',
  }
});
