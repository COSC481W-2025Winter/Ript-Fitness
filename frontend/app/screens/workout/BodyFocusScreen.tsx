import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Button, FlatList, TouchableOpacity } from 'react-native';
import BodyDiagram from '@/components/BodyDiagram';

// Define a type for valid body parts
export type BodyPart = "Legs" | "Arms" | "Abdomen"| "Back" | "Shoulders";

export default function BodyFocusScreen() {
  const [selectedPart, setSelectedPart] = useState<BodyPart | "">("");
  const [exerciseList, setExerciseList] = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());
  const [isFrontView, setIsFrontView] = useState(true);

  // Exercise data for front and back views
  const exercises = {
    front: {
      Legs: ["Squats", "Lunges", "Leg Press", "Deadlifts"],
      Arms: ["Bicep Curl", "Pull-ups", "Incline Dumbbell Curl", "Bent-over Rows"],
      Abdomen: ["Crunches", "Plank", "Russian Twists", "Leg Raises"],
    },
    back: {
      Back: ["Lat Pulldown", "Bent-over Rows", "Pull-ups", "Face Pulls", "Seated Cable Rows", "Reverse Flys", "Hyperextensions"],
      Shoulders: ["Overhead Press", "Arnold Press", "Lateral Raises", "Front Raises", "Reverse Pec Deck", "Shrugs", "Upright Rows"],
    },
  };

  // Handle body part selection and display modal
  const handleBodyPartClick = (part: BodyPart) => {
   // Prevent modal from opening if the user clicks "Back" or "Shoulders" while in front view
  if (isFrontView && (part === "Back" || part === "Shoulders")) {
    return;
  }

  // Prevent modal from opening if the user clicks anything other than "Back" or "Shoulders" while in back view
  if (!isFrontView && part !== "Back" && part !== "Shoulders") {
    return;
  }
    setSelectedPart(part); 
    setModalVisible(true);
  };

  // Toggle selection of exercises
  const toggleExerciseSelection = (exercise: string) => {
    setSelectedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exercise)) {
        newSet.delete(exercise);
      } else {
        newSet.add(exercise);
      }
      return newSet;
    });
  };

  // Save selected exercises
  const saveSelectedExercises = () => {
    selectedExercises.forEach(exercise => exerciseList.add(exercise));
    setExerciseList(new Set(exerciseList)); // Update exercise list
    setSelectedExercises(new Set()); // Clear selected exercises
    setModalVisible(false);
  };

  // Clear all selected exercises
  const clearAllExercises = () => {
    setExerciseList(new Set()); // Clear exercise list
    setSelectedPart(""); // Clear selected body part
  };

  //Toggle between front and back view
  const toggleView = () => {
    setIsFrontView(prev => !prev);
    setSelectedPart(""); // Clear selected body part when switching
  };

  // Get the appropriate exercises for the selected body part
  const selectedExercisesList = isFrontView
    ? exercises.front[selectedPart as keyof typeof exercises.front] || []
    : exercises.back[selectedPart as keyof typeof exercises.back] || [];

  return (
    <View style={styles.container}>
      {/* Display selected exercises */}
      <View style={{ marginTop: 485 }}>  // Adjust marginTop to control positioning
      <Text style={styles.exerciseTitle}>
        Selected Exercises: <Text style={styles.selectedBodyPart}></Text>
      </Text>
      <FlatList
        data={[...exerciseList]} // Convert Set to an array
        renderItem={({ item }) => <Text style={styles.exerciseText}>• {item}</Text>}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} //  Limit to 2 items per row
        scrollEnabled={false} //Disable scrolling
        contentContainerStyle={styles.exerciseListContainer}
        style={{ maxHeight: 6 * 30 }} // Limit to a maximum of 6 rows, each around 30px
      />
    <View style={{ alignItems: 'center', marginTop: 10 }}> 
      <TouchableOpacity onPress={toggleView} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {isFrontView ? "Switch to Back View" : "Switch to Front View"}
        </Text>
      </TouchableOpacity>
    </View>
       {/* Add "Clear All" button */}
        {exerciseList.size > 0 && (
            <View style={{ alignItems: 'center', marginTop: 10 }}>  // Center the button
              <TouchableOpacity 
                onPress={clearAllExercises} 
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}
      </View>

      <View style={styles.bodyDiagramContainer}>
        <BodyDiagram
        onBodyPartClick={handleBodyPartClick} 
        imageSource={isFrontView ? require('@/assets/images/body-diagram.png') : require('@/assets/images/body-diagram-back.png')}
        />
      </View>
      
      {/* Modal for exercise selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select Exercises for {selectedPart}</Text>
          <FlatList
            data={selectedExercisesList}
            renderItem={({ item }) => (
              <View style={styles.exerciseOption}>
                <Button
                  title={item}
                  onPress={() => toggleExerciseSelection(item)}
                  color={selectedExercises.has(item) ? "green" : "blue"}
                />
              </View>
            )}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.exerciseListContainer}
          />
          <TouchableOpacity onPress={saveSelectedExercises} style={styles.customButton}>
            <Text style={styles.customButtonText}>Save Selected Exercises</Text>
          </TouchableOpacity>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
    );
  }

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  exerciseTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#21BFBF',
  },
  selectedBodyPart: {
    fontWeight: 'bold', // Adjust as needed
    fontSize: 14, // Adjust as needed
    color: '#21BFBF', // Adjust as needed
  },
  exerciseRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  exerciseListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    maxHeight: 180, // Limit list to 6 rows, each around 30px
  },
  exerciseText: {
    fontSize: 14,
    color: '#21BFBF',
    textAlign: 'center',
    marginHorizontal: 5,
  },
  bodyDiagramContainer: {
    position: 'absolute',
    top: 480,  // Adjust this value to move the body diagram up or down
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  toggleButton: {
    backgroundColor: '#21BFBF',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
    width: 150,  
    height: 30, 
    justifyContent: 'center',
  },
  toggleButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },

  modalView: {
    margin: 60,
    backgroundColor: 'white',
    borderRadius: 90,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#21BFBF',
  },
  exerciseOption: {
    marginVertical: -3,
  },

  customButton: {
    backgroundColor: '#21BFBF', 
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10, 
  },
  customButtonText: {
    fontSize: 12, 
    color: 'white', 
  },

  clearButton: {
    backgroundColor: '#21BFBF',
    width: 60,  
    height: 30, 
    borderRadius: 30, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5, 
  },
  
  clearButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
});


