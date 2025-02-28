import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Button, FlatList, TouchableOpacity } from 'react-native';
import BodyDiagram from '@/components/BodyDiagram';

// Define a type for valid body parts
type BodyPart = 'Legs' | 'Arms' | 'Abdomen' | 'Back' | 'Shoulders';

export default function BodyFocusScreen() {
  // State variables to manage selected body part, exercise list, modal visibility, and view mode
  const [selectedPart, setSelectedPart] = useState<BodyPart | ''>('');
  const [exerciseList, setExerciseList] = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());
  const [isFrontView, setIsFrontView] = useState(true);

  // Exercise data categorized by front and back views
  const exercises = {
    front: {
      Legs: ['Squats', 'Lunges', 'Leg Press', 'Deadlifts'],
      Arms: ['Bicep Curl', 'Pull-ups', 'Incline Dumbbell Curl', 'Bent-over Rows'],
      Abdomen: ['Crunches', 'Plank', 'Russian Twists', 'Leg Raises'],
    },
    back: {
      Back: ['Lat Pulldown', 'Bent-over Rows', 'Pull-ups', 'Face Pulls', 'Seated Cable Rows', 'Reverse Flys', 'Hyperextensions'],
      Shoulders: ['Overhead Press', 'Arnold Press', 'Lateral Raises', 'Front Raises', 'Reverse Pec Deck', 'Shrugs', 'Upright Rows'],
    },
  };

  // Handles body part selection and opens the modal if valid
  const handleBodyPartClick = (part: BodyPart) => {
    if (isFrontView && (part === 'Back' || part === 'Shoulders')) return;
    if (!isFrontView && part !== 'Back' && part !== 'Shoulders') return;
    setSelectedPart(part);
    setModalVisible(true);
  };

  // Toggles selection of exercises in the modal
  const toggleExerciseSelection = (exercise: string) => {
    setSelectedExercises(prev => {
      const newSet = new Set(prev);
      newSet.has(exercise) ? newSet.delete(exercise) : newSet.add(exercise);
      return newSet;
    });
  };

  // Saves selected exercises to the main exercise list and closes the modal
  const saveSelectedExercises = () => {
    setExerciseList(prev => new Set([...prev, ...selectedExercises]));
    setSelectedExercises(new Set());
    setModalVisible(false);
  };

  // Clears all selected exercises and resets the selected body part
  const clearAllExercises = () => {
    setExerciseList(new Set());
    setSelectedPart('');
  };

  // Toggles between front and back body diagram views
  const toggleView = () => {
    setIsFrontView(prev => !prev);
    setSelectedPart('');
  };

  // Retrieves the appropriate exercise list based on the selected body part and view mode
  const selectedExercisesList = isFrontView
    ? exercises.front[selectedPart as keyof typeof exercises.front] || []
    : exercises.back[selectedPart as keyof typeof exercises.back] || [];

  return (
    <View style={styles.container}>
      {/* Displays the selected exercises */}
      <View style={styles.exerciseContainer}>
        <Text style={styles.exerciseTitle}>Selected Exercises:</Text>
        <FlatList
          data={[...exerciseList]}
          renderItem={({ item }) => <Text style={styles.exerciseText}>• {item}</Text>}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.exerciseListContainer}
        />
        <TouchableOpacity onPress={toggleView} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>{isFrontView ? 'Switch to Back View' : 'Switch to Front View'}</Text>
        </TouchableOpacity>
        {exerciseList.size > 0 && (
          <TouchableOpacity onPress={clearAllExercises} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Displays the interactive body diagram */}
      <View style={styles.bodyDiagramContainer}>
        <BodyDiagram
          onBodyPartClick={handleBodyPartClick}
          imageSource={isFrontView ? require('@/assets/images/body-diagram.png') : require('@/assets/images/body-diagram-back.png')}
        />
      </View>

       {/* Modal for selecting exercises */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select Exercises for {selectedPart}</Text>
          <FlatList
            data={selectedExercisesList}
            renderItem={({ item }) => (
              <Button title={item} onPress={() => toggleExerciseSelection(item)} color={selectedExercises.has(item) ? 'green' : 'blue'} />
            )}
            keyExtractor={item => item}
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

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  exerciseContainer: {  // Controls the layout of the selected exercises section
    marginTop: 500,     // Adjusts the vertical position of the section
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
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
    marginTop: 10,
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
    marginTop: 10, 
  },
  
  clearButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
});


