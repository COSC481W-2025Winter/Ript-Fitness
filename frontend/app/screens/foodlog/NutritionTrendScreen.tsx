import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Animated, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from "@expo/vector-icons"; // Ensure FontAwesome is imported

const screenWidth = Dimensions.get("window").width;

//Color mapping
const metricColors = {
  calories: "red",
  protein: "#00BFFF", //Bright blue
  carbs: "#32CD32", // Bright green
  fat: "#FFA500", // Orange
};

// Define the interface for data items
interface DataItem {
  value: number;
  date: string;
}

// Generate data for 7 days and 30 days (moderate fluctuations)
const generateData = (min: number, max: number, days: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1) + i); // Start from "days" ago
    return {
      value: Number((Math.random() * (max - min) + min + Math.sin(i) * 10).toFixed(2)),
      date: date.toISOString().split("T")[0], // Date (format: YYYY-MM-DD)
    };
  });
};

// Get labels for the last 30 days (display every 5 days)
const getLast30DaysLabels = (data: DataItem[]) => {
  return data.map((item, i) => 
    i % 5 === 0 ? new Date(item.date).toLocaleString("en-US", { month: "short", day: "2-digit" }) : ""
  );
};

export default function NutritionTrendScreen() {
  const [isThirtyDays, setIsThirtyDays] = useState(false);
  const [chartAnimation] = useState(new Animated.Value(0));
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null); // Selected data point index
  const [clickedDotIndex, setClickedDotIndex] = useState<number | null>(null); //State for clicked dot
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null); // Currently selected metric
  const navigation = useNavigation();
  // Add a scale animation value in the component
  const [dotScale] = useState(new Animated.Value(1));
  // Add a glow animation value for breathing light effect
  const [glowAnimation] = useState(new Animated.Value(0.5));

  // Pre-store 7-day and 30-day data to prevent regeneration when switching
  const [sevenDayData] = useState<{
    calories: DataItem[];
    protein: DataItem[];
    carbs: DataItem[];
    fat: DataItem[];
  }>({
    calories: generateData(1700, 2100, 7),
    protein: generateData(60, 120, 7),
    carbs: generateData(160, 280, 7),
    fat: generateData(40, 90, 7),
  });

  const [thirtyDayData] = useState<{
    calories: DataItem[];
    protein: DataItem[];
    carbs: DataItem[];
    fat: DataItem[];
  }>({
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

  // Add a looping animation for the breathing light effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 0.9, // Increase glow
          duration: 500, // Animation duration (1 second)
          useNativeDriver: true, // Use native driver for better performance
        }),
        Animated.timing(glowAnimation, {
          toValue: 0.5, // Decrease glow
          duration: 500, 
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnimation]);

  // Select data source and dynamically generate labels
  const dataSource = isThirtyDays ? thirtyDayData : sevenDayData; // Select 7-day or 30-day data
  const labels = isThirtyDays ? getLast30DaysLabels(dataSource.calories) : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Calculate total amount (display total if no data point is clicked)
  const calculateTotal = (dataArray: { value: number; date: string }[]) =>
    dataArray.reduce((a, b) => a + b.value, 0).toFixed(2);

  // Calculate total amount (display total if no data point is clicked)
  const totalValues = selectedDayIndex !== null
    ? {
        total_calories: dataSource.calories[selectedDayIndex].value,
        total_protein: dataSource.protein[selectedDayIndex].value,
        total_carbs: dataSource.carbs[selectedDayIndex].value,
        total_fat: dataSource.fat[selectedDayIndex].value,
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

  // Handle dot click event
  const handleDotClick = (index: number) => {
    setClickedDotIndex((prevIndex) => (prevIndex === index ? null : index));
    setSelectedDayIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const animateDot = () => {
    Animated.sequence([
      Animated.timing(dotScale, {
        toValue: 1.2, // Scale up to 1.2x
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(dotScale, {
        toValue: 1, // Scale back to original size
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // Trigger animation on click
  const handleDotClickWithAnimation = (index: number) => {
    handleDotClick(index);
    animateDot();
  };

   // Bright dot for Calories LineChart
  const renderBrightDot = ({ x, y, index, indexData, datasetKey }: { 
          x: number; 
          y: number; 
          index: number; 
          indexData: number; 
          datasetKey: string 
        }) => (      
    <TouchableOpacity
      key={`dot-${datasetKey}-${index}-${indexData}-${x.toFixed(2)}-${y.toFixed(2)}`}
      onPress={() => handleDotClickWithAnimation(index)} // Use component-level animation logic
      style={{
        position: "absolute",
        left: x - (clickedDotIndex === index ? 10 : 6), 
        top: y - (clickedDotIndex === index ? 10 : 6),
        width: clickedDotIndex === index ? 19 : 11,
        height: clickedDotIndex === index ? 19 : 11,
        borderRadius: clickedDotIndex === index ? 10 : 6,
        backgroundColor: clickedDotIndex === index ? "hsl(180, 100%, 70%)" : "hsla(180, 91.10%, 69.00%, 0.90)", // 未点击时非常明亮
        borderWidth: clickedDotIndex === index ? 2 : 1, // Border even when not clicked
        borderColor: clickedDotIndex === index ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)", // 未点击时也有明亮边框
        shadowColor: "#ffffff", // Add glow effect
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: clickedDotIndex === index ? 0.9 : glowAnimation, //Use dynamic glow when not clicked
        shadowRadius: clickedDotIndex === index ? 10 : 10, // Slightly smaller glow when not clicked
        elevation: clickedDotIndex === index ? 15 : 12, // Shadow even when not clicked
        transform: [{ scale: clickedDotIndex === index ? dotScale : 1 }], // Add animation effect
      }}
    />
  );

  // Normal dot for Protein, Carbs & Fat LineChart
const renderNormalDot = ({ x, y, index, indexData, datasetKey }: { 
  x: number; 
  y: number; 
  index: number; 
  indexData: number; 
  datasetKey: string 
}) => (
  <View
    key={`dot-${datasetKey}-${index}-${indexData}-${x.toFixed(2)}-${y.toFixed(2)}`}
    style={{
      position: "absolute",
      left: x - (clickedDotIndex === index ? 6 : 3),
      top: y - (clickedDotIndex === index ? 6 : 3),
      width: clickedDotIndex === index ? 16 : 8,
      height: clickedDotIndex === index ? 16 : 8,
      borderRadius: clickedDotIndex === index ? 8 : 3,
      backgroundColor: "rgba(72, 240, 255, 0.97)", // Darker default color
      borderWidth: clickedDotIndex === index ? 2 : 0,
      borderColor: clickedDotIndex === index ? "#ffffff" : "transparent",
      shadowOpacity: 0, // No glow
    }}
  />
);

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
  // Adjust label styles to ensure alignment
  propsForHorizontalLabels: {
    fontSize: 12,
    textAlign: "center",
    dx: isThirtyDays ? 0 : 0, // Ensure Y-axis labels do not shift
  },
  propsForVerticalLabels: {
    fontSize: 12,
    dx: isThirtyDays ? 25 : 0, // ove X-axis labels 25 pixels right for 30-day view, 0 for 7-day view to align with data points
  },
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
  <Text style={[styles.chartTitle, { marginBottom: 7 }]}>Calories Trend</Text>

      <View style={styles.chartContainer}>
          {/* Additional shadow layer (only visible when `calories` is selected) */}
          { selectedMetric === "calories" && (<View style={styles.shadowEffect} /> )}
      </View>

      <Animated.View style={{ opacity: chartAnimation }}>
        <LineChart
          data={{
            labels: labels, 
            datasets: [{  
                        key: "calories-dataset", // Add unique key
                        data: dataSource.calories.map(item => item.value), // Use value field 
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
          onDataPointClick={({ index }) => handleDotClickWithAnimation(index)} //Use click event with animation
          renderDotContent={({ x, y, index, indexData }) => 
            renderBrightDot({ x, y, index, indexData, datasetKey: "calories-dataset" }) // Manually pass datasetKey
          }       
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
              { 
                key: "protein-dataset", 
                data: dataSource.protein.map(item => item.value), 
                strokeWidth: selectedMetric === "protein" ? 6 : 2, //Bold when selected
                color: () => selectedMetric === "protein" ? "rgb(4, 187, 248)" : "rgba(0, 191, 255, 0.89)", },
              { 
                key: "carbs-dataset", 
                data: dataSource.carbs.map(item => item.value), 
                strokeWidth: selectedMetric === "carbs" ? 6 : 2, // Bold when selected
                color: () => selectedMetric === "carbs" ? "rgba(50, 205, 50, 1)" : "rgba(50, 205, 50, 0.89)", },
              { 
                key: "fat-dataset", 
                data: dataSource.fat.map(item => item.value), 
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
          renderDotContent={({ x, y, index }) => {
            // Iterate through datasets to find the corresponding datasetKey
            let datasetKey = "";
            if (dataSource.protein.includes(dataSource.protein[index])) datasetKey = "protein-dataset";
            else if (dataSource.carbs.includes(dataSource.carbs[index])) datasetKey = "carbs-dataset";
            else if (dataSource.fat.includes(dataSource.fat[index])) datasetKey = "fat-dataset";
      
            return renderNormalDot({ x, y, index, indexData: index, datasetKey }); // Pass `indexData`
          }}
        />
      </Animated.View>
      </View>


 {/* Total Data Display (Aligned in Two Columns) */}
  <View style={styles.totalContainer}>

        {/* Add time range indicator */}
        <View style={styles.timeRangeContainer}>
        <Text style={styles.timeRangeText}>
        {selectedDayIndex !== null ? "1 Day" : isThirtyDays ? "30 Days" : "7 Days"}
        </Text>
         {selectedDayIndex === null && ( // Only show in 7 Days and 30 Days view
          <FontAwesome5 name="plus" size={12} color="#fff" style={styles.icon} />
        )}       
        </View>

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


//Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(0, 0, 7, 0.82)", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#48efff", marginBottom: 20 },
  switchContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  switchLabel: { fontSize: 16, marginHorizontal: 10, fontWeight: "bold", color: "#48efff" },
  chart: { marginVertical: 10,  marginTop: -6, borderRadius: 16, alignSelf: "center", },
  totalContainer: { marginTop: 20, alignItems: "center" },
  rowContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 10 },
  totalText: { fontSize: 16, fontWeight: "bold", color: "#48efff" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  //Background style for time range
  timeRangeContainer: {
    backgroundColor: "rgba(68, 68, 68, 0.5)",  // 0.5 represents 50% transparency
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,  //Add some space between the time range and the values
    marginTop: -12,  // Adjust this value to increase the distance from the LineChart
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    marginLeft: -250,
    width: 90,  //Set width
    height: 25,  //Set height
  },
  icon: {
    marginLeft: 5, // Add spacing between the icon and text
  },
  // Text style for time range
  timeRangeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#48efff",
    marginTop: -0, // Increase distance from the top
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
    width: 14, //Slightly enlarge the selected line
    height: 14,
    borderRadius: 8, // Keep it circular
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
    alignItems: "center", 
    width: screenWidth - 40, 
    marginHorizontal: 0, 
  },
});
