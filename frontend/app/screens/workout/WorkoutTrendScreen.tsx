import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Animated, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

//Color mapping
const metricColors = {
  calories: "red",
  protein: "#00BFFF", //Bright blue
  carbs: "#32CD32", // Bright green
  fat: "#FFA500", // Orange
};

// Get labels for the last 30 days (display every 5 days)
const getLast30DaysLabels = () => {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 29 + i);
    return i % 5 === 0 ? date.toLocaleString("en-US", { month: "short", day: "2-digit" }) : "";
  });
};

// Generate data for 7 days and 30 days (moderate fluctuations)
const generateData = (min: number, max: number, days: number) => {
  return Array.from({ length: days }, (_, i) =>
    (Math.random() * (max - min) + min + Math.sin(i) * 10).toFixed(2) // Limit to 2 decimal places
  ).map(Number);
};

export default function NutritionTrendScreen() {
  const [isThirtyDays, setIsThirtyDays] = useState(false);
  const [chartAnimation] = useState(new Animated.Value(0));
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null); // Selected data point index
  const [clickedDotIndex, setClickedDotIndex] = useState<number | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null); // Currently selected metric


  // Pre-store 7-day and 30-day data to prevent regeneration when switching
  const [sevenDayData] = useState({
    calories: generateData(1700, 2100, 7),
    protein: generateData(60, 120, 7),
    carbs: generateData(160, 280, 7),
    fat: generateData(40, 90, 7),
  });

  const [thirtyDayData] = useState({
    calories: generateData(1700, 2100, 30),
    protein: generateData(60, 120, 30),
    carbs: generateData(160, 280, 30),
    fat: generateData(40, 90, 30),
  });

  useEffect(() => {
    Animated.timing(chartAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [isThirtyDays]);

  const labels = isThirtyDays ? getLast30DaysLabels() : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Select 7-day or 30-day data
  const dataSource = isThirtyDays ? thirtyDayData : sevenDayData;

  // Calculate total amount (display total if no data point is clicked)
  const calculateTotal = (dataArray: number[]) =>
    dataArray.reduce((a, b) => a + b, 0).toFixed(2);

  // Calculate total amount (display total if no data point is clicked)
  const totalValues = selectedDayIndex !== null
    ? {
        total_calories: dataSource.calories[selectedDayIndex],
        total_protein: dataSource.protein[selectedDayIndex],
        total_carbs: dataSource.carbs[selectedDayIndex],
        total_fat: dataSource.fat[selectedDayIndex],
      }
    : {
        total_calories: calculateTotal(dataSource.calories),
        total_protein: calculateTotal(dataSource.protein),
        total_carbs: calculateTotal(dataSource.carbs),
        total_fat: calculateTotal(dataSource.fat),
      };

  const handleMetricClick = (metric: string) => {
    setSelectedMetric(selectedMetric === metric ? null : metric); // Clicking again deselects
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Nutrition Trend</Text>

      {/* Toggle between 7 days and 30 days */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>7 Days</Text>
        <Switch value={isThirtyDays} onValueChange={() => {
          setIsThirtyDays(!isThirtyDays);
          setSelectedDayIndex(null); // Reset selection when switching
        }} />
        <Text style={styles.switchLabel}>30 Days</Text>
      </View>

      {/* Calories Line Chart (with click interaction) */}
      <Text style={[styles.chartTitle, { marginBottom: 6 }]}>Calories Trend</Text>

      <View style={styles.chartContainer}>
          {/* Additional shadow layer (only visible when `calories` is selected) */}
          { selectedMetric === "calories" && (
          <View style={styles.shadowEffect} /> )}
      </View>

      <Animated.View style={{ opacity: chartAnimation }}>
        <LineChart
          data={{
            labels: labels,
            datasets: [{  data: dataSource.calories, 
                          strokeWidth: selectedMetric === "calories" ? 5 : 3, //  Bold when selected
                          color: () => selectedMetric === "calories" ? "rgb(246, 57, 48)" : "rgb(235, 27, 16)", // Brighten when selected
                        }],               
                        }}
          width={screenWidth - 40}
          height={170}
          chartConfig={chartConfig}
          bezier
          withVerticalLines={false}
          withDots={true}
          onDataPointClick={({ index }) => {
            setClickedDotIndex((prevIndex) => (prevIndex === index ? null : index)); 
            setSelectedDayIndex((prevIndex) => (prevIndex === index ? null : index));
            setTimeout(() => setClickedDotIndex(null), 800); // **Restore after 800ms**
          }}
          renderDotContent={({ x, y, index }) => (
            <View
            style={{
              position: "absolute",
              left: x - (clickedDotIndex === index ? 8 : 3),  //Enlarge the clicked dot
              top: y - (clickedDotIndex === index ? 8 : 3),
              width: clickedDotIndex === index ? 16 : 6, //Default size is small, enlarges when clicked
              height: clickedDotIndex === index ? 16 : 6,
              borderRadius: clickedDotIndex === index ? 8 : 3, //Keep circular shape
              backgroundColor: "#48efff", // Uniform color
              borderWidth: clickedDotIndex === index ? 2 : 0, //Add border when clicked
              borderColor: clickedDotIndex === index ? "#ffffff" : "transparent",
              }}
            />
          )} 
        />
      </Animated.View>
      

      {/* Protein, Carbs, Fat Line Chart */}
      <Text style={[styles.chartTitle, { marginTop: 25 }]}>Protein, Carbs & Fat Trend</Text>
      <View style={styles.chartContainer}>
    {/* Additional shadow layer (only visible when the corresponding metric is selected) */}
    {selectedMetric && (
      <View style={[styles.shadowEffect, { 
        shadowColor: selectedMetric ? metricColors[selectedMetric as keyof typeof metricColors] : "transparent", 
        backgroundColor: selectedMetric ? metricColors[selectedMetric as keyof typeof metricColors] + "40" : "transparent" // 40 represents transparency
        }]} />
    )}

      <Animated.View style={{ opacity: chartAnimation }}>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              { data: dataSource.protein, 
                strokeWidth: selectedMetric === "protein" ? 6 : 2, //Bold when selected
                color: () => selectedMetric === "protein" ? "rgb(4, 187, 248)" : "rgba(0, 191, 255, 0.89)", },
              { data: dataSource.carbs,
                strokeWidth: selectedMetric === "carbs" ? 6 : 2, // Bold when selected
                color: () => selectedMetric === "carbs" ? "rgba(50, 205, 50, 1)" : "rgba(50, 205, 50, 0.89)", },
              { data: dataSource.fat,
                strokeWidth: selectedMetric === "fat" ? 6 : 2, // Bold when selected
                color: () => selectedMetric === "fat" ? "rgba(255, 165, 0, 1)" : "rgba(255, 166, 0, 0.98)", },
            ],
          }}
          width={screenWidth - 40}
          height={170}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withVerticalLines={false}
          withDots={!isThirtyDays} // Hide dots in 30-day mode
        />
      </Animated.View>
      </View>

      {/* Total Data Display (Aligned in Two Columns) */}
      <View style={styles.totalContainer}>
        <View style={styles.rowContainer}>
        <TouchableOpacity 
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }} 
        onPress={() => handleMetricClick("calories")}>
          <View style={[styles.dot, 
          { backgroundColor: metricColors.calories,
            width: selectedMetric === "calories" ? 16 : 10, //Enlarges when clicked
            height: selectedMetric === "calories" ? 16 : 10,
            borderRadius: selectedMetric === "calories" ? 8 : 4,
          }]} />
          <Text style={styles.totalText}>
            Calories: <Text style={styles.totalValue}>{totalValues.total_calories}</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }} 
        onPress={() => handleMetricClick("protein")}>
          <View style={[styles.dot, 
            { backgroundColor: metricColors.protein,
              width: selectedMetric === "protein" ? 16 : 10, // Enlarges when clicked
              height: selectedMetric === "protein" ? 16 : 10,
              borderRadius: selectedMetric === "protein" ? 8 : 4,
            }]} />
          <Text style={styles.totalText}>
            Protein: <Text style={styles.totalValue}>{totalValues.total_protein}g</Text>
          </Text>
        </TouchableOpacity>
        </View>

       
        <View style={styles.rowContainer}>
        <TouchableOpacity 
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }} 
          onPress={() => handleMetricClick("carbs")}>
            <View style={[styles.dot, 
            { backgroundColor: metricColors.carbs,
              width: selectedMetric === "carbs" ? 16 : 10, //Enlarges when clicked
              height: selectedMetric === "carbs" ? 16 : 10,
              borderRadius: selectedMetric === "carbs" ? 8 : 4,
            }]} />
          
          <Text style={styles.totalText}>
            Carbs: <Text style={styles.totalValue}>{totalValues.total_carbs}g</Text>
          </Text>
        </TouchableOpacity>

          
        <TouchableOpacity 
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }} 
          onPress={() => handleMetricClick("fat")}>
            <View style={[styles.dot, 
            { backgroundColor: metricColors.fat,
              width: selectedMetric === "fat" ? 16 : 10, // Enlarges when clicked
              height: selectedMetric === "fat" ? 16 : 10,
              borderRadius: selectedMetric === "fat" ? 8 : 4,
            }]} />
          <Text style={styles.totalText}>
            Fat: <Text style={styles.totalValue}>{totalValues.total_fat}g</Text>
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Line Chart Configuration
const chartConfig = {
  backgroundGradientFrom: "#0f2027",
  backgroundGradientTo: "#203a43",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(72, 239, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

  // Make the shadow area of the line chart appear as a hazy blue color
  fillShadowGradient: "rgba(10, 101, 192, 0.25)",  // Hazy blue fill
  fillShadowGradientOpacity: 0.3,  // Opacity 0.3 (adjustable)
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: "rgba(233, 244, 244, 0.34)", // Make background lines lighter
  },
  propsForDots: { r: "4", strokeWidth: "3", stroke: "#48efff" },
  yAxisMinimum: 0,
};

//Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(0, 0, 7, 0.82)", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#48efff", marginBottom: 20 },
  switchContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  switchLabel: { fontSize: 16, marginHorizontal: 10, fontWeight: "bold", color: "#48efff" },
  chart: { marginVertical: 10, borderRadius: 16, alignSelf: "center", },
  totalContainer: { marginTop: 20, alignItems: "center" },
  rowContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 10 },
  totalText: { fontSize: 16, fontWeight: "bold", color: "#48efff" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#48efff",
  },

  highlightedLine: {
    shadowColor: "red", // Add a red glow to the selected line
    shadowOffset: { width: 0, height: 3 }, // Lift the line upwards
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 6, 
    transform: [{ scale: 1.02 }], // Slightly enlarge the selected line
  },
  
  dot: {
    width: 12, //Slightly enlarge the selected line
    height: 12,
    borderRadius: 6, // Keep it circular
    marginRight: 8, // Right margin spacing
  },

  shadowEffect: {
    position: "absolute",
    top: 20,
    left: 10,
    width: screenWidth - 60,
    height: 150,
    backgroundColor: "rgba(255, 69, 58, 0.2)", // Add a shadow effect to the selected line
    borderRadius: 10,
    shadowColor: "red",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8, 
    transform: [{ translateY: -5 }, { scale: 1.02 }], // Slightly enlarge & float
  },

  chartContainer: {
    position: "relative", //  Ensure `shadowEffect` overlays `LineChart`
  },

});
