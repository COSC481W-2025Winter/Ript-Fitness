import React, { useState, useEffect, useContext } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { GlobalContext } from "@/context/GlobalContext";
import { WorkoutScreenNavigationProp } from '@/app/(tabs)/WorkoutStack';

// Workout data structure
interface Workout {
  id?: number; // Optional ID
  name: string;
  exerciseIds: number[];
  exercises?: Exercise[]; // Optional array of exercise details
}
interface Exercise {
  nameOfExercise: string;
  sets: number;
  weight: number[]; // Changed from string to number for better type handling
  reps: number[];

}

export default function MyWorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const context = useContext(GlobalContext);
  const navigation = useNavigation<WorkoutScreenNavigationProp >();

  // Fetch workouts from the backend
const fetchWorkouts = async () => {
  try {
    const response = await fetch(
      `http://ript-fitness-app.azurewebsites.net/workouts/getUsersWorkouts`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${context?.data.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch workouts: ${response.statusText}`);
    }

    const data: any[] = await response.json();
    console.log("Fetched workouts data:", JSON.stringify(data, null, 2));

    const transformedWorkouts: Workout[] = await Promise.all(
      data.map(async (workout) => {
        const exercises =
          workout.exerciseIds && workout.exerciseIds.length > 0
            ? await fetchExercisesDetails(workout.exerciseIds)
            : [];
    
        return {
          id: workout.workoutsId, // Ensure 'id' is assigned correctly
          name: workout.name || "Untitled Workout",
          exerciseIds: workout.exerciseIds || [], // Default to an empty array if missing
          exercises, // Ensure this is always present
        };
      })
    );
    
    console.log("Transformed workouts:", transformedWorkouts);
    setWorkouts(transformedWorkouts);
  } catch (error) {
    console.error("Error fetching workouts:", error);
  }
};

  
  const fetchWorkoutDetails = async (workoutId: number) => {
    try {
      const response = await fetch(
        `http://ript-fitness-app.azurewebsites.net/workouts/${workoutId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${context?.data.token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch workout: ${response.statusText}`);
      }
  
      const workout = await response.json();
      console.log("Fetched workout details:", workout);
  
      return workout;
    } catch (error) {
      console.error("Error fetching workout details:", error);
      return null;
    }
  };
  const updateWorkoutName = async (workoutId: number | undefined, newName: string) => {
    if (!workoutId) {
      console.error("Workout ID is required to update the name.");
      return;
    }
    try {
      const payload = { name: newName };
      const response = await fetch(
        `http://ript-fitness-app.azurewebsites.net/workouts/updateWorkout/${workoutId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context?.data.token}`,
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to update workout: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Workout updated successfully:", data);
      fetchWorkouts(); // Refresh the list after update
    } catch (error) {
      console.error("Error updating workout:", error);
    }
  };
  
  const deleteWorkout = async (workoutId: number | undefined) => {
    if (!workoutId) {
      console.error("Workout ID is required to delete.");
      return;
    }
    try {
      const response = await fetch(
        `http://ript-fitness-app.azurewebsites.net/workouts/deleteWorkout/${workoutId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${context?.data.token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to delete workout: ${response.statusText}`);
      }
  
      console.log("Workout deleted successfully");
      fetchWorkouts(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };
  
  const fetchExercisesDetails = async (exerciseIds: number[]) => {
    try {
      const responses = await Promise.all(
        exerciseIds.map((id) =>
          fetch(`http://ript-fitness-app.azurewebsites.net/exercises/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${context?.data.token}`,
            },
          })
        )
      );
  
      const exercises = await Promise.all(
        responses.map(async (response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch exercise: ${response.statusText}`);
          }
          const data = await response.json();
          return {
            nameOfExercise: data.nameOfExercise,
            sets: data.sets,
            reps: data.reps,
            weight: data.weight,
          }; // Match the format used in Start Workouts
        })
      );
  
      return exercises;
    } catch (error) {
      console.error("Error fetching exercise details:", error);
      return [];
    }
  };
  
  

  // Fetch workouts when the screen is loaded
  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Open modal with selected workout details
  const openWorkoutModal = async (workout: Workout) => {
    try {
      const exercises = await fetchExercisesDetails(workout.exerciseIds);
      setSelectedWorkout({ ...workout, exercises }); // Add exercises to the workout object
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching exercises for workout:", error);
    }
  };
  

  // Close the modal
  const closeWorkoutModal = () => {
    setSelectedWorkout(null);
    setModalVisible(false);
  };

  // Navigate to AddWorkoutScreen when the plus button is clicked
  const navigateToAddWorkout = () => {
    navigation.navigate("AddWorkoutScreen",{  });
  };

  const SearchBarHeader = () => {
    return (
      <View style={styles.searchContainer}>
        <Text style={styles.text}>My History</Text>
        <TextInput
          style={styles.input}
          placeholder="Search workouts..."
          placeholderTextColor="gray"
        />
        <TouchableOpacity style={styles.plusButton} onPress={navigateToAddWorkout}>
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderWorkout = ({ item }: { item: Workout }) => (
    <View style={styles.workoutBox}>
      <Text style={styles.workoutTitle}>{item.name}</Text>
      {item.id && (
        <>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => updateWorkoutName(item.id, "New Workout Name")}
          >
            <Text style={styles.updateButtonText}>Update Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteWorkout(item.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => openWorkoutModal(item)}
      >
        <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <SafeAreaView style={styles.container}>
      <StreakHeader />
      <SearchBarHeader />
      <FlatList
        data={workouts}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : `${item.name}-${index}`)}
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
                          data={selectedWorkout?.exercises || []} // Use fetched exercises
                          keyExtractor={(item, index) => `${item.nameOfExercise}-${index}`}
                          renderItem={({ item }) => (
                            <View style={styles.exerciseItem}>
                              <Text style={styles.exerciseName}>{item.nameOfExercise}</Text>
                              {Array.from({ length: item.sets }).map((_, index) => (
                                <Text key={index} style={styles.setDetails}>
                                  Set {index + 1}: {item.reps[index] || 0} reps, {item.weight[index] || 0} lbs
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
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "gray",
  },
  plusButton: {
    backgroundColor: "green",
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
  updateButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "white",
    fontSize: 14,
  },
  
  deleteButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
  },
  
  detailsButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "white",
    fontSize: 14,
  },
  
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
