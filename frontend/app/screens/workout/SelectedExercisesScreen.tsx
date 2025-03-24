import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { GlobalContext, Exercise, Workout } from '@/context/GlobalContext';
import { useNavigation, useRoute, RouteProp} from '@react-navigation/native'; 
import { WorkoutStackParamList} from '@/app/(tabs)/WorkoutStack';
import { WorkoutScreenNavigationProp } from '@/app/(tabs)/WorkoutStack';

import { httpRequests } from "@/api/httpRequests";

// Defining route parameter types
type SelectedExercisesRouteProp = RouteProp<WorkoutStackParamList, 'SelectedExercises'>;

// Add an interface to store backend data
interface ExerciseData {
  exerciseId: number;
  sets: number;
  reps: number[];
  weight: number[];
  nameOfExercise: string;
  description: string | null;
  exerciseType: number;
  isDeleted: boolean;
}

export default function SelectedExercisesScreen() {
  const context = useContext(GlobalContext);
  const exerciseList = context?.exerciseList || new Set<string>(); 
  const clearExerciseList = context?.clearExerciseList; 
  const navigation = useNavigation<WorkoutScreenNavigationProp>();
  const route = useRoute<SelectedExercisesRouteProp>();

  // received dataBodyFocusScreen 
  const exercises: string[] = route.params?.exercises || [];
  console.log("Received exercises from BodyFocusScreen:", exercises);

  // local state tracking selected exercise
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());

  // toggle selected status
  const toggleExerciseSelection = (exerciseName: string) => {
    console.log("Toggling exercise:", exerciseName);
    setSelectedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseName)) {
        newSet.delete(exerciseName);
        console.log("Removed exercise:", exerciseName);
      } else {
        newSet.add(exerciseName);
        console.log("Added exercise:", exerciseName);
      }
      console.log("Current selected exercises:", Array.from(newSet));
      return newSet;
    });
  };

  // send selected exercises to MyWorkoutsScreen
  const sendSelectedExercises = () => {
    if (context?.addWorkout) {
      console.log("=== Starting sendSelectedExercises ===");
      
      // check selected exercises
      if (selectedExercises.size === 0) {
        Alert.alert("Error", "Please select at least one exercise");
        return;
      }

      // check context.selectedExerciseObjects is empty
    if (!context.selectedExerciseObjects || context.selectedExerciseObjects.length === 0) {
      Alert.alert("Error", "No exercises available. Please go back and select exercises.");
      return;
    }
      
      const exerciseObjects: Exercise[] = context.selectedExerciseObjects.filter(
        ex => selectedExercises.has(ex.nameOfExercise)
      );
    
      // add logs
    console.log("Selected exercises:", Array.from(selectedExercises));
    console.log("context.selectedExerciseObjects:", context.selectedExerciseObjects);
    console.log("Filtered exerciseObjects:", exerciseObjects);
    
    // check exerciseObjects is empty
    if (exerciseObjects.length === 0) {
      Alert.alert("Error", "No matching exercises found. Please go back and select exercises.");
      return;
    }
      // construct new workout object
    const newWorkout: Workout = {
      id: Date.now(), // use timestamp as ID
      name: `Workout ${new Date().toLocaleString()}`, // eg: "Workout 3/23/2025, 2:10 PM"
      exercises: exerciseObjects,
      isDeleted: false
    };

    // add new context.workouts list
    context.addWorkout(newWorkout);
    // clear exerciseList and selectedExerciseObjects

      /*console.log("All converted exercise objects:", exerciseObjects);
      
      // set to context
      context.setSelectedExerciseObjects(exerciseObjects);
      
      // navigate to MyWorkoutsScreen, pass new exercises
      console.log("Navigating to MyWorkoutsScreen with exercises");
      //context.setSelectedExerciseObjects(exerciseObjects);
      navigation.navigate('MyWorkoutsScreen', { exercises: [] });*/
      


      //navigation.navigate('MyWorkoutsScreen', { exercises: exerciseObjects });
      
    /*if (context.clearExerciseList) {
      context.clearExerciseList(); // clear exerciseList
    }*/
      if (context.setExerciseList && context.setSelectedExerciseObjects) {
        // keep unselected exercises
        const remainingExerciseList = new Set(
          Array.from(context.exerciseList).filter(
            exerciseName => !selectedExercises.has(exerciseName)
          )
        );
        const remainingExerciseObjects = context.selectedExerciseObjects.filter(
          ex => !selectedExercises.has(ex.nameOfExercise)
        );
  
        // update context.exerciseList and context.selectedExerciseObjects
        context.setExerciseList(remainingExerciseList);
        context.setSelectedExerciseObjects(remainingExerciseObjects);
      }
      // Clear the current selection and prepare for the next selection
      setSelectedExercises(new Set());
      //navigation.navigate({ name: 'MyWorkoutsScreen', params: {} });
      //navigation.navigate('MyWorkoutsScreen', { exercises: exerciseObjects });

    } else {
      console.error("setSelectedExerciseObjects is not available in context");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Exercises</Text>
      {exerciseList.size > 0 ? (
        <FlatList
          data={Array.from(exerciseList)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.exerciseRow}
              onPress={() => toggleExerciseSelection(item)}
            >
              {/* circular checkbox */}
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: selectedExercises.has(item)
                      ? 'rgb(19, 245, 61)' 
                      : 'rgb(23, 220, 220)', 
                  },
                ]}
              >
                {selectedExercises.has(item) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.exerciseText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `exercise-${index}`}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingLeft: 0,
            alignItems: 'flex-start',
          }}
        />
      ) : (
        <Text style={styles.noExercisesText}>No exercises selected yet.</Text>
      )}
      <View style={styles.buttonContainer}>
        {exerciseList.size > 0 && (
          <>
            <TouchableOpacity onPress={sendSelectedExercises} style={styles.sendButton}>
              <Text style={styles.buttonText}> Send </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearExerciseList} style={styles.clearButton}>
              <Text style={styles.buttonText}>Clear All</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 7, 0.82)',
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#21BFBF',
    marginBottom: 20,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseText: {
    fontSize: 16,
    color: '#21BFBF',
  },
  noExercisesText: {
    fontSize: 16,
    color: '#21BFBF',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
    marginBottom: 30,
  },
  sendButton: {
    backgroundColor: 'rgba(33, 191, 191, 0.82)',
    padding: 7,
    borderRadius: 5,
  },
  clearButton: {
    backgroundColor: 'rgba(33, 191, 191, 0.82)',
    padding: 7,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});