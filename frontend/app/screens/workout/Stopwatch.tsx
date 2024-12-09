import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Stopwatch = () => {
  const [time, setTime] = useState(0); // Time in milliseconds
  const [isRunning, setIsRunning] = useState(false); // To track if stopwatch is running

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined; // For TypeScript: Declare the type properly

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1000); // Increment by 1000 ms (1 second)
      }, 1000);
    } else {
      clearInterval(interval); // Clear the interval if not running
    }

    return () => clearInterval(interval); // Cleanup on unmount
  }, [isRunning]);

  // Format the time (hh:mm:ss)
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(time)}</Text>
      <View style={styles.buttonContainer}>
        {!isRunning ? (
          <Button title="Start" color="#2493BF" onPress={() => setIsRunning(true)} />
        ) : (
          <Button title="Pause" color="#2493BF" onPress={() => setIsRunning(false)} />
        )}
        <Button
          title="Reset"
          onPress={() => {
            setIsRunning(false);
            setTime(0);
          }}
          color="#2493BF" 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: -10,
  },
});

export default Stopwatch;
