import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Workout } from './RiptWorkouts';
import { ThemedText } from '@/components/ThemedText';
import { httpRequests } from '../../../api/httpRequests';
import { GlobalContext } from '@/context/GlobalContext';

type WorkoutDetailScreenRouteProp = RouteProp<
  { params: { workout: Workout } },
  'params'
>;

export default function WorkoutDetailScreen() {
  const {
    params: { workout },
  } = useRoute<WorkoutDetailScreenRouteProp>();

  const gblContext = useContext(GlobalContext);
  const token = gblContext?.data.token;

  const handleAddWorkout = async () => {
    if (!token) {
      Alert.alert('Error', 'You must be logged in to perform this action.');
      console.error('User is not authenticated. Token is missing.');
      return;
    }

    console.log('Retrieved token:', token);

    const formatRepsToList = (reps: number | string | number[]): number[] => {
      if (Array.isArray(reps)) {
        return reps.map((rep) => parseInt(rep.toString(), 10));
      } else if (typeof reps === 'string') {
        const matches = reps.match(/\d+/g);
        if (matches) {
          return matches.map((rep) => parseInt(rep, 10));
        } else {
          return [];
        }
      } else if (typeof reps === 'number') {
        return [reps];
      } else {
        return [];
      }
    };

    const workoutData = {
      workoutsId: null,
      name: workout.name,
      isDeleted: false,
      exerciseIds: [],
      exercises: workout.exercises.map((ex) => ({
        exerciseId: null,
        sets: parseInt(ex.sets.toString(), 10),
        reps: formatRepsToList(ex.reps),
        isDeleted: false,
        weight: [],
        nameOfExercise: ex.exercise,
        description: '',
        exerciseType: 0,
        accountReferenceId: null,
      })),
    };

    console.log('Formatted workoutData:', JSON.stringify(workoutData, null, 2));

    try {
      // Add the Workout
      console.log('Sending request to add workout...');
      const workoutResponse = await fetch(`${httpRequests.getBaseURL()}/workouts/addWorkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workoutData),
      });

      console.log('Workout response status:', workoutResponse.status);

      if (workoutResponse.status === 200 || workoutResponse.status === 201) {
        const addedWorkout = await workoutResponse.json();
        console.log('Added Workout Response:', JSON.stringify(addedWorkout, null, 2));

        const workoutsId = addedWorkout.workoutsId;
        console.log('Extracted workoutsId:', workoutsId);

        if (!workoutsId) {
          throw new Error('Workout ID not returned from the server.');
        }

        // Add each Exercise with the workoutsId
        const addExercisePromises = workoutData.exercises.map((exercise, index) => {
          const exerciseData = {
            ...exercise,
            workout: workoutsId, // Correctly include workout
          };

          console.log(`Preparing to add Exercise ${index + 1}:`, JSON.stringify(exerciseData, null, 2));

          return fetch(`${httpRequests.getBaseURL()}/exercises/addExercise`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(exerciseData),
          })
            .then((response) => {
              console.log(`Exercise ${index + 1} response status:`, response.status);
              return response;
            })
            .catch((error) => {
              console.error(`Error adding Exercise ${index + 1}:`, error);
              throw error;
            });
        });

        const exerciseResponses = await Promise.all(addExercisePromises);
        console.log('All exercise responses:', exerciseResponses);

        // Check for any failed exercise additions
        const failedExercises = exerciseResponses.filter(
          (res) => res.status !== 200 && res.status !== 201
        );

        if (failedExercises.length > 0) {
          Alert.alert(
            'Error',
            `Workout added, but ${failedExercises.length} out of ${workout.exercises.length} exercises failed to add.`
          );
          console.error('Some exercises failed to add:', failedExercises);
        } else {
          Alert.alert('Success', 'All Workouts and Exercises added successfully!');
        }
      } else {
        const errorText = await workoutResponse.text();
        console.error('Workout addition failed. Status:', workoutResponse.status);
        console.error('Error response text:', errorText);
        let errorMessage = `Error ${workoutResponse.status}: ${errorText}`;
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Exception occurred while adding workout and exercises:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{workout.name}</ThemedText>

      <View style={styles.textWrapper}>
        <ThemedText style={styles.dateText}>
          {workout.level}: {workout.time} min
        </ThemedText>
      </View>

      <FlatList
        data={workout.exercises}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.exercise}>
            <Text style={styles.exerciseName}>{item.exercise}</Text>
            <Text style={styles.exerciseText}>
              {item.sets} sets x {item.reps} reps
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddWorkout}>
        <Text style={styles.buttonText}>Add this to My Workouts!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  exercise: {
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginVertical: 5,
  },
  exerciseText: {
    fontSize: 18,
    color: '#000000',
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  textWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#2493BF',
    padding: 5,
    borderRadius: 40,
    width: '80%',
    bottom: 10,
  },
  dateText: {
    color: 'white',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#2493BF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
