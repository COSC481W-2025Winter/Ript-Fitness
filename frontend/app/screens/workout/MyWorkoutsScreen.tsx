import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StreakHeader from "@/components/StreakHeader";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation for navigation

//  workout data structure
interface Workout {
  id: string;
  name: string;
  exercises: {
    name: string;
    sets: { reps: string; weight: string }[];
  }[];
}

const sampleWorkouts: Workout[] = [
  {
    id: "1",
    name: "Full Body Workout",
    exercises: [
      { name: "Push Ups", sets: [{ reps: "10", weight: "-" }] },
      { name: "Squats", sets: [{ reps: "15", weight: "-" }] },
    ],
  },
  {
    id: "2",
    name: "Leg Day",
    exercises: [
      { name: "Lunges", sets: [{ reps: "12", weight: "20lbs" }] },
      { name: "Deadlift", sets: [{ reps: "8", weight: "100lbs" }] },
    ],
  },
];

export default function MyWorkoutsScreen() {
  const navigation = useNavigation(); // Hook for navigation

  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // Open modal with selected workout details
  const openWorkoutModal = (workout: Workout) => {
    setSelectedWorkout(workout);
    setModalVisible(true);
  };

  // Close the modal
  const closeWorkoutModal = () => {
    setSelectedWorkout(null);
    setModalVisible(false);
  };

  // Navigate to AddWorkoutScreen when the plus button is clicked
  const navigateToAddWorkout = () => {
    navigation.navigate("AddWorkoutScreen"); 
  };

  const SearchBarHeader = () => {
    return (
      <View style={styles.searchContainer}>
        <Text style={styles.text}>My History</Text>
        {/* Placeholder SearchBar component */}
        <TextInput
          style={styles.input}
          placeholder="Search workouts..."
          placeholderTextColor="gray"
        />
        {/* Green Plus Button */}
        <TouchableOpacity style={styles.plusButton} onPress={navigateToAddWorkout}>
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderWorkout = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      style={styles.workoutBox}
      onPress={() => openWorkoutModal(item)}
    >
      <Text style={styles.workoutTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StreakHeader />
      <SearchBarHeader />
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkout}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Modal for showing workout details */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeWorkoutModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedWorkout ? (
              <>
                <Text style={styles.modalTitle}>{selectedWorkout.name}</Text>
                <FlatList
                  data={selectedWorkout.exercises}
                  keyExtractor={(item, index) => `${item.name}-${index}`}
                  renderItem={({ item }) => (
                    <View style={styles.exerciseItem}>
                      <Text style={styles.exerciseName}>{item.name}</Text>
                      {item.sets.map((set, index) => (
                        <Text key={index} style={styles.setDetails}>
                          Set {index + 1}: {set.reps} reps, {set.weight}
                        </Text>
                      ))}
                    </View>
                  )}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeWorkoutModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    height: "auto",
    margin: 10,
    gap: 8,
  },
  text: {
    fontSize: 20,
    fontFamily: "Courier",
  },
  input: {
    height: 40,
    width: "80%", // Shortened width to make the search bar horizontally shorter
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "gray",
  },
  plusButton: {
    backgroundColor: "green", // Green button
    borderRadius: 50,
    padding: 10,
    position: "absolute",
    right: 10,
    top: 10,
  },
  plusButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 20,
  },
  workoutBox: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  exerciseItem: {
    marginBottom: 15,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  setDetails: {
    fontSize: 16,
    color: "gray",
  },
  closeButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
