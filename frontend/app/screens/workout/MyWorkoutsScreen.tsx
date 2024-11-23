import React, { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { GlobalContext } from "@/context/GlobalContext";
import { Workout } from "@/context/GlobalContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";

// Define navigation types for MyWorkoutsScreen
type WorkoutStackParamList = {
  StartWorkoutScreen: { workout: Workout };
  MyWorkoutsScreen: undefined;
};

export default function MyWorkoutsScreen() {
  const context = useContext(GlobalContext);
  const navigation = useNavigation<NavigationProp<WorkoutStackParamList>>();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    context.fetchWorkouts();
  }, []);

  const openModal = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedWorkout(null);
    setIsModalVisible(false);
  };

  const startWorkout = () => {
    if (selectedWorkout) {
      closeModal(); // Close the modal before navigating
      navigation.navigate("StartWorkoutScreen", { workout: selectedWorkout });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Workouts</Text>
      <FlatList
        data={context.workouts}
        keyExtractor={(item, index) => item.id ? `${item.id}` : `workout-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.workoutItem}
            onPress={() => openModal(item)}
          >
            <Text style={styles.workoutName}>{item.name}</Text>
            <Text>Exercises: {item.exercises.length}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedWorkout && (
              <>
                <Text style={styles.modalTitle}>{selectedWorkout.name}</Text>
                <FlatList
                  data={selectedWorkout.exercises || []}
                  keyExtractor={(item, index) =>
                    item.exerciseId ? `${item.exerciseId}` : `exercise-${index}`
                  }
                  renderItem={({ item }) => (
                    <View style={styles.exerciseItem}>
                      <Text style={styles.exerciseName}>{item.nameOfExercise}</Text>
                      {item.reps.map((rep, index) => (
                        <Text key={index} style={styles.setDetails}>
                          Set {index + 1}: {rep} reps, {item.weight[index] || 0} lbs
                        </Text>
                      ))}
                    </View>
                  )}
                />
                <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
                  <Text style={styles.startButtonText}>Start Workout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  workoutItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  workoutName: { fontSize: 18, fontWeight: "bold" },
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
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  exerciseItem: { marginBottom: 15 },
  exerciseName: { fontSize: 18, fontWeight: "bold" },
  setDetails: { fontSize: 16, color: "gray" },
  startButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  startButtonText: { color: "white", fontSize: 16 },
  closeButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: { color: "white", fontSize: 16 },
});
