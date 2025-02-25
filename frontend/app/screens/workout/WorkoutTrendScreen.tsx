import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WorkoutTrendScreen() {
  return (
    <View style={styles.container}>
      <Text>Workout Trend Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
