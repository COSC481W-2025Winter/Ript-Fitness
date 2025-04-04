import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import { GlobalContext } from "@/context/GlobalContext";
import { Workout, Exercise } from "@/context/GlobalContext";
import TimeZone from "@/api/timeZone";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view"
import { KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Stopwatch from "./Stopwatch";
import { httpRequests } from "@/api/httpRequests";
import { WorkoutContext } from "@/context/WorkoutContext";  // Import WorkoutContext for managing workout data and state.
import { useNavigation } from "@react-navigation/native";
import PlateCalculatorScreen from "./PlateCalculatorScreen";
import { WorkoutScreenNavigationProp } from "@/app/(tabs)/WorkoutStack";


import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useRoute } from '@react-navigation/native';


export default function MyWorkoutsScreen() {
  const context = useContext(GlobalContext);
  const workoutContext = useContext(WorkoutContext); // Access workout data and state using WorkoutContext.
  //const navigation = useNavigation();
  const navigation = useNavigation<WorkoutScreenNavigationProp>();

  const isDarkMode = context?.isDarkMode;


  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [workoutName, setWorkoutName] = useState<string>("");
  const [updatedExercises, setUpdatedExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [checkboxStates, setCheckboxState] = useState<{ [key: string]: boolean }>({});

  // Stores the interval IDs for each set's timer.
  const [startTime, setStartTime] = useState<{ [key: string]: ReturnType<typeof setInterval> }>({});
  // Stores the formatted time ranges for each set.
  const [timeRanges, setTimeRanges] = useState<{ [key: string]: string }>({});
  // Tracks the elapsed time (in seconds) for the currently active timer.
  const [currentTimer, setCurrentTimer] = useState<number | null>(null);
  // Tracks the key of the currently active set being timed.
  const [activeSet, setActiveSet] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Show loading indicator
      await context?.fetchWorkouts();
      setLoading(false); // Hide loading indicator
    };
    fetchData();
  }, []);
  const startWorkout = (workout: Workout) => {
    const initialState: { [key: string]: boolean } = {}; // Explicit type for dynamic keys

    workout.exercises.forEach((exercise, exerciseIndex) => {
      exercise.reps.forEach((_, setIndex) => {
        initialState[`${exerciseIndex}-${setIndex}`] = false; // This now works
      });
    });

    setCheckboxState(initialState);
    setSelectedWorkout(workout);
    setIsTracking(true);
  };

  // Formats elapsed seconds into a readable time string (e.g., "1 hr 5 min 30 sec").
  const formatTimeRange = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hrs > 0 ? `${hrs} hr` : "",
      mins > 0 ? `${mins} min` : "",
      `${secs} sec`
    ].filter(Boolean).join(" ");
  };

  // Stops the timer for a specific set and removes its interval reference.
  const stopTimerForSet = (setKey: string) => {
    if (!startTime[setKey]) return;     // Exit if no timer is running for the set.
    clearInterval(startTime[setKey]); // Stop the timer.
    setStartTime((prev) => {
      const updated = { ...prev };
      delete updated[setKey]; // Remove the timer reference for the set.
      return updated;
    });

    // Saves the elapsed time for the specific set key.
    if (currentTimer !== null) {
      const elapsedSeconds = currentTimer; // Get the total elapsed time in seconds.
      const formattedTime = formatTimeRange(elapsedSeconds); // Convert seconds into a human-readable format

      // Update the time range in the shared context to synchronize 
      // between the view page and the start page.
      workoutContext?.setTimeRanges((prev) => ({
        ...prev,
        [setKey]: formattedTime,
      }));

      //Updates the time range in current view
      setTimeRanges((prev) => {
        const updatedTimeRanges = {
          ...prev,
          [setKey]: formattedTime, // Assign the formatted time to the corresponding set.
        };
        console.log(" Updated Time Ranges:", updatedTimeRanges); // Log the updated time ranges for debugging.
        return updatedTimeRanges;
      });
    }
    // Reset active set and timer state after stopping the timer.
    setActiveSet(null);
    setCurrentTimer(null);
  }

  //This function opens the workout edit modal by fetching full workout details (including exercises) from the backend.
  const openModal = async (workout: any) => {
    const workoutId = workout.workoutsId;
    console.log('fetched workoutID:', workoutId);
    try {
      const res = await fetch(`${httpRequests.getBaseURL()}/workouts/${workoutId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${context?.data.token}`,
        },
      });
      console.log("[DEBUG] Workout details fetch status:", res.status);
      //const errorText = await res.text();
      //console.log("[DEBUG] Workout details fetch response:", errorText);

      //if (!res.ok) throw new Error("Failed to fetch workout exercises");
      if (!res.ok) {
        const errorText = await res.text();
        console.log("[DEBUG] Workout details fetch response:", errorText);
        throw new Error("Failed to fetch workout exercises");
      }
      const fullWorkout = await res.json();
      const patchedWorkout = {
        ...workout,
        id: (workout as any).workoutsId ?? workout.id, // Compatible with old fields
      };
      setSelectedWorkout(patchedWorkout);
      setWorkoutName(patchedWorkout.name);
      setUpdatedExercises([...patchedWorkout.exercises]);


      setIsEditing(false);
      setIsModalVisible(true);
    } catch (err) {
      console.error("Error loading workout details:", err);
      Alert.alert("Error", "Failed to load workout details.");
    }
  };


  const closeModal = () => {
    // Reset modal state without persisting changes
    setIsModalVisible(false);

    // Resets timer state to prevent old data from affecting new timing.
    setStartTime({}); // Clear all active timers.
    setTimeRanges({}); // Reset recorded time ranges.

    // Revert changes if unsaved
    if (selectedWorkout) {
      setWorkoutName(selectedWorkout.name);
      setUpdatedExercises([...selectedWorkout.exercises]);
    }
    setSelectedWorkout(null);
  };

  const saveWorkout = async () => {
    if (!selectedWorkout) {
      Alert.alert("Error", "No workout selected to save.");
      return;
    }
    //refer to AddWorkoutScreen starting on line 138 for following 4 lines, from there the code was copy, pasted, and then adjusted
    if (workoutName.trim() === '') {
      Alert.alert("Error", "Workout Name cannot be empty");
      return;
    }

    try {
      // Fetch the workout ID
      const workoutId = await fetchWorkoutById(selectedWorkout.name);
      if (!workoutId) {
        Alert.alert("Error", "Failed to fetch workout ID.");
        return;
      }

      // Update the workout name
      const workoutResponse = await fetch(
        `${httpRequests.getBaseURL()}/workouts/updateWorkout/${workoutId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context?.data.token}`,
          },
          body: JSON.stringify({ name: workoutName }),
        }
      );

      if (!workoutResponse.ok) {
        throw new Error(`Failed to update workout: ${workoutResponse.statusText}`);
      }

      console.log("Workout name updated successfully");

      // Update each exercise
      for (const exercise of updatedExercises) {
        const exercisePayload = {
          exerciseId: exercise.exerciseId,
          nameOfExercise: exercise.nameOfExercise,
          reps: exercise.reps,
          weight: exercise.weight,
          sets: exercise.reps.length, // Ensure sets matches the number of reps
        };

        const exerciseResponse = await fetch(
          `${httpRequests.getBaseURL()}/exercises/updateExercise`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${context?.data.token}`,
            },
            body: JSON.stringify(exercisePayload),
          }
        );

        if (!exerciseResponse.ok) {
          throw new Error(
            `Failed to update exercise: ${exercise.nameOfExercise} - ${exerciseResponse.statusText}`
          );
        }

        console.log(`Exercise updated successfully: ${exercise.nameOfExercise}`);
      }

      // Refresh the workout list
      await context?.fetchWorkouts();
      Alert.alert("Success", "Workout and exercises updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error saving workout:", error);
      Alert.alert("Error", "Failed to save workout. Please try again.");
    }
  };

  const deleteWorkout = async (workoutName: string) => {
    try {
      const workoutId = await fetchWorkoutById(workoutName);


      if (!workoutId) {
        Alert.alert("Error", "Failed to fetch workout ID.");
        return;
      }


      const response = await fetch(
        `${httpRequests.getBaseURL()}/workouts/deleteWorkout/${workoutId}`,
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
      await context?.fetchWorkouts(); // Refresh the workout list
      Alert.alert("Success", "Workout deleted successfully!");
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };


  const fetchWorkoutById = async (workoutName: string): Promise<number | undefined> => {
    try {
      const response = await fetch(
        `${httpRequests.getBaseURL()}/workouts/getUsersWorkouts/0/10000`,
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


      const workouts = await response.json();
      const matchedWorkout = workouts.find(
        (workout: any) => workout.name === workoutName
      );


      return matchedWorkout ? matchedWorkout.workoutsId : undefined;
    } catch (error) {
      console.error("Error fetching workout by name:", error);
      return undefined;
    }
  };

  const logWorkout = async () => {
    if (!selectedWorkout) {
      Alert.alert("Error", "No workout selected to log.");
      return;
    }

    try {
      const response = await fetch(
        `${httpRequests.getBaseURL()}/calendar/logWorkout?timeZone=${TimeZone.get()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context?.data.token}`,
          },
          body: JSON.stringify({ workoutId: selectedWorkout.id }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        if (errorMessage.includes("Workout or Rest day already logged for this date")) {
          Alert.alert(
            "Duplicate Log",
            "A workout has already been logged for today."
          );
          return;
        }
        throw new Error(`Failed to log workout: ${errorMessage}`);
      }

      // Success block: Workout logged successfully
      console.log("Workout logged successfully");
      Alert.alert("Success", "Workout logged!");

    } catch (error) {
      // Error block: Handle failed attempts
      console.log("Workout or Rest day already logged for this date");
      Alert.alert("Workout or Rest day already logged for this date");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
      //backgroundColor: "white", // Light gray background for better contrast
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    darkContainer: {
      flex: 1,
      paddingTop: 10,
      backgroundColor: "black",
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    title: {
      fontSize: 36,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#333",
      textAlign: "center",
    },

    workoutItem: {
      backgroundColor: "#fff",
      width: '95%',
      height: 90,
      borderRadius: 10,
      // borderWidth: 0.3,
      // borderColor: 'grey',
      padding: 5,
      marginBottom: 15,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      flexDirection: "column", // Stack workout name and buttons vertically
      textAlign: 'left',
      paddingLeft: 10,
      alignSelf: 'center',
    },


    workoutName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "black",
      padding: 5,
      marginBottom: 15, // Add space between workout name and buttons
    },

    buttonGroup: {
      flexDirection: "row", // Align buttons in a row
      justifyContent: "space-evenly", // Even spacing between buttons
      width: "100%", // Buttons take up full width
    },

    viewButton: {
      backgroundColor: "white", // Fitness-friendly green color
      width: '30%',
      height: 30,
      padding: 5,
      borderRadius: 8,
      borderColor: '#21BFBF',
      borderWidth: 1,
    },

    viewButtonText: {
      color: "#21BFBF",
      fontWeight: "bold",
      textAlign: "center",
    },

    // Stop button styling with padding, rounded corners, and center alignment.
    stopButton: {
      padding: 10,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 5,
    },

    deleteButton: {
      backgroundColor: "#F2505D", // Subtle red for delete
      width: '30%',
      height: 30,
      padding: 5,
      borderRadius: 8,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker overlay for focus
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: "95%",
      backgroundColor: "#f9f9f9",
      borderRadius: 15,
      padding: 20,
      maxHeight: "90%", // Increased max height for better visibility
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "black",
      marginBottom: 20,
      textAlign: "center",
    },
    exerciseItem: {
      backgroundColor: "#f9f9f9",
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    exerciseName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "black", // Neutral gray for exercise names
      marginBottom: 10,
      textAlign: "center",
    },
    exerciseDetailsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    exerciseDetailsHeaderText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
      flex: 1,
    },
    exerciseDetailsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 5,
    },
    exerciseDetailsText: {
      fontSize: 16,
      color: "#333",
      textAlign: "center",
      flex: 1,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
      fontSize: 22,
      fontWeight: 'bold',
      // color: 'grey',
      // backgroundColor: "#fff",
      backgroundColor: "#f9f9f9",
    },
    saveButton: {
      backgroundColor: "#21BFBF",
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
    },
    saveButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    editButton: {
      backgroundColor: "#21BFBF",
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
    },
    editButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    closeButton: {
      backgroundColor: "#ddd",
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
    },
    closeButtonText: {
      color: "#333",
      fontWeight: "bold",
      fontSize: 16,
    },
    counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 10,
      backgroundColor: "#f9f9f9",
    },
    counterText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    counterValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#4CAF50",
      textAlign: "center",
    },
    counterButton: {
      backgroundColor: "#4CAF50",
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginHorizontal: 5,
    },
    counterButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
      textAlign: "center",
    },
    exerciseCard: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 15,
      marginTop: 20,
      marginBottom: 20,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    exerciseNameInput: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      padding: 8,
      backgroundColor: "#f9f9f9",
      marginRight: -7,
      marginLeft: -7,
    },
    setRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
      paddingHorizontal: 5, // Adds vertical padding, a bottom border, and horizontal spacing.
      borderBottomWidth: 1,
      borderBottomColor: "#f2f2f2",
    },
    labelRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
      paddingHorizontal: 0,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    setLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#555",
      flex: 1,
      textAlign: "center", // Centers the text horizontally.
    },
    setInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 6, // Match original padding
      borderRadius: 5,
      fontSize: 14,
      textAlign: 'center', // Center align text
      minWidth: 20, // Keep input size consistent
      height: 30, // Match the height of the input boxes
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      // backgroundColor: "#f4f4f4", // Match background with container
    },
    setValueTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: "#555",
      textAlign: "center",
      flex: 1,
    },
    setValueTitleStart: {
      fontSize: 16,
      fontWeight: 'bold',
      color: "#555",
      textAlign: "right",
      flex: 1,
    },
    setValue: {
      fontSize: 14,
      color: "#555",
      textAlign: "center",
      flex: 1,
    },

    // Ensures equal column width and centers the icon.
    setLabelIcon: {
      flex: 1,
      textAlign: "center",
    },

    addSetButton: {
      // backgroundColor: "#56C97B",
      paddingTop: 3,
      flexDirection: 'row',
      alignItems: 'center',
      // padding: 2,
      // borderWidth: 1, 
      // borderColor: 'lightgrey',
      // borderRadius: 8,
      // marginTop: 10,
    },
    addSetText: {
      color: "#21BFBF",
      fontSize: 16,
      margin: 3,
    },
    removeSetButton: {
      // backgroundColor: "lightgrey",
      // padding: 10,
      borderRadius: 8,
      alignItems: "center",
    },
    removeSetText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
    startButton: {
      backgroundColor: "#21BFBF", // Blue for Start Workout button
      width: '30%',
      height: 30,
      padding: 5,
      borderRadius: 8,
    },

    checkBox: {
      borderWidth: 1,
      borderColor: "#ccc",
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 4,
      marginHorizontal: 10,
    },

    checked: {
      color: "green",
      fontWeight: "bold",
      fontSize: 16,
    },

    unchecked: {
      color: "gray",
      fontSize: 16,
    },
    finishButton: {
      backgroundColor: "#21BFBF", // Green button for finishing workout
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
    },

    finishButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: 'column',
      marginRight: 20, // Space between inputs
      marginBottom: 2, // Space below each input container
      flex: 1.3, // Maintain proper sizing within the set row
    },
    inputHeaderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginRight: 20, // Space between inputs
      marginBottom: 2, // Space below each input container
      flex: 1.3, // Maintain proper sizing within the set row
    },
    inputHeader: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 2,
      // marginRight: 50,
      color: '#555',
    },
    // columnWrapper: {
    //   paddingHorizontal: 5, // Add padding to the left and right of the row
    // },

    helperText: {
      color: '#888', // grey color
      fontSize: 16,
      textAlign: 'center',
      marginTop: '60%',

      marginVertical: 350,
      // paddingTop: 10
    },

    darkModalContent: {
      backgroundColor: "#121212", // or a preferred dark shade
      borderRadius: 15,
      padding: 20,
      maxHeight: "90%",
    },
    darkModalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 20,
      textAlign: "center",
    }

  });

  return (
    <View testID="screen-container" style={[isDarkMode ? styles.darkContainer : styles.container]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>Loading Workouts...</Text>
        </View>
      ) : (
        <>
          {/* <Stopwatch /> */}
          <FlatList
            data={context?.workouts}
            keyExtractor={(item, index) =>
              item.id ? `workout-${item.id}-${index}` : `workout-${index}`
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.workoutItem}>
                <Text style={styles.workoutName}>{String(item.name)}</Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      Alert.alert(
                        "Confirm Delete",
                        `Are you sure you want to delete the workout "${String(item.name)}"?`,
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => deleteWorkout(item.name),
                          },
                        ]
                      )
                    }
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                    {/* <Ionicons name="trash-outline" size={25} color="#F2505D"></Ionicons> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => openModal(item)}
                  >
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => startWorkout(item)}
                  >
                    <Text style={styles.buttonText}>Start</Text>
                    {/* <Ionicons name="arrow-up-circle" size={60} color="#21BFBF"></Ionicons> */}
                  </TouchableOpacity>
                </View>
              </View> // <-- close the workoutItem View
            )}
          />
        </>
      )}
  
      {/* Message/directions for the user */}
      <View style={{ justifyContent: "center", alignContent: "center", alignSelf: "center" }}>
        {(!context?.workouts || context.workouts.length === 0) && (
          <Text style={styles.helperText} numberOfLines={1}>
            Please add a workout!
          </Text>
        )}
      </View>
  
      {/* Modal for View and Edit */}
      <Modal
        visible={isModalVisible && !isTracking}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: -0.1 }}
            >
              {selectedWorkout && (
                <>
                  {isEditing ? (
                    <>
                      <TextInput
                        style={styles.input}
                        value={workoutName}
                        onChangeText={setWorkoutName}
                        placeholder="Workout Name"
                      />
                      <FlatList
                        nestedScrollEnabled={true}
                        data={updatedExercises}
                        keyExtractor={(exItem, exIndex) =>
                          `exercise-${exItem.exerciseId}-${exIndex}`
                        }
                        renderItem={({ item: exItem, index: exIndex }) => (
                          <View style={styles.exerciseCard}>
                            {/* ... Your Edit-Mode content (exercise name, sets, etc.) ... */}
                          </View>
                        )}
                      />
                      <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
                        <Text style={styles.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text style={styles.modalTitle}>{selectedWorkout.name}</Text>
                      <FlatList
                        data={selectedWorkout.exercises || []}
                        keyExtractor={(exItem, exIndex) =>
                          `exercise-${exItem.exerciseId}-${exIndex}`
                        }
                        renderItem={({ item: exItem, index: exIndex }) => (
                          <View style={styles.exerciseCard}>
                            {/* ... Your View-Mode content (exercise name, sets, etc.) ... */}
                          </View>
                        )}
                      />
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(true)}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </View> // <-- final closing tag for the parent View
  )};