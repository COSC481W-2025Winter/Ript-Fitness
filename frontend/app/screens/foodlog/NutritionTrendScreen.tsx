import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Animated, TouchableOpacity,ActivityIndicator, Alert } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


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

// Define the interface for nutrition summary
interface NutritionSummary {
  calories: number[]; // 每日值数组
  protein: number[];
  carbs: number[];
  fat: number[];
  total_calories?: number; // 可选总和
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

// Get labels for the last 30 days (display every 5 days)
const getLast30DaysLabels = (data: number[]) => {
  if (!data || data.length === 0) return Array(7).fill(""); // 默认返回 7 个空标签
  const labels = Array(data.length).fill(""); // 确保长度匹配
  return data.map((_, i) =>
    i % 5 === 0 ? new Date(Date.now() - (data.length - 1 - i) * 24 * 60 * 60 * 1000).toLocaleString("en-US", { month: "short", day: "2-digit" }) : ""
  );
};

// 检测数据是否是以 date 为分类的格式
function isDateBasedFormat(data: any): boolean {
  // 如果数据是对象且不是数组，且键是日期格式（例如 "2023-10-01"）
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const keys = Object.keys(data);
    // 检查第一个键是否符合日期格式（例如 "YYYY-MM-DD"）
    if (keys.length > 0) {
      const firstKey = keys[0];
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      return datePattern.test(firstKey);
    }
  }
  return false;
}

// 将以 date 为分类的格式转换为以 category 为分类的格式
function convertDateToCategoryFormat(data: { [date: string]: { calories: number, protein: number, carbs: number, fat: number }, 
      totals?: { total_calories: number, total_protein: number, total_carbs: number, total_fat: number } }): NutritionSummary {
  const result: NutritionSummary = {
    calories: [],
    protein: [],
    carbs: [],
    fat: [],
    total_calories: data.totals?.total_calories || 0, // 从后端返回的数据中提取总和
    total_protein: data.totals?.total_protein || 0,
    total_carbs: data.totals?.total_carbs || 0,
    total_fat: data.totals?.total_fat || 0,
  };

  // 按日期顺序遍历数据
  const sortedDates = Object.keys(data).filter(key => key !== 'totals').sort(); // 确保日期按顺序排列，排除 totals 字段
  sortedDates.forEach((date) => {
    result.calories.push(data[date].calories);
    result.protein.push(data[date].protein);
    result.carbs.push(data[date].carbs);
    result.fat.push(data[date].fat);
  });

  return result;
}

