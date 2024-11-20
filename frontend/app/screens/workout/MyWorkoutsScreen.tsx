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

// Workout data structure
interface Workout {
  id: string;
  name: string;
  exercises: {
    name: string;
    sets: { reps: string; weight: string }[];
  }[];
}

export default function MyWorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const context = useContext(GlobalContext);
  const navigation = useNavigation();

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
        if (workout.exerciseIds && workout.exerciseIds.length > 0) {
          const exercises = await fetchExercisesDetails(workout.exerciseIds);
          return {
            id: workout.workoutsId,
            name: workout.name || "Untitled Workout",
            exercises,
          };
        }
        return {
          id: workout.workoutsId,
          name: workout.name || "Untitled Workout",
          exercises: [],
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
  const updateWorkoutName = async (workoutId: number, newName: string) => {
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
  
      // Refresh workouts after update
      fetchWorkouts();
    } catch (error) {
      console.error("Error updating workout:", error);
    }
  };
  const deleteWorkout = async (workoutId: number) => {
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
  
      // Refresh workouts after deletion
      fetchWorkouts();
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
            name: data.name,
            sets: data.sets.map((set: any) => ({
              reps: set.reps || "0",
              weight: set.weight || "0",
            })),
          };
        })
      );
  
      console.log("Mapped exercises payload:", exercises);
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
      {/* Workout Name */}
      <Text style={styles.workoutTitle}>{item.name}</Text>
  
      {/* Update Workout Name Button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => updateWorkoutName(parseInt(item.id), "New Workout Name")}
      >
        <Text style={styles.updateButtonText}>Update Name</Text>
      </TouchableOpacity>
  
      {/* Delete Workout Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteWorkout(parseInt(item.id))}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
  
      {/* View Details Button */}
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
                          Set {index + 1}: {set.reps} reps, {set.weight} lbs
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
