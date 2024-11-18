import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

// structure of a set detail with reps and weight
interface SetDetail {
  reps: string;
  weight: string;
}

// structure of an exercise with a name and list of sets
interface Exercise {
  id: string;
  name: string;
  sets: SetDetail[];
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

  // Add a new exercise 
  const addExercise = () => {
    if (newExerciseName) {
      const newExercise: Exercise = {
        id: Math.random().toString(),
        name: newExerciseName,
        sets: [{ reps: "", weight: "" }],
      };
      setExercises([...exercises, newExercise]);
      setNewExerciseName("");
    }
  };

  // Add a new set to an existing exercise
  const addSetToExercise = (exerciseId: string) => {
    setExercises(exercises.map(exercise =>
      exercise.id === exerciseId
        ? { ...exercise, sets: [...exercise.sets, { reps: "", weight: "" }] }
        : exercise
    ));
  };

  // Show a confirmation before deleting an exercise
  const confirmDeleteExercise = (id: string) => {
    Alert.alert(
      "Delete Exercise",
      "Are you sure you want to delete this exercise?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => removeExercise(id) }
      ]
    );
  };

  // Remove an exercise by ID
  const removeExercise = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  // Show a confirmation  before deleting a set within an exercise
  const confirmDeleteSet = (exerciseId: string, setIndex: number) => {
    Alert.alert(
      "Delete Set",
      "Are you sure you want to delete this set?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => removeSetFromExercise(exerciseId, setIndex) }
      ]
    );
  };

  // Remove a set from an exercise based on index
  const removeSetFromExercise = (exerciseId: string, setIndex: number) => {
    setExercises(exercises.map(exercise =>
      exercise.id === exerciseId
        ? { ...exercise, sets: exercise.sets.filter((_, i) => i !== setIndex) }
        : exercise
    ));
  };

  //  editing an exercise name
  const handleEditName = (exercise: Exercise) => {
    setEditingExerciseId(exercise.id);
    setTemporaryName(exercise.name);
  };

  // Save the edited exercise name and reset editing state
  const saveNameEdit = (exerciseId: string) => {
    setExercises(exercises.map(exercise =>
      exercise.id === exerciseId
        ? { ...exercise, name: temporaryName }
        : exercise
    ));
    setEditingExerciseId(null);
  };

  const renderExercise = ({ item }: { item: Exercise }) => (
    <Swipeable
      renderLeftActions={() => (
        <View style={styles.swipeDeleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </View>
      )}
      onSwipeableOpen={() => confirmDeleteExercise(item.id)}
    >
      <View style={styles.exerciseItem}>
        {/* Render exercise name and edit input if in edit mode */}
        <View style={styles.exerciseTitleContainer}>
          {editingExerciseId === item.id ? (
            <TextInput
              style={styles.exerciseTitleText}
              value={temporaryName}
              onChangeText={setTemporaryName}
              onBlur={() => saveNameEdit(item.id)}
              onSubmitEditing={() => saveNameEdit(item.id)}
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => handleEditName(item)}>
              <Text style={styles.exerciseTitleText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Render each set for the exercise */}
        {item.sets.map((set, index) => (
          <View key={index} style={styles.setContainer}>
            <Text style={styles.setLabel}>Set {index + 1}</Text>
            <View style={styles.inputRow}>
              <View style={styles.setInputContainer}>
                <Text style={styles.inputLabel}>Weight</Text>
                <TextInput
                  style={styles.input}
                  placeholder="lbs"
                  value={set.weight}
                  onChangeText={(text) => {
                    const updatedSets = item.sets.map((s, i) =>
                      i === index ? { ...s, weight: text } : s
                    );
                    setExercises(exercises.map(ex =>
                      ex.id === item.id ? { ...ex, sets: updatedSets } : ex
                    ));
                  }}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.setInputContainer}>
                <Text style={styles.inputLabel}>Reps</Text>
                <TextInput
                  style={styles.input}
                  placeholder="reps"
                  value={set.reps}
                  onChangeText={(text) => {
                    const updatedSets = item.sets.map((s, i) =>
                      i === index ? { ...s, reps: text } : s
                    );
                    setExercises(exercises.map(ex =>
                      ex.id === item.id ? { ...ex, sets: updatedSets } : ex
                    ));
                  }}
                  keyboardType="numeric"
                />
              </View>
              {/* Delete set button */}
              <TouchableOpacity onPress={() => confirmDeleteSet(item.id, index)} style={styles.deleteSetButton}>
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {/* Add set button */}
        <TouchableOpacity onPress={() => addSetToExercise(item.id)} style={styles.addSetButton}>
          <Ionicons name="add-circle-outline" size={20} color="black" />
          <Text style={styles.addSetButtonText}>Add Set</Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      {/* Notes button */}
      <TouchableOpacity style={styles.notesButton} onPress={() => setNoteModalVisible(true)}>
        <Text style={styles.notesButtonText}>
          Notes: {noteText ? noteText.slice(0, 20) + "..." : "Add notes here"}
        </Text>
      </TouchableOpacity>

      {/* Notes modal */}
      <Modal
        transparent={true}
        visible={isNoteModalVisible}
        animationType="slide"
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Workout Notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Type your notes here"
              value={noteText}
              onChangeText={setNoteText}
              multiline
            />
            <TouchableOpacity onPress={() => setNoteModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Save Notes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Input for new exercise name */}
      <TextInput
        style={styles.exerciseNameInput}
        placeholder="Enter Exercise Name"
        value={newExerciseName}
        onChangeText={setNewExerciseName}
      />
      {/* Add exercise button */}
      <TouchableOpacity style={styles.addButton} onPress={addExercise}>
        <Text style={styles.addButtonText}>Add Exercise</Text>
        <Ionicons name="add-circle-outline" size={20} color="white" />
      </TouchableOpacity>

      {/* Exercise list */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExercise}
      />

      {/* Submit button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    marginBottom: 20,
  },
  notesButtonText: {
    fontSize: 16,
    color: '#333',
  },
  // Styling for the exercise name input
  exerciseNameInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  // Add exercise button styling
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
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
    marginBottom: 5,
  },
  setInputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    fontSize: 12,
    color: 'gray',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 30,
    marginTop: 3,
  },
  deleteSetButton: {
    padding: 5,
  },
  swipeDeleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
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
    marginLeft: 5,
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#302c2c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notesInput: {
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  closeButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});