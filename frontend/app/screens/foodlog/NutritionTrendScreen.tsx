import React, { useState, useEffect, useContext, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Animated, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { httpRequests } from "@/api/httpRequests";
import { GlobalContext } from "@/context/GlobalContext";

const screenWidth = Dimensions.get("window").width;

// Color mapping
const metricColors = {
  calories: "red",
  protein: "#00BFFF", // Bright blue
  carbs: "#32CD32", // Bright green
  fat: "#FFA500", // Orange
};

// Define the interface for data items
interface DataItem {
  value: number;
  date: string;
}

// Fixed 7-day labels (starting from today backwards)
const getFixedWeeklyLabels = () => {
  const labels = [];
  const date = new Date();
  for (let i = 6; i >= 0; i--) {
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
  }
  return labels;
};

// Modified generateData to align with fixed dates
const generateData = (min: number, max: number, days: number) => {
  const data = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      value: Number((Math.random() * (max - min) + min + Math.sin(i) * 10).toFixed(2)),
      date: date.toISOString().split("T")[0],
    });
  }
  return data;
};

// Get labels for the last 30 days (display every 5 days)
const getLast30DaysLabels = (data: number[]) => {
  if (!data || data.length === 0) return Array(7).fill("");
  return data.map((_, i) =>
    i % 5 === 0 ? new Date(Date.now() - (data.length - 1 - i) * 24 * 60 * 60 * 1000).toLocaleString("en-US", { month: "short", day: "2-digit" }) : ""
  );
};

