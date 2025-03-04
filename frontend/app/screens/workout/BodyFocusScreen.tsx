import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Button, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import BodyDiagram from '@/components/BodyDiagram';
import { httpRequests } from '@/api/httpRequests'; // Use named import
import AuthContext, { useAuth } from '../../../context/AuthContext'; // Adjust the path to the actual location of AuthContext
import { ScrollView } from 'react-native';
// Define the BodyPart type
export type BodyPart = 'Abdomen' | 'Legs' | 'Arms' | 'Back' | 'Shoulders'; // Example of defining BodyPart as a type

export default function BodyFocusScreen() {
 // State variables to manage selected body part, exercise list, modal visibility, and view mode
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const [exerciseList, setExerciseList] = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());
  const [isFrontView, setIsFrontView] = useState(true);
  const [loading, setLoading] = useState(false);
  
  //assisted with this section
  const [workoutData, setWorkoutData] = useState<{
    front: { [key in BodyPart]?: string[] };
    back: { [key in BodyPart]?: string[] };
  }>({
    front: {},
    back: {},
  });
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth(); //Access the context data with the defined type
  

// Map BodyPart to backend `exerciseType`
const bodyPartToType: { [key in BodyPart]: number[] } = {
  Arms: [1],
  Shoulders: [2],
  Legs: [5],
  Abdomen: [4],
  Back: [6,7],
};

// Fetch workouts from backend API when a body part is selected
useEffect(() => {
  if (!selectedPart) return;// prevents selectedPart from being null
  const fetchWorkouts = async () => {
    setLoading(true);
    setError(null);

    try {
      const exerciseTypes = bodyPartToType[selectedPart]; // Get exercise type
      if (!exerciseTypes) {
        throw new Error(`Invalid body part: ${selectedPart}`);
      }

      let allExercises: string[] = [];

      for (const type of exerciseTypes) {

        console.log(`\n=======================\nFetching workouts for type: ${type}`);
        console.log(`\n=======================\n API Call: ${httpRequests.getBaseURL()}/exercises/getByType/${type}`);
        const response = await httpRequests.get(`/exercises/getByType/${type}`, token);
        if (!response.ok) {
          const errorText = await response.text();  // Read the response text
          console.error(` API Error: ${response.status} - ${errorText}`);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }        
        
        const responseData = await response.json();
        console.log("\n=======================\nAPI Response:", responseData);

        // ExerciseTypeToName is no longer used here; instead, the name returned by the backend is used.
        const exercisesWithNames = responseData.map((exercise: any) => exercise.nameOfExercise);

        allExercises = [...allExercises, ...exercisesWithNames];
      }

        //assisted with this section
      setWorkoutData(prev => {
        if (isFrontView) {
          return {
            ...prev,
            front: {
              ...prev.front,
              [selectedPart]: allExercises,
            },
          };
        } else {
          return {
            ...prev,
            back: {
              ...prev.back,
              [selectedPart]: allExercises,
            },
          };
        }
      });
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || 'Failed to fetch workout data');
    } finally {
      setLoading(false);
    }
  };

  fetchWorkouts();
}, [selectedPart,token]); // Run when `selectedPart` changes

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
    setSelectedExercises(new Set()); // Clear the selections in the modal.
    setSelectedPart(null); // Clear the selected body part.
  };

  // Toggles between front and back body diagram views
  const toggleView = () => {
    setIsFrontView(prev => {
      const newView = !prev;
      // If switching to the back view while a front-view body part is selected, clear the selection.
      if (newView === false && (selectedPart === "Legs" || selectedPart === "Arms" || selectedPart === "Abdomen")) {
        setSelectedPart(null);
      }
      // If switching to the front view while a back-view body part is selected, clear the selection.
      if (newView === true && (selectedPart === "Back" || selectedPart === "Shoulders")) {
        setSelectedPart(null);
      }
      return newView;
    });
  };

  // Retrieves the appropriate exercise list based on the selected body part and view mode
  const selectedExercisesList = isFrontView
    ? workoutData.front?.[selectedPart as BodyPart] || []
    : workoutData.back?.[selectedPart as BodyPart] || [];

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
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={toggleView} style={styles.toggleButton}>
            <Text style={styles.toggleButtonText}>{isFrontView ? 'Switch to Back View' : 'Switch to Front View'}</Text>
          </TouchableOpacity>
          
          <View style={{ width: 10 }} />
          
          {exerciseList.size > 0 && (
            <TouchableOpacity onPress={clearAllExercises} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Displays the interactive body diagram */}
      <View style={styles.bodyDiagramContainer}>
        <BodyDiagram
          onBodyPartClick={handleBodyPartClick}
          imageSource={isFrontView ? require('@/assets/images/body-diagram.png') : require('@/assets/images/body-diagram-back.png')}
          isFrontView={isFrontView}  
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
    backgroundColor: "rgba(0, 0, 7, 0.82)", 
  },
  exerciseContainer: {  // Controls the layout of the selected exercises section
    marginTop: 480,     // Adjusts the vertical position of the section
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
    top: 470,  // Adjust this value to move the body diagram up or down
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
    backgroundColor: "rgba(4, 4, 25, 0.73)",
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


