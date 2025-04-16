import React, { useState, useContext  } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Modal, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { GlobalContext } from "@/context/GlobalContext"; // Access global context
import { useNavigation } from "@react-navigation/native"; // Navigation
import { WorkoutScreenNavigationProp } from '@/app/(tabs)/WorkoutStack';
import StreakHeader from '@/components/StreakHeader';
import { httpRequests } from '@/api/httpRequests';




// structure of a set detail with reps and weight


// structure of an exercise with a name and list of sets
interface Exercise {
  nameOfExercise: string;
  sets: number;
  weight: number[]; // Changed from string to number for better type handling
  reps: number[];


}


export default function StartWorkoutScreen() {
  //  hold all exercises
  const [exercises, setExercises] = useState<Exercise[]>([]);
  // Smanaging the notes modal visibility and content
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);
  const [noteText, setNoteText] = useState("");
  //  managing the new exercise name input
  const [newExerciseName, setNewExerciseName] = useState("");
  //  managing exercise name editing
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [temporaryName, setTemporaryName] = useState<string>("");
  const context = useContext(GlobalContext); // Access token
  const navigation = useNavigation<WorkoutScreenNavigationProp >();
    const [workoutName, setWorkoutName] = useState(""); // State for workout name
  const [submitting, setSubmitting] = useState(false);
 
  console.log(
    "Mapped exercises payload:",
    exercises.map((exercise) => ({
      nameOfExercise: exercise.nameOfExercise,
    sets: exercise.sets,
      weight: exercise.weight,
    }))
  );
  const addNote = async () => {
    if (!noteText) {
      // Alert.alert("FYI!", "Reminder you can add a note!");
      return;
    }
  
    try {
      const notePayload = {
        title: workoutName || "Untitled Workout",
        description: noteText,
      };
  
      const response = await fetch(
        `${httpRequests.getBaseURL()}/note/addNote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context?.data.token}`, // Add the token from context
          },
          body: JSON.stringify(notePayload),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to add note: ${response.statusText}`);
      }
  
      console.log("Note added successfully");
      // Alert.alert("Success", "Note saved successfully!");
  
      // Clear the note input after submission
      setNoteText("");
  
      // Optionally, navigate to MyNotesScreen if needed
      // navigation.navigate("MyNotesScreen", {});
    } catch (error) {
      console.error("Error adding note:", error);
      Alert.alert("Error", "Failed to save note. Please try again.");
    }
  };
  const submitWorkout = async () => {
    try {
      setSubmitting(true);
  
      // Submit exercises logic here (already in your code)
      const WorkoutExercises: number[] = [];
  
      for (let i = 0; i < exercises.length; i++) {
        const currentExercise = {
          sets: exercises[i].sets,
          reps: exercises[i].reps,
          nameOfExercise: exercises[i].nameOfExercise,
          weight: exercises[i].weight,
          description: "",
          exerciseType: 0,
        };
  
        try {
          console.log(`${httpRequests.getBaseURL()}/exercises/addExercise`)
          console.log(currentExercise)
          const response = await fetch(
            `${httpRequests.getBaseURL()}/exercises/addExercise`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${context?.data.token}`,
              },
              body: JSON.stringify(currentExercise),
            }
          );
  
          if (!response.ok) {
            throw new Error(`Error adding exercise: ${response.status}`);
          }
  
          const json = await response.json();
          WorkoutExercises.push(json.exerciseId);
        } catch (error) {
          console.error("Failed to add exercise:", error);
        }
      }
  
      // Submit the workout
      const workoutPayload = {
        name: workoutName || "Untitled Workout",
        exerciseIds: WorkoutExercises,
        isDeleted: false,
      };
  
      const workoutResponse = await fetch(
        `${httpRequests.getBaseURL()}/workouts/addWorkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context?.data.token}`,
          },
          body: JSON.stringify(workoutPayload),
        }
      );
  
      if (!workoutResponse.ok) {
        throw new Error(`Error adding workout: ${workoutResponse.status}`);
      }
  
      const workoutJson = await workoutResponse.json();
  
      // Add workout to context
      context?.addWorkout({ ...workoutJson, exercises: [] });
  
      // Save the note
      await addNote();
  
      // Reset the form and navigate
      setWorkoutName("");
      setExercises([]);
      Alert.alert("Success", "Workout and note added successfully!");
      // navigation.navigate("MyWorkoutsScreen", {});
      navigation.replace('MyWorkoutsScreen', {});
    } catch (error) {
      console.error("Error submitting workout:", error);
      Alert.alert("Error", "Failed to submit workout. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
 
  // add a new exercise
  const addExercise = () => {
    if (newExerciseName) {
      const newExercise: Exercise = {
        nameOfExercise: newExerciseName,
        sets: 0,
        reps: [], // Initialize reps as an empty array
        weight: [], // Initialize weight as an empty array
      };
      setExercises([...exercises, newExercise]);
      setNewExerciseName("");
    }
  };
 
 


  // Add a new set to an existing exercise
  const addSetToExercise = (index: number) => {
    setExercises(
      exercises.map((exercise, i) =>
        i === index
          ? {
              ...exercise,
              sets: exercise.sets + 1, // Increment the set count
              reps: [...exercise.reps, 0], // Add a default value for reps
              weight: [...exercise.weight, 0], // Add a default value for weight
            }
          : exercise
      )
    );
  };
 
 
 
 


 // Show a confirmation before deleting an exercise
const confirmDeleteExercise = (exerciseIndex: number) => {
  Alert.alert(
    "Delete Exercise",
    "Are you sure you want to delete this exercise?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => removeExercise(exerciseIndex),
      },
    ]
  );
};


  // Remove an exercise by ID
  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };
 
  // Show a confirmation  before deleting a set within an exercise
  const confirmDeleteSet = (exerciseIndex: number, setIndex: number) => {
    Alert.alert(
      "Delete Set",
      "Are you sure you want to delete this set?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeSetFromExercise(exerciseIndex, setIndex),
        },
      ]
    );
  };
 


  // Remove a set from an exercise based on index
  const removeSetFromExercise = (exerciseIndex: number, setIndex: number) => {
    setExercises(
      exercises.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets - 1, // Decrement the set count
              reps: exercise.reps.filter((_, index) => index !== setIndex),
              weight: exercise.weight.filter((_, index) => index !== setIndex),
            }
          : exercise
      )
    );
  };
 


  //  editing an exercise name
  const handleEditName = (exerciseIndex: number) => {
    const selectedExercise = exercises[exerciseIndex]; // Get the exercise using the index
    setEditingExerciseId(exerciseIndex.toString()); // Use the index as a temporary identifier
    setTemporaryName(selectedExercise.nameOfExercise); // Set the current name to be edited
  };
 
  // Save the edited exercise name and reset editing state
  const saveNameEdit = (exerciseIndex: number) => {
    setExercises(exercises.map((exercise, index) =>
      index === exerciseIndex
        ? { ...exercise, nameOfExercise: temporaryName } // Update the nameOfExercise field
        : exercise
    ));
    setEditingExerciseId(null); // Clear editing state
  };
  const renderExercise = ({ item, index }: { item: Exercise; index: number }) => (
    <Swipeable
      renderLeftActions={() => (
        <TouchableOpacity style={styles.swipeDeleteButton} onPress={() => confirmDeleteExercise(index)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
      // onSwipeableOpen={} // Pass the index to delete the exercise
    >
      <View style={styles.exerciseItem}>
        {/* Render exercise name and edit input if in edit mode */}
        <View style={styles.exerciseTitleContainer}>
          {editingExerciseId === index.toString() ? ( // Use the index for comparison
            <TextInput
              style={styles.exerciseTitleText}
              value={temporaryName}
              onChangeText={setTemporaryName}
              onBlur={() => saveNameEdit(index)} // Pass the index to save changes
              onSubmitEditing={() => saveNameEdit(index)} // Pass the index to save changes
              autoFocus
            />
          ) : (
            <View>
              <TouchableOpacity onPress={() => handleEditName(index)}>
                <Text style={styles.exerciseTitleText}>{item.nameOfExercise}</Text>
              </TouchableOpacity>
            </View>
            
          )}
        </View>
 
        {/* Render each set for the exercise */}
        <View style={styles.inputRow}>
          <Text style={[styles.exerciseSets, styles.leftColumn]}>Set</Text>
          <Text style={[styles.exerciseSets, styles.leftColumn]}>    Reps</Text>
          <Text style={[styles.exerciseSets, styles.leftColumn]}>Weight</Text>
        </View>
        
        {Array.from({ length: item.sets }).map((_, setIndex) => (
          <View key={setIndex} style={styles.setContainer}>
            <View style={styles.inputRow}>
            <Text style={[styles.setLabel, styles.leftColumn]}>{setIndex + 1}</Text>

             {/* Input for reps */}
             <View style={[styles.setInputContainer, styles.rightColumn]}>
                {/* <Text style={[styles.inputLabel, styles.rightColumn]}>Reps</Text> */}
                <TextInput
                  style={styles.input}
                  placeholder="reps"
                  value={item.reps[setIndex]?.toString() || ""}
                  onChangeText={(text) => {
                    const updatedReps = [...item.reps];
                    updatedReps[setIndex] = parseInt(text) || 0;
                    setExercises(
                      exercises.map((exercise, i) =>
                        i === index
                          ? { ...exercise, reps: updatedReps }
                          : exercise
                      )
                    );
                  }}
                  keyboardType="numeric"
                />
              </View>

              {/* Input for weight */}
              <View style={[styles.setInputContainer, styles.rightColumn]}>
                {/* <Text style={[styles.inputLabel, styles.rightColumn]}>Weight</Text> */}
                <TextInput
                  style={styles.input}
                  placeholder="lbs"
                  value={item.weight[setIndex]?.toString() || ""}
                  onChangeText={(text) => {
                    const updatedWeight = [...item.weight];
                    updatedWeight[setIndex] = parseFloat(text) || 0;
                    setExercises(
                      exercises.map((exercise, i) =>
                        i === index
                          ? { ...exercise, weight: updatedWeight }
                          : exercise
                      )
                    );
                  }}
                  keyboardType="numeric"
                />
              </View>

              {/* Delete set button */}
              <TouchableOpacity
                onPress={() => confirmDeleteSet(index, setIndex)} // Pass both exercise index and set index
                style={styles.deleteSetButton}
              >
                <Ionicons name="trash-outline" size={20} color="#F22E2E" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
 
        {/* Add set button */}
        <TouchableOpacity
          onPress={() => addSetToExercise(index)} // Pass the index to add a set
          style={styles.addSetButton}
        >
          <Text style={styles.addSetButtonText}>Add Set</Text>
          <Ionicons name="add-circle-outline" size={20} color="#21BFBF" />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
 


const styles = StyleSheet.create({
  // the entire screen
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  // Styling for the notes button
  notesButton: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginBottom: 10,
    height: '40%'
  },
  notesButtonText: {
    fontSize: 16,
    color: '#888',
  },
  // Styling for the exercise name input
  exerciseNameInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  // Add exercise button styling
  addButton: {
    backgroundColor: '#21BFBF',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 40,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    marginRight: 5,
  },
  exerciseItem: {
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
  },
  exerciseTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  exerciseTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginBottom: 5,
  },
  exerciseSets: {
    fontSize: 15,
    fontWeight: 'bold', 
    flex: 1,
  },
  setContainer: {
    flexDirection: 'column',
    paddingTop: 5,
  },
  setLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  setInputContainer: {
    flex: 1,
    marginHorizontal: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: 'black',
  },

  leftColumn: {
    flex: 1, // Take up a smaller portion of the row
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 10,
  },

  rightColumn: {
    flex: 1, // Take up more space
    flexDirection: "row",
    justifyContent: "center",
    margin: 5,

  },
  input: {
    backgroundColor: '#D9D9D9',
    width: '40%',
    borderRadius: 5,
    textAlign: 'center',
    color: 'black',
    //maxHeight: 30,
    textAlignVertical: 'center',
  },
  deleteSetButton: {
    padding: 5,
  },
  swipeDeleteButton: {
    backgroundColor: '#F22E2E',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '90%',
    borderRadius: 10,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  addSetButtonText: {
    marginHorizontal: 5,
    color: '#21BFBF',
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: '#302c2c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    minWidth: '85%',
    // minWidth: 400,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    // maxHeight: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notesInput: {
    minWidth: '85%',
    height: 200,
    // maxHeight: '300%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    width: 272,
    // maxHeight: '100%',
    // flexGrow:1,
  },
  workoutNameInput: {
    height: 40,
    // borderColor: "gray",
    // borderWidth: 1,
    // paddingHorizontal: 10,
    marginBottom: 2,
    borderRadius: 8,
    width: '80%',
    fontWeight: 'bold',
    fontSize: 18,
  },
 
  closeButton: {
    backgroundColor: '#21BFBF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  topRow: {
    // flexDirection: 'row',
    height: '40%',
    // backgroundColor: 'pink'
  }, 
  keyboardAvoid: {
    width: '80%',
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 10,
  }, 
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  }
});
 
return (
  <View style={styles.container}>
    <StreakHeader></StreakHeader>
    {/* Notes button */}
    <View style={styles.topRow}>
      <View>
        <TextInput
          style={styles.workoutNameInput}
          placeholder="Enter Workout Name"
          placeholderTextColor={"#B6B6B6"}
          value={workoutName}
          autoCapitalize='words'
          onChangeText={setWorkoutName}
        />
        <TouchableOpacity style={styles.notesButton} onPress={() => setNoteModalVisible(true)}>
        {noteText ?
          <Text style={styles.notesButtonText} numberOfLines={4} // Limit to one line
          ellipsizeMode="tail">
              {noteText}
          </Text>
        : 
          <View>
            <Text  style={styles.notesButtonText}>Add notes </Text>
            {/* <Ionicons name="create-outline" size={18}/> */}
          </View>
        }
        </TouchableOpacity>
        {/* Input for new exercise name */}
        <View>
          <TextInput
            style={styles.exerciseNameInput}
            placeholder="Enter Exercise Name"
            value={newExerciseName}
            autoCapitalize='words'
            onChangeText={setNewExerciseName}
          />
          {/* Add exercise button */}
          <TouchableOpacity style={styles.addButton} onPress={addExercise}>
            <Text style={styles.addButtonText}>Add Exercise</Text>
            <Ionicons name="add-circle-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
  
      {/* Notes modal */}
      <Modal
        transparent={true}
        visible={isNoteModalVisible}
        animationType="slide"
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalContentContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}  
          >
              <View style={styles.modalContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={styles.modalTitle}>Workout Notes</Text>
                  <TouchableOpacity onPress={() => setNoteModalVisible(false)}>
                    <Ionicons style={{ marginBottom: 5 }} name='close-circle-outline' size={30} color={'#747474'} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Type your notes here"
                  value={noteText}
                  onChangeText={setNoteText}
                  placeholderTextColor={'#555'}
                  multiline
                />
                <TouchableOpacity onPress={() => setNoteModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Save Notes</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
    {/* Exercise list */}
      <FlatList
        data={exercises}
        keyExtractor={(_, index) => index.toString()} // Use the index as the unique key
        renderItem={renderExercise} // Use the updated renderExercise function
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    {/* Submit button */}
    <TouchableOpacity
      onPress={submitWorkout}
      style={[
        styles.submitButton,
        exercises.length === 0 && { opacity: 0.3 }, // Gray out button when disabled
      ]}
      disabled={exercises.length === 0} // Disable when no exercises
    >
      <Text style={styles.submitButtonText}>
        <Text>{exercises.length === 0 ? "Add Exercises to Submit" : "Submit Workout"}</Text>
      </Text>
    </TouchableOpacity>
  </View>
)};



