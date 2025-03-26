import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { GlobalContext, Exercise, Workout } from '@/context/GlobalContext';
import { useNavigation, useRoute, RouteProp} from '@react-navigation/native'; 
import { WorkoutStackParamList} from '@/app/(tabs)/WorkoutStack';
import { WorkoutScreenNavigationProp } from '@/app/(tabs)/WorkoutStack';

// Defining route parameter types
type SelectedExercisesRouteProp = RouteProp<WorkoutStackParamList, 'SelectedExercises'>;

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
  const [allChecked, setAllChecked] = useState<boolean>(false);

  // toggle all exercises selection
  const toggleAllExercises = () => {
    const newState = !allChecked;
    setAllChecked(newState);
    
    if (newState) {
      // Select all exercises
      const allExercises = new Set(Array.from(exerciseList));
      setSelectedExercises(allExercises);
    } else {
      // Deselect all exercises
      setSelectedExercises(new Set());
    }
  };

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
      // Update allChecked state based on whether all exercises are selected
      setAllChecked(newSet.size === exerciseList.size);
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

    context.clearExerciseList();
    context.setSelectedExerciseObjects([]);
    setSelectedExercises(new Set());

    navigation.navigate('MyWorkoutsScreen', { exercises: exerciseObjects });
  };
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Exercises</Text>
      {exerciseList.size > 0 ? (
        <>
          <View style={styles.selectAllContainer}>
            <TouchableOpacity
              style={styles.exerciseRow}
              onPress={toggleAllExercises}
            >
              <View
                style={[
                  styles.selectAllCircle,
                  {
                    backgroundColor: allChecked
                      ? 'rgb(19, 245, 61)' 
                      : 'rgb(23, 220, 220)', 
                  },
                ]}
              >
                {allChecked && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            data={Array.from(exerciseList)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.exerciseRow}
                onPress={() => toggleExerciseSelection(item)}
              >
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
                <Text style={[styles.exerciseText, { marginLeft: 10 }]}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `exercise-${index}`}
            contentContainerStyle={{
              paddingBottom: 20,
              paddingLeft: 0,
              paddingTop: 10,
              width: '100%',
              alignItems: 'flex-start',
            }}
          />
        </>
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
              <Text style={styles.buttonText}>Clear</Text>
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
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 7, 0.82)',
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#21BFBF',
    marginBottom: 10,
    alignSelf: 'center',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingLeft: 70,
    width: '100%',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgb(23, 220, 220)',
  },
  selectAllCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: -40,
    marginTop: -40,
    backgroundColor: 'rgb(23, 220, 220)',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseText: {
    fontSize: 16,
    color: '#21BFBF',
    marginLeft: 10,
  },
  noExercisesText: {
    fontSize: 16,
    color: '#21BFBF',
    marginTop: 20,
    marginLeft: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 20,
    marginBottom: 40,
    marginLeft: 20,
  },
  sendButton: {
    backgroundColor: 'rgba(33, 191, 191, 0.67)',
    width: 80,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  clearButton: {
    backgroundColor: 'rgba(33, 191, 191, 0.67)',
    width: 80,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    padding: 0,
    lineHeight: 20,
  },
  selectAllContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 40,
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(33, 191, 191, 0.3)',
    marginBottom: 10,
    marginTop: -10,
  },
});