export default function NutritionTrendScreen() {
  const [isThirtyDays, setIsThirtyDays] = useState(false);
  const [chartAnimation] = useState(new Animated.Value(0));
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null); // Selected data point index
  const [clickedDotIndex, setClickedDotIndex] = useState<number | null>(null); //State for clicked dot
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null); // Currently selected metric
  const [data, setData] = useState<NutritionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  // Add a scale animation value in the component
  const [dotScale] = useState(new Animated.Value(1));
  // Add a glow animation value for breathing light effect
  const [glowAnimation] = useState(new Animated.Value(0.5));

  // API endpoints
  const WEEKLY_TRENDS_URL = 'http://ript-fitness-app.azurewebsites.net/Calculator/getWeeklyTrends';
  const MONTHLY_TRENDS_URL = 'http://ript-fitness-app.azurewebsites.net/nutritionCalculator/getMonthlyTrends';
  const TOKEN = 'eyJhBcOi0JUZiN1Nj9.eYzdWi0IjSt...'; // 替换为实际 token 或从 .env 获取

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const url = isThirtyDays ? MONTHLY_TRENDS_URL : WEEKLY_TRENDS_URL;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status); // 调试日志
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const fetchedData = await response.json();
        console.log("Fetched data from backend:", JSON.stringify(fetchedData, null, 2));

        if (!fetchedData || !fetchedData.daily || !fetchedData.weekly || !fetchedData.monthly) {
          throw new Error("Invalid response format from server.");
        }
        

        // 如果后端返回的数据是以 date 为分类的格式，需要转换
        // 否则直接使用 fetchedData
        let nutritionData: NutritionData;
        if (isDateBasedFormat(fetchedData)) {
          const convertedDaily = convertDateToCategoryFormat(fetchedData.daily);
          const convertedWeekly = convertDateToCategoryFormat(fetchedData.weekly);
          const convertedMonthly = convertDateToCategoryFormat(fetchedData.monthly);

          nutritionData = {
            daily: convertedDaily,
            weekly: convertedWeekly,
            monthly: convertedMonthly,
          };
        } else {
          nutritionData = fetchedData; // 假设后端返回的数据已经是 NutritionData 格式
        }

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


  useEffect(() => {
    Animated.timing(chartAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
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

// Select data source
const dataSource = data
? {
    calories: isThirtyDays ? data.monthly.calories : data.daily.calories,
    protein: isThirtyDays ? data.monthly.protein : data.daily.protein,
    carbs: isThirtyDays ? data.monthly.carbs : data.daily.carbs,
    fat: isThirtyDays ? data.monthly.fat : data.daily.fat,
  }
: {
    calories: [1801, 1830, 1700, 1600, 1800, 1850, 1100], // Fallback 7 days
    protein: [70, 75, 65, 60, 70, 80, 50],
    carbs: [200, 210, 190, 180, 200, 220, 150],
    fat: [50, 55, 45, 40, 50, 60, 30],
  };  

  console.log('dataSource:', dataSource); // 调试日志

  // Select data source and dynamically generate labels
  const labels = isThirtyDays
    ? getLast30DaysLabels(dataSource.calories)
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    console.log('labels:', labels); // 调试日志

  // 
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
        backgroundColor: clickedDotIndex === index ? "hsl(180, 100%, 70%)" : "hsla(180, 91.10%, 69.00%, 0.90)", // Very bright when not clicked
        borderWidth: clickedDotIndex === index ? 2 : 1, // Border even when not clicked
        borderColor: clickedDotIndex === index ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)", // Bright border even when not clicked
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

if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#48efff" />
    </View>
  );
}

  return (
    <ScrollView style={styles.container}>
      {/* 显示错误信息，但不阻止渲染 LineChart */}
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
          setSelectedDayIndex(null); // Reset selection when switching
          setClickedDotIndex(null); // Reset dot state
        }} />
        <Text style={styles.switchLabel}>30 Days</Text>
      </View>

  {/* Calories Line Chart (with click interaction) */}
  <Text style={[styles.chartTitle, { marginBottom: 7 }]}>Calories</Text>

      <View style={styles.chartContainer}>
          {/* Additional shadow layer (only visible when `calories` is selected) */}
          { selectedMetric === "calories" && (
              <View style={styles.shadowEffect} />
          )}
      </View>
      <Animated.View style={{ opacity: chartAnimation }}>
        <LineChart
          data={{
            labels: labels, 
            datasets: [{  
                        key: "calories-dataset", // Add unique key
                        data: dataSource.calories, // Use value field 
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
          style={styles.chart} // Add styles.chart
          onDataPointClick={({ index }) => handleDotClickWithAnimation(index)} //Use click event with animation
          renderDotContent={({ x, y, index, indexData }) => 
            renderBrightDot({ x, y, index, indexData, datasetKey: "calories-dataset" }) // Manually pass datasetKey
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
                data: dataSource.protein, 
                strokeWidth: selectedMetric === "protein" ? 6 : 2, //Bold when selected
                color: () => selectedMetric === "protein" ? "rgb(4, 187, 248)" : "rgba(0, 191, 255, 0.89)", },
              { 
                key: "carbs-dataset", 
                data: dataSource.carbs, 
                strokeWidth: selectedMetric === "carbs" ? 6 : 2, // Bold when selected
                color: () => selectedMetric === "carbs" ? "rgba(50, 205, 50, 1)" : "rgba(50, 205, 50, 0.89)", },
              { 
                key: "fat-dataset", 
                data: dataSource.fat, 
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
            if (index < dataSource.protein.length) datasetKey = "protein-dataset";
            else if (index < dataSource.protein.length + dataSource.carbs.length) datasetKey = "carbs-dataset";
            else if (index < dataSource.protein.length + dataSource.carbs.length + dataSource.fat.length) datasetKey = "fat-dataset";
      
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
        </View>

    <View style={styles.rowContainer}>
      <TouchableOpacity 
        style={[styles.column, { flexDirection: "row", alignItems: "center", marginBottom: 8 }]}
        onPress={() => handleMetricClick("calories")}>
          <View style={[styles.dot, 
          { backgroundColor: metricColors.calories,
            width: selectedMetric === "calories" ? 16 : 10, //Enlarges when clicked
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
              width: selectedMetric === "protein" ? 16 : 10, // Enlarges when clicked
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
              width: selectedMetric === "carbs" ? 16 : 10, //Enlarges when clicked
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
              width: selectedMetric === "fat" ? 16 : 10, // Enlarges when clicked
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


//Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(0, 0, 7, 0.9)", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#48efff", marginBottom: 20 },
  switchContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  switchLabel: { fontSize: 16, marginHorizontal: 10, fontWeight: "bold", color: "#48efff" },
  chart: { marginVertical: 10,  marginTop: -6, borderRadius: 16, alignSelf: "center",elevation: 4, },
  totalContainer: { marginTop: 20, alignItems: "center" },
  rowContainer: { 
    flexDirection: "row", 
    width: "100%", 
    marginBottom: 10,
    justifyContent: "space-between", // modify space-between
    alignItems: "flex-start", // Ensure vertical alignment
  },
  column: { 
    width: 160, //Distribute width evenly for each column
    paddingHorizontal: 10, // Adjust padding
    flexDirection: "row", // Ensure child elements are arranged horizontally
    alignItems: "center", // Vertically center align dots and text
  },
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
    width: screenWidth - 55,
    height: 153,
    backgroundColor: "rgba(255, 69, 58, 0.3)", // Add a shadow effect to the selected line
    borderRadius: 10,
    shadowColor: "red",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 15, //Larger value for softer shadow
    elevation: 8, 
    transform: [{ translateY: -5 }, { scale: 1.02 }], // Slightly enlarge & float
  },

  chartContainer: {
    position: "relative", //  Ensure `shadowEffect` overlays `LineChart`
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
