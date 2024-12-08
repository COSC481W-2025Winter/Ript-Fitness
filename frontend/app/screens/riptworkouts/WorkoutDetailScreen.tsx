import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Workout } from './RiptWorkouts';
import { ThemedText } from '@/components/ThemedText';
import StreakHeader from '@/components/StreakHeader';

type WorkoutDetailScreenRouteProp = RouteProp<
  { params: { workout:  Workout } },
  'params'
>;

export default function WorkoutDetailScreen() {
  const { params: { workout } } = useRoute<WorkoutDetailScreenRouteProp>();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{workout.name}</ThemedText>

      <View style={styles.textWrapper}>
        <ThemedText style={styles.dateText}>{workout.level}: {workout.time} min</ThemedText>
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
    textAlign: 'center'
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
  text: {
    color: 'black',
    // fontWeight: 'bold',
    fontSize: 20,
    padding: 20,
    position: 'absolute',
    top: -5, 
    // textAlign: 'center',
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
});
