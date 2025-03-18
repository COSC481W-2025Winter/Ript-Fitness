import React, { useState, useEffect,useRef } from 'react';
import { View, Text, StyleSheet, Modal, Button, FlatList, TouchableOpacity, ActivityIndicator,PanResponder, Animated } from 'react-native';
import BodyDiagram from '@/components/BodyDiagram';
import { httpRequests } from '@/api/httpRequests'; // Use named import
import AuthContext, { useAuth } from '../../../context/AuthContext'; // Adjust the path to the actual location of AuthContext
import { ScrollView } from 'react-native';
import { useContext } from 'react';
import { GlobalContext } from '@/context/GlobalContext';


// Define the BodyPart type
export type BodyPart = 'Core' | 'Legs' | 'Arms' | 'Back' | 'Shoulders'| 'Chest'| 'Cardio'; // Example of defining BodyPart as a type

export default function BodyFocusScreen() {
 // State variables to manage selected body part, exercise list, modal visibility, and view mode
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const [exerciseList, setExerciseList] = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());
  const [isFrontView, setIsFrontView] = useState(true);
  const [loading, setLoading] = useState(false);

 // State for tutorial overlay
 const [showTutorial, setShowTutorial] = useState(true); // Show tutorial on first load
 const [tutorialOpacity] = useState(new Animated.Value(1)); // For fade-out animation

 // Ref to trigger animation in BodyDiagram
 const bodyDiagramRef = useRef<{ triggerAllAnimations:() => void }>(null);
  
  //chatGPT assisted with this section
  const [workoutData, setWorkoutData] = useState<{
    front: { [key in BodyPart]?: string[] };
    back: { [key in BodyPart]?: string[] };
  }>({
    front: {},
    back: {},
  });

  const [error, setError] = useState<string | null>(null);
  const context = useContext(GlobalContext);
  const token = context?.data?.token; //Access the context data with the defined type

// Map BodyPart to backend `exerciseType`
const bodyPartToType: { [key in BodyPart]: number[] } = {
  Arms: [1],
  Shoulders: [2],
  Legs: [5],
  Core: [4],
  Back: [6,7],
  Chest: [3],
  Cardio:[8]
};

// Fetch workouts from backend API when a body part is selected
useEffect(() => {
  let isMounted = true; // Prevents setting state after unmount

  if (!selectedPart || token.trim() === "") {
    return;
  }
  

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
        

        const response = await httpRequests.get(`/exercises/getByType/${type}`, token);

        if (isMounted && response) {
          const exercisesWithNames = response.map((exercise: any) => exercise.nameOfExercise);
          allExercises = [...allExercises, ...exercisesWithNames];
        }
      }

      if (isMounted) {
        setWorkoutData(prev => ({
          ...prev,
          [isFrontView ? 'front' : 'back']: {
            ...prev[isFrontView ? 'front' : 'back'],
            [selectedPart]: allExercises,
          },
        }));
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      if (isMounted) setError(err.message || "Failed to fetch workout data");
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchWorkouts();

  return () => {
    isMounted = false; // Prevents memory leaks
  };
}, [selectedPart, token]);



