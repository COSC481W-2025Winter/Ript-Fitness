import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Animated } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

// Get screen width
const screenWidth = Dimensions.get("window").width;

// Get the last 30 days' actual dates (display every 5 days)
const getLast30DaysLabels = () => {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 29 + i); // Start from 30 days ago
    return i % 5 === 0 ? date.toLocaleString("en-US", { month: "short", day: "2-digit" }) : "";
  });
};

// Generate random data for the last 30 days
const generateDataFor30Days = () => {
  return Array.from({ length: 30 }, () => Math.floor(Math.random() * 100));
};

export default function WorkoutTrendScreen() {
  const [isThirtyDays, setIsThirtyDays] = useState(false); // Toggle between 7-day
  const [chartAnimation] = useState(new Animated.Value(0)); // Animation control

  // Start animation
  useEffect(() => {
    Animated.timing(chartAnimation, {
      toValue: 1,
      duration: 2000, // 2-second animation
      useNativeDriver: false,
    }).start();
  }, [isThirtyDays]);

  // X-axis labels
  const labels = isThirtyDays ? getLast30DaysLabels() : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Exercise & nutrition data
  const exerciseData = {
    labels: labels,
    datasets: [{ 
      data: isThirtyDays ? generateDataFor30Days() : [30, 45, 28, 80, 99, 43, 50], 
      strokeWidth: 3 // Increase line thickness
    }],
  };

  const nutritionData = {
    labels: labels,
    datasets: [{ 
      data: isThirtyDays ? generateDataFor30Days().map(d => d * 10 + 1500) : [2000, 2100, 1900, 2200, 2300, 1950, 2050], 
      strokeWidth: 3 
    }],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Workout Trend Screen</Text>

      {/* 7-day/30-day toggle */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>7 Days</Text>
        <Switch value={isThirtyDays} onValueChange={setIsThirtyDays} />
        <Text style={styles.switchLabel}>30 Days</Text>
      </View>

      {/* Exercise trend */}
      <Text style={styles.chartTitle}>Exercise Trend</Text>
      <Animated.View style={{ opacity: chartAnimation }}>
        <LineChart
          data={exerciseData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withVerticalLines={false} // Remove vertical grid lines
          withDots={true} // Keep data points
        />
      </Animated.View>

      {/* Nutrition trend */}
      <Text style={styles.chartTitle}>Nutrition Trend</Text>
      <Animated.View style={{ opacity: chartAnimation }}>
        <LineChart
          data={nutritionData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withVerticalLines={false}
          withDots={true}
        />
      </Animated.View>
    </ScrollView>
  );
}

// Chart configuration
const chartConfig = {
  backgroundGradientFrom: "#0f2027",
  backgroundGradientTo: "#203a43",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(72, 239, 255, ${opacity})`, 
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White X-axis labels
  style: { borderRadius: 16 },
  propsForLabels: { fontSize: 12 },
  propsForDots: { r: "3", strokeWidth: "3", stroke: "#48efff" }, //Increase dot size
  yAxisMinimum: 0,
  labelRotation: 0, // Prevent rotation
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: "rgba(255,255,255,0.2)", // Soften background grid lines
  },
  strokeWidth: 3, // Thicker curve
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#1c1c1c", 
    backgroundColor: "rgba(0, 0, 7, 0.82)",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#48efff", 
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    marginHorizontal: 10,
    fontWeight: "bold",
    color: "#48efff",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#48efff",
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
    alignSelf: "center",
  },
});
