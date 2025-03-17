import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Animated, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get("window").width;

// Color mapping for metrics
const metricColors = {
  calories: "red",
  protein: "#00BFFF",
  carbs: "#32CD32",
  fat: "#FFA500",
};

// Define the interface for data items
interface DataItem {
  value: number;
  date: string;
}

// Define the interface for nutrition summary
interface NutritionSummary {
  calories: number[];
  protein: number[];
  carbs: number[];
  fat: number[];
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
}

// Define the interface for API response
interface NutritionData {
  daily: NutritionSummary;
  weekly: NutritionSummary;
  monthly: NutritionSummary;
}

/**
 * Generates labels for the last 30 days, displaying every 5th day.
 * If data is empty, returns an array of 7 empty labels as a fallback.
 */
const getLast30DaysLabels = (data: number[]) => {
  if (!data || data.length === 0) return Array(7).fill("");
  const labels = Array(data.length).fill("");
  return data.map((_, i) =>
    i % 5 === 0 ? new Date(Date.now() - (data.length - 1 - i) * 24 * 60 * 60 * 1000).toLocaleString("en-US", { month: "short", day: "2-digit" }) : ""
  );
};


 // Checks if the data is in a date-based format (e.g., keys are dates like "2023-10-01").
function isDateBasedFormat(data: any): boolean {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const keys = Object.keys(data);
    if (keys.length > 0) {
      const firstKey = keys[0];
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      return datePattern.test(firstKey);
    }
  }
  return false;
}

/**
 * Converts date-based data format (e.g., {"2025-02-25": {...}}) to a category-based NutritionSummary format.
 * Extracts calories, protein, carbs, and fat values from date-keyed data and organizes them into arrays.
 * Sorts dates chronologically and calculates totals.
 */
function convertDateToCategoryFormat(data: { [date: string]: { calories: number, protein: number, carbs: number, fat: number } }): NutritionSummary {
  const result: NutritionSummary = {
    calories: [],
    protein: [],
    carbs: [],
    fat: [],
    total_calories: 0,
    total_protein: 0,
    total_carbs: 0,
    total_fat: 0,
  };

  const sortedDates = Object.keys(data).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  sortedDates.forEach((date) => {
    const dayData = data[date];
    result.calories.push(dayData.calories);
    result.protein.push(dayData.protein);
    result.carbs.push(dayData.carbs);
    result.fat.push(dayData.fat);
  });

  return result;
}

/**
 * Converts daily data (array format, e.g., [{date: "2025-03-16", ...}, ...]) to a category-based NutritionSummary format.
 * Extracts calories, protein, carbs, and fat values from daily data entries and organizes them into arrays.
 * Sorts entries by date and calculates totals.
 */
function convertDailyToCategoryFormat(data: { date: string, calories: number, totalCarbs: number, totalProtein: number, totalFat: number }[]): NutritionSummary {
  const result: NutritionSummary = {
    calories: [],
    protein: [],
    carbs: [],
    fat: [],
    total_calories: 0,
    total_protein: 0,
    total_carbs: 0,
    total_fat: 0,
  };

  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  sortedData.forEach((entry) => {
    result.calories.push(entry.calories);
    result.protein.push(entry.totalProtein);
    result.carbs.push(entry.totalCarbs);
    result.fat.push(entry.totalFat);
  });

  return result;
}