// Auto-hide tutorial after 3 seconds
useEffect(() => {
  if (showTutorial) {
    const timer = setTimeout(() => {
      Animated.timing(tutorialOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowTutorial(false);
      });
    }, 3000); // Hide after 3 seconds

    return () => clearTimeout(timer);
  }
}, [showTutorial]);

  // Handles body part selection and opens the modal if valid
  const handleBodyPartClick = (part: BodyPart) => {
    console.warn("handleBodyPartClick invoked with:", part);
    if (isFrontView && (part === 'Back' || part === 'Shoulders')) {
      console.warn("Ignored: Front view cannot select Back or Shoulders");
      return;
    }
    if (!isFrontView && part !== 'Back' && part !== 'Shoulders') {
      console.warn("Ignored: Back view allows only Back or Shoulders");
      return;
    }
    setSelectedPart(part);
    console.warn("selectedPart state set to:", part);
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
      setExerciseList(prev => {
        const combined = new Set([...prev, ...selectedExercises]);
        return combined;
    });
    
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
  const toggleView = (direction: 'left' | 'right') => {
    // Trigger animation in BodyDiagram
    if (bodyDiagramRef.current) {
      bodyDiagramRef.current.triggerAllAnimations();
    }
    
    setIsFrontView(prev => {
      const newView = !prev;
      // If switching to the back view while a front-view body part is selected, clear the selection.
      if (newView === false 
        && (selectedPart === "Legs" || selectedPart === "Arms" || selectedPart === "Core"|| selectedPart === "Chest"|| selectedPart === "Cardio")) {
        setSelectedPart(null);
      }
      // If switching to the front view while a back-view body part is selected, clear the selection.
      if (newView === true && (selectedPart === "Back" || selectedPart === "Shoulders")) {
        setSelectedPart(null);
      }
      return newView;
    });
  };

  // PanResponder for handling swipe gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: () => {
      // When the user starts swiping, hide the tutorial immediately
      if (showTutorial) {
        Animated.timing(tutorialOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setShowTutorial(false);
        });
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { dx } = gestureState;
      if (dx > 50) {
        toggleView('right');
      } else if (dx < -50) {
        toggleView('left');
      }
    },
  });

  // Retrieves the appropriate exercise list based on the selected body part and view mode
  const selectedExercisesList = isFrontView
    ? workoutData.front?.[selectedPart as BodyPart] || []
    : workoutData.back?.[selectedPart as BodyPart] || [];

// Flatten just in case items are arrays or weirdly structured
const flattened = [...exerciseList].flat().map(e => String(e).trim());
const uniqueExerciseList = Array.from(new Set(flattened));


  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Displays the selected exercises */}
      <View style={styles.exerciseContainer}>
        <Text style={styles.exerciseTitle}>Selected Exercises:</Text>
        <FlatList
          data={uniqueExerciseList}
          renderItem={({ item }) => <Text style={styles.exerciseText}>• {item}</Text>}
          keyExtractor={(item, index) => `exercise-${item.replace(/\s+/g, "_")}-${index}`}

          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.exerciseListContainer}
        />
        
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          {/* Remove the toggle button and rely on swipe gestures */}
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
          ref={bodyDiagramRef}
          onBodyPartClick={handleBodyPartClick}
          imageSource={isFrontView ? require('@/assets/images/body-diagram.png') : require('@/assets/images/body-diagram-back.png')}
          isFrontView={isFrontView} 
          triggerAnimation={() => bodyDiagramRef.current?.triggerAllAnimations()}
        />
      </View>

       {/* Modal for selecting exercises */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select Exercises for {selectedPart}</Text>
          <FlatList
            data={selectedExercisesList}
            renderItem={({ item }) => (
              <Button title={item} onPress={() => toggleExerciseSelection(item)} 
                      color={selectedExercises.has(item) ? 'rgb(19, 245, 61)' : 'rgb(23, 220, 220)'} />
            )}
            keyExtractor={item => item}
            numColumns={2}
            contentContainerStyle={styles.exerciseListContainer}
          />
          <TouchableOpacity onPress={saveSelectedExercises} style={styles.customButton}>
            <Text style={styles.customButtonText}>Save Selected Exercises</Text>
          </TouchableOpacity>
          <Button title="Close" onPress={() => setModalVisible(false)}/>
        </View>
      </Modal>

    {/* Tutorial Overlay */}
    {showTutorial && (
        <Animated.View style={[styles.tutorialOverlay, { opacity: tutorialOpacity }]}>
          <Text style={styles.tutorialText}>
          ← Swipe 180° →
          </Text>
        </Animated.View>
      )}

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
    marginTop: 510,     // Adjusts the vertical position of the section
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
    top: 490,  // Adjust this value to move the body diagram up or down
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
    shadowColor: '#21BFBF', // Glow color matches the button
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 60, // For Android
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

  // Styles for tutorial overlay
  tutorialOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
});