export default function NutritionTrendScreen() {
  const context = useContext(GlobalContext);

  const [isThirtyDays, setIsThirtyDays] = useState(false);
  const [chartAnimation] = useState(new Animated.Value(0));
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [clickedDotIndex, setClickedDotIndex] = useState<number | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [loadingCount, setLoadingCount] = useState(0); // Track number of active requests
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const [dotScale] = useState(new Animated.Value(1));
  const [glowAnimation] = useState(new Animated.Value(0.5));

  // Define the type for weekly and monthly data
  type NutritionPeriodData = { [date: string]: { calories: number; carbs: number; fat: number; fiber: number; protein: number; sodium: number; sugars: number } } | null;
  const [weekly, setWeekly] = useState<NutritionPeriodData>(null);
  const [monthly, setMonthly] = useState<NutritionPeriodData>(null);

  // Initialize 7-day data with proper dates
  const initialWeeklyData = {
    calories: generateData(1700, 2100, 7),
    protein: generateData(60, 120, 7),
    carbs: generateData(160, 280, 7),
    fat: generateData(40, 90, 7),
  };

  // Pre-store 7-day and 30-day data
  const [weeklyData, setWeeklyData] = useState<{
    calories: DataItem[];
    protein: DataItem[];
    carbs: DataItem[];
    fat: DataItem[];
  }>(initialWeeklyData);

  const [monthlyData, setMonthlyData] = useState<{
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

  // Log initial weeklyData to verify
  console.log("Initial weeklyData:", weeklyData);

  // Helper functions to manage loading state
  const startLoading = () => setLoadingCount((prev) => prev + 1);
  const stopLoading = () => setLoadingCount((prev) => Math.max(0, prev - 1));
  const isLoading = loadingCount > 0;

  useEffect(() => {
    loadNutritionWeekly();
    loadNutritionMonthly();
  }, []);

  // Handle weekly data updates
  useEffect(() => {
    if (weekly && typeof weekly === 'object' && !Array.isArray(weekly) && Object.keys(weekly).length > 0) {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      
      const myCalories: DataItem[] = [];
      const myProtein: DataItem[] = [];
      const myCarbs: DataItem[] = [];
      const myFat: DataItem[] = [];

      const dates = Object.keys(weekly).sort();
      let previousCalories = 0;
      let previousProtein = 0;
      let previousCarbs = 0;
      let previousFat = 0;

      for (const weeklyDate of dates) {
        const { calories, carbs, protein, fat } = weekly[weeklyDate];
        console.log(`Weekly Date: ${weeklyDate}`);
        console.log(`Raw value - Calories: ${calories}, Carbs: ${carbs}, Protein: ${protein}, Fat: ${fat}`);

        const independentCalories = calories - previousCalories;
        const independentProtein = protein - previousProtein;
        const independentCarbs = carbs - previousCarbs;
        const independentFat = fat - previousFat;

        console.log(`Independent value - Calories: ${independentCalories}, Carbs: ${independentCarbs}, Protein: ${independentProtein}, Fat: ${independentFat}`);

        myCalories.push({ value: independentCalories, date: weeklyDate });
        myProtein.push({ value: independentProtein, date: weeklyDate });
        myCarbs.push({ value: independentCarbs, date: weeklyDate });
        myFat.push({ value: independentFat, date: weeklyDate });

        previousCalories = calories;
        previousProtein = protein;
        previousCarbs = carbs;
        previousFat = fat;
      }

      console.log("Updated weeklyData:", { calories: myCalories, protein: myProtein, carbs: myCarbs, fat: myFat });
      setWeeklyData({
        calories: myCalories.length > 0 ? myCalories : initialWeeklyData.calories,
        protein: myProtein.length > 0 ? myProtein : initialWeeklyData.protein,
        carbs: myCarbs.length > 0 ? myCarbs : initialWeeklyData.carbs,
        fat: myFat.length > 0 ? myFat : initialWeeklyData.fat,
      });
    }
  }, [weekly]);

  // Handle monthly data updates
  useEffect(() => {
    if (monthly && typeof monthly === 'object' && !Array.isArray(monthly)) {
      const myCalories: DataItem[] = [];
      const myProtein: DataItem[] = [];
      const myCarbs: DataItem[] = [];
      const myFat: DataItem[] = [];

      const dates = Object.keys(monthly).sort();
      let previousCalories = 0;
      let previousProtein = 0;
      let previousCarbs = 0;
      let previousFat = 0;

      for (const monthlyDate of dates) {
        const { calories, carbs, protein, fat } = monthly[monthlyDate];
        console.log(`Monthly Date: ${monthlyDate}`);
        console.log(`Raw value - Calories: ${calories}, Carbs: ${carbs}, Protein: ${protein}, Fat: ${fat}`);

        const independentCalories = calories - previousCalories;
        const independentProtein = protein - previousProtein;
        const independentCarbs = carbs - previousCarbs;
        const independentFat = fat - previousFat;

        console.log(`Independent value - Calories: ${independentCalories}, Carbs: ${independentCarbs}, Protein: ${independentProtein}, Fat: ${independentFat}`);

        myCalories.push({ value: independentCalories, date: monthlyDate });
        myProtein.push({ value: independentProtein, date: monthlyDate });
        myCarbs.push({ value: independentCarbs, date: monthlyDate });
        myFat.push({ value: independentFat, date: monthlyDate });

        previousCalories = calories;
        previousProtein = protein;
        previousCarbs = carbs;
        previousFat = fat;
      }

      console.log("Updated monthlyData:", { calories: myCalories, protein: myProtein, carbs: myCarbs, fat: myFat });
      setMonthlyData({
        calories: myCalories,
        protein: myProtein,
        carbs: myCarbs,
        fat: myFat,
      });
    }
  }, [monthly]);

  const loadNutritionWeekly = async () => {
    startLoading();
    setError(null);

    try {
      const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/getWeeklyTrends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context?.data.token}`,
        },
      });
      if (response.status === 200) {
        const nutritionWeekly = await response.json();
        if (nutritionWeekly && typeof nutritionWeekly === 'object' && !Array.isArray(nutritionWeekly)) {
          setWeekly(nutritionWeekly);
        } else {
          console.error('loadNutritionWeekly: Invalid data format', nutritionWeekly);
          setError('loadNutritionWeekly: Invalid data format received');
          Alert.alert('Error', 'Invalid data format received');
        }
        console.log("loadNutritionWeekly", nutritionWeekly);
      } else {
        console.error('loadNutritionWeekly: fetch error: ', response.status);
        setError(`loadNutritionWeekly: Failed to fetch: ${response.status}`);
        Alert.alert(`loadNutritionWeekly: Failed to fetch: ${response.status}`);
      }
    } catch (err: any) {
      console.error('loadNutritionWeekly: fetch error: ', err.message);
      setError(`loadNutritionWeekly: Failed to fetch: ${err.message}`);
      Alert.alert(`loadNutritionWeekly: Failed to fetch: ${err.message}`);
    } finally {
      stopLoading();
    }
  };

  const loadNutritionMonthly = async () => {
    startLoading();
    setError(null);

    try {
      const response = await fetch(`${httpRequests.getBaseURL()}/nutritionCalculator/getMonthlyTrends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context?.data.token}`,
        },
      });
      if (response.status === 200) {
        const nutritionMonthly = await response.json();
        if (nutritionMonthly && typeof nutritionMonthly === 'object' && !Array.isArray(nutritionMonthly)) {
          setMonthly(nutritionMonthly);
        } else {
          console.error('loadNutritionMonthly: Invalid data format', nutritionMonthly);
          setError('loadNutritionMonthly: Invalid data format received');
          Alert.alert('Error', 'Invalid data format received');
        }
        console.log("loadNutritionMonthly", nutritionMonthly);
      } else {
        console.error('loadNutritionMonthly: fetch error: ', response.status);
        setError(`loadNutritionMonthly: Failed to fetch: ${response.status}`);
        Alert.alert(`loadNutritionMonthly: Failed to fetch: ${response.status}`);
      }
    } catch (err: any) {
      console.error('loadNutritionMonthly: fetch error: ', err.message);
      setError(`loadNutritionMonthly: Failed to fetch: ${err.message}`);
      Alert.alert(`loadNutritionMonthly: Failed to fetch: ${err.message}`);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    Animated.timing(chartAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [weeklyData]);

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

  const dataSource = isThirtyDays ? monthlyData : weeklyData; // Select dataSource based on isThirtyDays
  const labels = useMemo(() => {
    if (isThirtyDays) {
      return getLast30DaysLabels(dataSource.calories.map((item) => item.value));
    } else {
      return dataSource.calories.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString("en-US", { weekday: "short" });
      });
    }
  }, [isThirtyDays, dataSource]);

  const calculateTotal = (dataArray: { value: number; date: string }[]) =>
    Math.round(dataArray.reduce((a, b) => a + b.value, 0));

  const totalValues = selectedDayIndex !== null
    ? {
        total_calories: Math.round(dataSource.calories[selectedDayIndex].value),
        total_protein: Math.round(dataSource.protein[selectedDayIndex].value),
        total_carbs: Math.round(dataSource.carbs[selectedDayIndex].value),
        total_fat: Math.round(dataSource.fat[selectedDayIndex].value),
      }
    : {
        total_calories: calculateTotal(dataSource.calories),
        total_protein: calculateTotal(dataSource.protein),
        total_carbs: calculateTotal(dataSource.carbs),
        total_fat: calculateTotal(dataSource.fat),
      };

  const handleMetricClick = (metric: string) => {
    setSelectedMetric(selectedMetric === metric ? null : metric);
  };

  const handleDotClick = (index: number) => {
    setClickedDotIndex((prevIndex) => (prevIndex === index ? null : index));
    setSelectedDayIndex((prevIndex) => (prevIndex === index ? null : index));
  };

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

  const renderBrightDot = ({ x, y, index, datasetKey }: { 
    x: number; 
    y: number; 
    index: number; 
    datasetKey: string; 
  }) => {
    const date = dataSource.calories[index]?.date || `index-${index}`; // Fallback to index if date is undefined
    return (
      <TouchableOpacity
        key={`dot-${datasetKey}-${date}-${index}-${x.toFixed(2)}-${y.toFixed(2)}-${Math.random()}`} // Add random suffix to ensure uniqueness
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
  };

  const renderNormalDot = ({ x, y, index, datasetKey }: { 
    x: number; 
    y: number; 
    index: number; 
    datasetKey: string; 
  }) => {
    const dataset = dataSource[datasetKey.replace('-dataset', '') as keyof typeof dataSource] as DataItem[] | undefined;
    const date = dataset && dataset[index] ? dataset[index].date : `index-${index}`;
    const value = dataset && dataset[index] ? dataset[index].value : `value-${index}`;

    return (
      <View
        key={`dot-${datasetKey}-${date}-${value}-${index}-${x.toFixed(2)}-${y.toFixed(2)}-${Math.random()}`} // Add random suffix to ensure uniqueness
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
  };

  const chartConfig = {
    backgroundGradientFrom: "#0f2027",
    backgroundGradientTo: "#203a43",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(72, 239, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    fillShadowGradient: "rgba(10, 101, 192, 0.25)",
    fillShadowGradientOpacity: 0.3,
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "rgba(233, 244, 244, 0.34)",
    },
    propsForDots: { r: "4", strokeWidth: "3", stroke: "#48efff" },
    yAxisMinimum: 0,
    propsForHorizontalLabels: {
      fontSize: 12,
      textAlign: "center",
      dx: isThirtyDays ? 0 : 0,
    },
    propsForVerticalLabels: {
      fontSize: 12,
      dx: isThirtyDays ? 25 : 0,
    },
  };

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#48efff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.header}>Nutrition Trend</Text>

          {/* Toggle between 7 days and 30 days */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>7 Days</Text>
            <Switch
              value={isThirtyDays}
              onValueChange={() => {
                setIsThirtyDays(!isThirtyDays);
                setSelectedDayIndex(null);
                setClickedDotIndex(null);
              }}
            />
            <Text style={styles.switchLabel}>30 Days</Text>
          </View>

          {/* Calories Line Chart (with click interaction) */}
          <Text style={[styles.chartTitle, { marginBottom: 7 }]}>Calories</Text>

          <View style={styles.chartContainer}>
            {selectedMetric === "calories" && <View style={styles.shadowEffect} />}
          </View>
          <Animated.View style={{ opacity: chartAnimation }}>
            <LineChart
              data={{
                labels: labels,
                datasets: [
                  {
                    key: "calories-dataset",
                    data: dataSource.calories.map((item) => item.value),
                    strokeWidth: selectedMetric === "calories" ? 5 : 3,
                    color: () => (selectedMetric === "calories" ? "rgb(246, 57, 48)" : "rgb(235, 27, 16)"),
                  },
                ],
              }}
              width={screenWidth - 40}
              height={170}
              chartConfig={chartConfig}
              bezier
              withVerticalLines={false}
              withDots={true}
              style={styles.chart}
              onDataPointClick={({ index }) => handleDotClickWithAnimation(index)}
              renderDotContent={({ x, y, index }) =>
                renderBrightDot({ x, y, index, datasetKey: "calories-dataset" })
              }
            />
          </Animated.View>

          {/* Protein, Carbs, Fat Line Chart */}
          <Text style={[styles.chartTitle, { marginTop: 25 }]}>Protein, Carbs & Fat</Text>
          <View style={styles.chartContainer}>
            {selectedMetric && (
              <View
                style={[
                  styles.shadowEffect,
                  {
                    shadowColor: selectedMetric ? metricColors[selectedMetric as keyof typeof metricColors] : "transparent",
                    backgroundColor: selectedMetric ? metricColors[selectedMetric as keyof typeof metricColors] + "40" : "transparent",
                  },
                ]}
              />
            )}
            <Animated.View style={{ opacity: chartAnimation }}>
              <LineChart
                data={{
                  labels: labels,
                  datasets: [
                    {
                      key: "protein-dataset",
                      data: dataSource.protein.map((item) => item.value),
                      strokeWidth: selectedMetric === "protein" ? 6 : 2,
                      color: () => (selectedMetric === "protein" ? "rgb(4, 187, 248)" : "rgba(0, 191, 255, 0.89)"),
                    },
                    {
                      key: "carbs-dataset",
                      data: dataSource.carbs.map((item) => item.value),
                      strokeWidth: selectedMetric === "carbs" ? 6 : 2,
                      color: () => (selectedMetric === "carbs" ? "rgba(50, 205, 50, 1)" : "rgba(50, 205, 50, 0.89)"),
                    },
                    {
                      key: "fat-dataset",
                      data: dataSource.fat.map((item) => item.value),
                      strokeWidth: selectedMetric === "fat" ? 6 : 2,
                      color: () => (selectedMetric === "fat" ? "rgba(255, 165, 0, 1)" : "rgba(255, 166, 0, 0.98)"),
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
                  let datasetIndex = index; // The index within the specific dataset

                  if (index < dataSource.protein.length) {
                    datasetKey = "protein-dataset";
                  } else if (index < dataSource.protein.length + dataSource.carbs.length) {
                    datasetKey = "carbs-dataset";
                    datasetIndex = index - dataSource.protein.length;
                  } else if (index < dataSource.protein.length + dataSource.carbs.length + dataSource.fat.length) {
                    datasetKey = "fat-dataset";
                    datasetIndex = index - dataSource.protein.length - dataSource.carbs.length;
                  }

                  return renderNormalDot({ x, y, index: datasetIndex, datasetKey });
                }}
              />
            </Animated.View>
          </View>

          {/* Total Data Display (Aligned in Two Columns) */}
          <View style={styles.totalContainer}>
            <View style={styles.timeRangeContainer}>
              <Text style={styles.timeRangeText}>
                {selectedDayIndex !== null ? "1 Day" : isThirtyDays ? "30 Days" : "7 Days"}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <TouchableOpacity
                style={[styles.column, { flexDirection: "row", alignItems: "center", marginBottom: 8 }]}
                onPress={() => handleMetricClick("calories")}
              >
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: metricColors.calories,
                      width: selectedMetric === "calories" ? 16 : 10,
                      height: selectedMetric === "calories" ? 16 : 10,
                      borderRadius: selectedMetric === "calories" ? 8 : 4,
                    },
                  ]}
                />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.totalText}> Calories: </Text>
                  <Text style={styles.totalValue}>{totalValues.total_calories}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.column, { flexDirection: "row", alignItems: "center", marginBottom: 8 }]}
                onPress={() => handleMetricClick("protein")}
              >
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: metricColors.protein,
                      width: selectedMetric === "protein" ? 16 : 10,
                      height: selectedMetric === "protein" ? 16 : 10,
                      borderRadius: selectedMetric === "protein" ? 8 : 4,
                    },
                  ]}
                />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.totalText}>Protein: </Text>
                  <Text style={styles.totalValue}>{totalValues.total_protein} g</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.rowContainer}>
              <TouchableOpacity
                style={[styles.column, { flexDirection: "row", alignItems: "center", marginBottom: 8 }]}
                onPress={() => handleMetricClick("carbs")}
              >
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: metricColors.carbs,
                      width: selectedMetric === "carbs" ? 16 : 10,
                      height: selectedMetric === "carbs" ? 16 : 10,
                      borderRadius: selectedMetric === "carbs" ? 8 : 4,
                    },
                  ]}
                />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.totalText}>Carbs: </Text>
                  <Text style={styles.totalValue}>{totalValues.total_carbs} g</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.column, { flexDirection: "row", alignItems: "center", marginBottom: 8 }]}
                onPress={() => handleMetricClick("fat")}
              >
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: metricColors.fat,
                      width: selectedMetric === "fat" ? 16 : 10,
                      height: selectedMetric === "fat" ? 16 : 10,
                      borderRadius: selectedMetric === "fat" ? 8 : 4,
                    },
                  ]}
                />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.totalText}>Fat: </Text>
                  <Text style={styles.totalValue}>{totalValues.total_fat} g</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(0, 0, 7, 0.9)", padding: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: {
    color: "#48efff",
    fontSize: 16,
    marginTop: 10,
  },
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
});