export default function NutritionTrendScreen() {
  const [isThirtyDays, setIsThirtyDays] = useState(false);
  const [chartAnimation] = useState(new Animated.Value(0));
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [clickedDotIndex, setClickedDotIndex] = useState<number | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [data, setData] = useState<NutritionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const [dotScale] = useState(new Animated.Value(1));
  const [glowAnimation] = useState(new Animated.Value(0.5));

  const WEEKLY_TRENDS_URL = 'http://ript-fitness-app.azurewebsites.net/Calculator/getWeeklyTrends';
  const MONTHLY_TRENDS_URL = 'http://ript-fitness-app.azurewebsites.net/nutritionCalculator/getMonthlyTrends';
  const DAILY_TRENDS_URL = 'http://ript-fitness-app.azurewebsites.net/nutritionCalculator/getDailyTrends'; // 假设的每日数据 URL
  const TOKEN = 'eyJhBcOi0JUZiN1Nj9.eYzdWi0IjSt...';

  /**
   * Fetches nutrition trend data from the backend based on the selected time range.
   * Updates the data state with the fetched results, handles loading and error states,
   * and converts data to category-based format depending on the structure.
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const url = isThirtyDays ? MONTHLY_TRENDS_URL : DAILY_TRENDS_URL; // Use daily trends for 7-day view

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const fetchedData = await response.json();
        console.log("Fetched data from backend:", JSON.stringify(fetchedData, null, 2));

        if (!fetchedData || !fetchedData.daily || !fetchedData.weekly || !fetchedData.monthly) {
          throw new Error("Invalid response format from server.");
        }

        // Convert data based on its structure
        const nutritionData: NutritionData = {
          daily: convertDailyToCategoryFormat(fetchedData.daily),
          weekly: convertDateToCategoryFormat(fetchedData.weekly),
          monthly: convertDateToCategoryFormat(fetchedData.monthly),
        };

        setData(nutritionData);
      } catch (err: any) {
        console.error('Fetch error:', err.message);
        setError('Failed to fetch nutrition data. Please try again.');
        Alert.alert('Error', 'Failed to fetch nutrition data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isThirtyDays]);

  /**
   * Animates the chart's opacity when the time range changes (7 days to 30 days or vice versa).
   * The animation fades in the chart over 2000ms.
   */
  useEffect(() => {
    Animated.timing(chartAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [isThirtyDays]);

  /**
   * Sets up a looping animation for the breathing light effect on dots.
   * The glow animation oscillates between 0.5 and 0.9 opacity over 500ms per phase.
   */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 0.9,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnimation]);

  const dataSource = data
    ? {
        calories: isThirtyDays ? data.monthly.calories : data.daily.calories,
        protein: isThirtyDays ? data.monthly.protein : data.daily.protein,
        carbs: isThirtyDays ? data.monthly.carbs : data.daily.carbs,
        fat: isThirtyDays ? data.monthly.fat : data.daily.fat,
      }
    : {
        calories: [1801, 1830, 1700, 1600, 1800, 1850, 1100],
        protein: [70, 75, 65, 60, 70, 80, 50],
        carbs: [200, 210, 190, 180, 200, 220, 150],
        fat: [50, 55, 45, 40, 50, 60, 30],
      };

  console.log('dataSource:', dataSource);

  const labels = isThirtyDays
    ? getLast30DaysLabels(dataSource.calories)
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  console.log('labels:', labels);

  const totalValues = {
    daily: {
      total_calories: selectedDayIndex !== null ? dataSource.calories[selectedDayIndex] : (data ? data.daily.calories[0] : 1800),
      total_protein: selectedDayIndex !== null ? dataSource.protein[selectedDayIndex] : (data ? data.daily.protein[0] : 70),
      total_carbs: selectedDayIndex !== null ? dataSource.carbs[selectedDayIndex] : (data ? data.daily.carbs[0] : 200),
      total_fat: selectedDayIndex !== null ? dataSource.fat[selectedDayIndex] : (data ? data.daily.fat[0] : 50),
    },
    weekly: {
      total_calories: data ? data.weekly.total_calories : 12600,
      total_protein: data ? data.weekly.total_protein : 490,
      total_carbs: data ? data.weekly.total_carbs : 1400,
      total_fat: data ? data.weekly.total_fat : 350,
    },
    monthly: {
      total_calories: data ? data.monthly.total_calories : 54000,
      total_protein: data ? data.monthly.total_protein : 2100,
      total_carbs: data ? data.monthly.total_carbs : 6000,
      total_fat: data ? data.monthly.total_fat : 1500,
    },
  };

  /**
 * Handles the click event for a nutrition metric, toggling its selected state.
 * If the clicked metric matches the currently selected metric, deselects it (sets to null);
 * otherwise, selects the new metric.
 */
  const handleMetricClick = (metric: string) => {
    setSelectedMetric(selectedMetric === metric ? null : metric);
  };

  const handleDotClick = (index: number) => {
    setClickedDotIndex((prevIndex) => (prevIndex === index ? null : index));
    setSelectedDayIndex((prevIndex) => (prevIndex === index ? null : index));
  };


  //Animates the dot by scaling it up to 1.2x over 100ms and 
  // back to 1x over another 100ms using a sequence animation.
  const animateDot = () => {
    Animated.sequence([
      Animated.timing(dotScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(dotScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
      onPress={() => handleDotClickWithAnimation(index)}
      style={{
        position: "absolute",
        left: x - (clickedDotIndex === index ? 10 : 6),
        top: y - (clickedDotIndex === index ? 10 : 6),
        width: clickedDotIndex === index ? 19 : 11,
        height: clickedDotIndex === index ? 19 : 11,
        borderRadius: clickedDotIndex === index ? 10 : 6,
        backgroundColor: clickedDotIndex === index ? "hsl(180, 100%, 70%)" : "hsla(180, 91.10%, 69.00%, 0.90)",
        borderWidth: clickedDotIndex === index ? 2 : 1,
        borderColor: clickedDotIndex === index ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)",
        shadowColor: "#ffffff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: clickedDotIndex === index ? 0.9 : glowAnimation,
        shadowRadius: clickedDotIndex === index ? 10 : 10,
        elevation: clickedDotIndex === index ? 15 : 12,
        transform: [{ scale: clickedDotIndex === index ? dotScale : 1 }],
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
        backgroundColor: "rgba(72, 240, 255, 0.97)",
        borderWidth: clickedDotIndex === index ? 2 : 0,
        borderColor: clickedDotIndex === index ? "#ffffff" : "transparent",
        shadowOpacity: 0,
      }}
    />
  );

  // Line Chart Configuration
  const chartConfig = {
    backgroundGradientFrom: "#0f2027", // the starting color(a dark teal shade).
    backgroundGradientTo: "#203a43", // the ending color(a slightly lighter teal shade).
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(72, 239, 255, ${opacity})`, // color of the chart lines, with a default opacity of 1.
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, //the color of the chart labels (e.g., axis labels)
    fillShadowGradient: "rgba(10, 101, 192, 0.25)", //the fill color under the chart lines as a hazy blue with low opacity for a subtle effect
    fillShadowGradientOpacity: 0.3,  //0.3 for a faint appearance

    // Customizes the background grid lines of the chart.
    propsForBackgroundLines: {
      strokeWidth: 1,   // Sets the thickness of the background grid lines to 1 pixel.
      stroke: "rgba(233, 244, 244, 0.34)",
    },

    // Configures the appearance of data point dots on the chart.
    propsForDots: { r: "4", strokeWidth: "3", stroke: "#48efff" },
    yAxisMinimum: 0,  
    
    // Customizes the horizontal (Y-axis) labels on the chart.
    propsForHorizontalLabels: {
      fontSize: 12,
      textAlign: "center",
      dx: isThirtyDays ? 0 : 0,  // Adjusts the horizontal offset of Y-axis labels (0 for both 7-day and 30-day views).
    },
    propsForVerticalLabels: {
      fontSize: 12,
      dx: isThirtyDays ? 25 : 0,   // Adjusts the horizontal offset of X-axis labels (25 pixels right for 30-day view, 
    },                               // 0 for 7-day view to align with data points). 
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#48efff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Display error message without blocking LineChart rendering */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.header}>Nutrition Trend</Text>
      {/* Toggle between 7 days and 30 days */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>7 Days</Text>
        <Switch value={isThirtyDays} onValueChange={() => {
          setIsThirtyDays(!isThirtyDays);
          setSelectedDayIndex(null);
          setClickedDotIndex(null);
        }} />
        <Text style={styles.switchLabel}>30 Days</Text>
      </View>

      {/* Calories Line Chart (with click interaction) */}
      <Text style={[styles.chartTitle, { marginBottom: 7 }]}>Calories</Text>

      <View style={styles.chartContainer}>
        {/* Additional shadow layer (only visible when `calories` is selected) */}
        {selectedMetric === "calories" && (
          <View style={styles.shadowEffect} />
        )}
      </View>
      <Animated.View style={{ opacity: chartAnimation }}>
        <LineChart
          data={{
            labels: labels,
            datasets: [{
              key: "calories-dataset",
              data: dataSource.calories,
              strokeWidth: selectedMetric === "calories" ? 5 : 3,
              color: () => selectedMetric === "calories" ? "rgb(246, 57, 48)" : "rgb(235, 27, 16)",
            }],
          }}
          width={screenWidth - 40}
          height={170}
          chartConfig={chartConfig}
          bezier        //Bezier curves for the line chart
          withVerticalLines={false}
          withDots={true}
          style={styles.chart}
          onDataPointClick={({ index }) => handleDotClickWithAnimation(index)}
          renderDotContent={({ x, y, index, indexData }) => 
            renderBrightDot({ x, y, index, indexData, datasetKey: "calories-dataset" })
          }
        />
      </Animated.View>

      {/* Protein, Carbs, Fat Line Chart */}
      <Text style={[styles.chartTitle, { marginTop: 25 }]}>Protein, Carbs & Fat</Text>
      <View style={styles.chartContainer}>
        {/* Additional shadow layer (only visible when the corresponding metric is selected) */}
        {selectedMetric && (
          <View style={[styles.shadowEffect, { 
            shadowColor: selectedMetric ? metricColors[selectedMetric as keyof typeof metricColors] : "transparent", 
            backgroundColor: selectedMetric ? metricColors[selectedMetric as keyof typeof metricColors] + "40" : "transparent"
          }]} />
        )}

        <Animated.View style={{ opacity: chartAnimation }}>
          <LineChart
            data={{
              labels: labels,
              datasets: [
                { 
                  key: "protein-dataset", 
                  data: dataSource.protein, 
                  strokeWidth: selectedMetric === "protein" ? 6 : 2,
                  color: () => selectedMetric === "protein" ? "rgb(4, 187, 248)" : "rgba(0, 191, 255, 0.89)",
                },
                { 
                  key: "carbs-dataset", 
                  data: dataSource.carbs, 
                  strokeWidth: selectedMetric === "carbs" ? 6 : 2,
                  color: () => selectedMetric === "carbs" ? "rgba(50, 205, 50, 1)" : "rgba(50, 205, 50, 0.89)",
                },
                { 
                  key: "fat-dataset", 
                  data: dataSource.fat, 
                  strokeWidth: selectedMetric === "fat" ? 6 : 2,
                  color: () => selectedMetric === "fat" ? "rgba(255, 165, 0, 1)" : "rgba(255, 166, 0, 0.98)",
                },
              ],
            }}
            width={screenWidth - 40}
            height={170}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withVerticalLines={false}
            withDots={!isThirtyDays}
            renderDotContent={({ x, y, index }) => {
              let datasetKey = "";
              if (index < dataSource.protein.length) datasetKey = "protein-dataset";
              else if (index < dataSource.protein.length + dataSource.carbs.length) datasetKey = "carbs-dataset";
              else if (index < dataSource.protein.length + dataSource.carbs.length + dataSource.fat.length) datasetKey = "fat-dataset";
        
              return renderNormalDot({ x, y, index, indexData: index, datasetKey });
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
        </View>

        <View style={styles.rowContainer}>
          <TouchableOpacity 
            style={[styles.column, { flexDirection: "row", alignItems: "center", marginBottom: 8 }]}
            onPress={() => handleMetricClick("calories")}>
            <View style={[styles.dot, 
              { backgroundColor: metricColors.calories,
                width: selectedMetric === "calories" ? 16 : 10,
                height: selectedMetric === "calories" ? 16 : 10,
                borderRadius: selectedMetric === "calories" ? 8 : 4,
              }]} />
            <View style={{flexDirection:"row", alignItems: "center"}}>
              <Text style={styles.totalText}> Calories: </Text>
              <Text style={styles.totalValue}>
                {selectedDayIndex !== null ? totalValues.daily.total_calories : (isThirtyDays ? totalValues.monthly.total_calories : totalValues.weekly.total_calories)}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.column, { flexDirection: "row", alignItems: "center", marginBottom: 8 }]}
            onPress={() => handleMetricClick("protein")}>
            <View style={[styles.dot, 
              { backgroundColor: metricColors.protein,
                width: selectedMetric === "protein" ? 16 : 10,
                height: selectedMetric === "protein" ? 16 : 10,
                borderRadius: selectedMetric === "protein" ? 8 : 4,
              }]} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.totalText}>Protein: </Text>
              <Text style={styles.totalValue}>
                {selectedDayIndex !== null ? totalValues.daily.total_protein : (isThirtyDays ? totalValues.monthly.total_protein : totalValues.weekly.total_protein)} g</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.rowContainer}>
          <TouchableOpacity 
            style={[styles.column, { flexDirection: "row", alignItems: "center", marginBottom: 8 }]}
            onPress={() => handleMetricClick("carbs")}>
            <View style={[styles.dot, 
              { backgroundColor: metricColors.carbs,
                width: selectedMetric === "carbs" ? 16 : 10,
                height: selectedMetric === "carbs" ? 16 : 10,
                borderRadius: selectedMetric === "carbs" ? 8 : 4,
              }]} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.totalText}>Carbs: </Text>
              <Text style={styles.totalValue}>
                {selectedDayIndex !== null ? totalValues.daily.total_carbs : (isThirtyDays ? totalValues.monthly.total_carbs : totalValues.weekly.total_carbs)} g</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.column, { flexDirection: "row", alignItems: "center", marginBottom: 8 }]}
            onPress={() => handleMetricClick("fat")}>
            <View style={[styles.dot, 
              { backgroundColor: metricColors.fat,
                width: selectedMetric === "fat" ? 16 : 10,
                height: selectedMetric === "fat" ? 16 : 10,
                borderRadius: selectedMetric === "fat" ? 8 : 4,
              }]} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.totalText}>Fat: </Text>
              <Text style={styles.totalValue}>
                {selectedDayIndex !== null ? totalValues.daily.total_fat : (isThirtyDays ? totalValues.monthly.total_fat : totalValues.weekly.total_fat)} g</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(0, 0, 7, 0.9)", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#48efff", marginBottom: 20 },
  switchContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  switchLabel: { fontSize: 16, marginHorizontal: 10, fontWeight: "bold", color: "#48efff" },
  chart: { marginVertical: 10, marginTop: -6, borderRadius: 16, alignSelf: "center", elevation: 4 },
  totalContainer: { marginTop: 20, alignItems: "center" },
  rowContainer: { 
    flexDirection: "row", 
    width: "100%", 
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  column: { 
    width: 160,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  totalText: { fontSize: 16, fontWeight: "bold", color: "#48efff" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  timeRangeContainer: {
    backgroundColor: "rgba(68, 68, 68, 0.5)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
    marginTop: -12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -250,
    width: 90,
    height: 25,
  },
  icon: {
    marginLeft: 5,
  },
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
    marginTop: -0,
  },
  highlightedLine: {
    shadowColor: "red",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 8,
    marginRight: 8,
  },
  shadowEffect: {
    position: "absolute",
    top: 20,
    left: 10,
    width: screenWidth - 55,
    height: 153,
    backgroundColor: "rgba(255, 69, 58, 0.3)",
    borderRadius: 10,
    shadowColor: "red",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
    transform: [{ translateY: -5 }, { scale: 1.02 }],
  },
  chartContainer: {
    position: "relative",
    alignItems: "center",
    width: screenWidth - 40,
    marginHorizontal: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 7, 0.9)",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 7, 0.9)",
    marginTop: -10,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#48efff",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});