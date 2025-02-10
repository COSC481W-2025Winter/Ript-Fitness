import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";

// define CurrentEditing type
type CurrentEditing = {
  rowId: number | string;
  setIndex: number;
} | null;

const TimerScreen = () => {
  const [workoutData, setWorkoutData] = useState([
    { id: 1, exercise: "Rong exercise", sets: 2, time: ["Not Started", "Not Started"] },
    { id: 2, exercise: "Back in Action", sets: 2, time: ["Not Started", "Not Started"] },
  ]);

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentEditing, setCurrentEditing] = useState<CurrentEditing>(null); // 当前正在计时的行和列

  useEffect(() => {
    let timer: number | NodeJS.Timeout | undefined;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  
    return () => {
      if (timer !== undefined) {
        clearInterval(timer); // Clear the timer
      }
    };
  }, [isRunning]);
  
  const startTimer = (rowId: number | string, setIndex: number): void => {
    setCurrentEditing({ rowId, setIndex });
    setSeconds(0);
    setIsRunning(true);
  };
  

  const stopTimer = () => {
    if (currentEditing) {
      const { rowId, setIndex } = currentEditing;

      // Update time data
      setWorkoutData((prevData) =>
        prevData.map((item) =>
          item.id === rowId
            ? {
                ...item,
                time: item.time.map((t, index) =>
                  index === setIndex ? new Date(seconds * 1000).toISOString().substr(11, 8) : t
                ),
              }
            : item
        )
      );
    }
    setIsRunning(false);
    setCurrentEditing(null);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={workoutData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.exercise}>{item.exercise}</Text>
            {item.time.map((t, index) => (
              <View key={index} style={styles.timeRow}>
                <Text>Set {index + 1}: {t}</Text>
                <Button
                  title="Start Timer"
                  onPress={() => startTimer(item.id, index)}
                />
              </View>
            ))}
          </View>
        )}
      />
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>
          {new Date(seconds * 1000).toISOString().substr(11, 8)}
        </Text>
        <View style={styles.buttons}>
          <Button title={isRunning ? "Stop" : "Start"} onPress={isRunning ? stopTimer : resetTimer} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  row: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  exercise: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  timerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  timer: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
});

export default TimerScreen;
