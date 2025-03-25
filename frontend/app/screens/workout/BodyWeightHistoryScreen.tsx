import React, { useState, useEffect, useContext } from "react";
import {View, Text, StyleSheet, ScrollView, Button, Animated, Dimensions, Alert, TouchableOpacity, TextInput,} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { GlobalContext } from "@/context/GlobalContext";
import { httpRequests } from "@/api/httpRequests";

const screenWidth = Dimensions.get("window").width;

interface WeightEntry {
  id: number;
  weight: number;
  recordedAt: string;
}

enum Range {
  Seven = "7",
  Thirty = "30",
  All = "all",
}

export default function BodyWeightHistory() {
  const { data: globalData, isDarkMode } = useContext(GlobalContext)!;

  const token = globalData?.token ?? "";

  // Chart filter range
  const [range, setRange] = useState<Range>(Range.Seven);

  // All data from API
  const [allWeights, setAllWeights] = useState<WeightEntry[]>([]);

  // For the chart
  const [weightData, setWeightData] = useState<number[]>([]);
  const [weightLabels, setWeightLabels] = useState<string[]>([]);
  const [chartAnimation] = useState(new Animated.Value(0));

  // For adding a new weight
  const [newWeight, setNewWeight] = useState<string>("");

  // For editing a weight
  const [editId, setEditId] = useState<number | null>(null);
  const [editWeight, setEditWeight] = useState<string>("");

  // Fetch full weight history & store it in allWeights
  useEffect(() => {
    const fetchWeightHistory = async () => {
      try {
        const response = await httpRequests.get("/userProfile/weightHistory", token);
        if (!Array.isArray(response)) {
          Alert.alert("Error", "Invalid weight data format");
          return;
        }
        // Sort ascending by date
        const sorted = response.sort(
          (a: WeightEntry, b: WeightEntry) =>
            new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
        );
        setAllWeights(sorted);
      } catch (error) {
        console.error("Failed to fetch weight history:", error);
        Alert.alert("Error", "Unable to fetch weight history.");
      }
    };
    fetchWeightHistory();
  }, [token, range]);

  // 2) Filter  chart and chart animation
  useEffect(() => {
    Animated.timing(chartAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    const now = new Date();

    const filtered = allWeights.filter((entry) => {
      if (range === Range.All) return true;
      const days = range === Range.Thirty ? 30 : 7;
      const diffTime = now.getTime() - new Date(entry.recordedAt).getTime();
      return diffTime / (1000 * 60 * 60 * 24) <= days;
    });

    // Prepare data for the chart
    const weights = filtered.map((e) => Number(e.weight)).filter(Number.isFinite);

    // Thin out the X-axis labels to avoid crowding
    const step = Math.ceil(filtered.length / 7);
    const labels = filtered.map((entry, idx) => {
      const labelDate = new Date(entry.recordedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return idx % step === 0 ? labelDate : "";
    });

    setWeightData(weights);
    setWeightLabels(labels);
  }, [allWeights, range]);

  // Add a new weight
  const handleAddWeight = async () => {
    const weightNum = parseFloat(newWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      Alert.alert("Invalid weight", "Please enter a valid positive number.");
      return;
    }

    try {
      const response = await httpRequests.put(`/userProfile/weightHistory=${weightNum}`, token);

      if (!response || !response.id) {
        Alert.alert("Error", "Failed to add weight entry.");
        return;
      }

      Alert.alert("Success", `Recorded weight: ${weightNum} lbs`);
      setNewWeight("");

      setRange(Range.Seven);
    } catch (error) {
      console.error("Failed to add weight:", error);
      Alert.alert("Error", "Unable to record new weight.");
    }
  };

  // Edit an existing weight
  const startEdit = (entry: WeightEntry) => {
    setEditId(entry.id);
    setEditWeight(entry.weight.toString());
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditWeight("");
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    const weightNum = parseFloat(editWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      Alert.alert("Invalid weight", "Please enter a valid positive number.");
      return;
    }

    try {
      await httpRequests.put(`/userProfile/weightHistory/${editId}/${weightNum}`, token);
      Alert.alert("Success", `Updated weight to ${weightNum} lbs`);
      setEditId(null);
      setEditWeight("");

      // Re-fetch or flip range to re-trigger
      setRange(Range.Seven);
    } catch (error) {
      console.error("Failed to update weight:", error);
      Alert.alert("Error", "Unable to update this entry.");
    }
  };


  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000" : "rgba(0, 0, 7, 0.82)" },
      ]}
    >
      <Text
        style={[
          styles.header,
          { color: isDarkMode ? "#fff" : "#48efff" },
        ]}
      >
        Body Weight History
      </Text>

      {/* Range Selector */}
      <View style={styles.rangeButtons}>
        <Button
          title="7 Days"
          onPress={() => setRange(Range.Seven)}
          color={range === Range.Seven ? "#48efff" : "gray"}
        />
        <Button
          title="30 Days"
          onPress={() => setRange(Range.Thirty)}
          color={range === Range.Thirty ? "#48efff" : "gray"}
        />
        <Button
          title="All Time"
          onPress={() => setRange(Range.All)}
          color={range === Range.All ? "#48efff" : "gray"}
        />
      </View>

      {/* Add Weight */}
      <View style={styles.addWeightContainer}>
        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? "#fff" : "#48efff" },
          ]}
        >
          Add Your Weight
        </Text>
        <TextInput
          style={[
            styles.weightInput,
            {
              backgroundColor: isDarkMode ? "#333" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            },
          ]}
          placeholder="e.g. 170"
          placeholderTextColor={isDarkMode ? "#999" : "#666"}
          keyboardType="numeric"
          value={newWeight}
          onChangeText={setNewWeight}
        />
        <Button title="Record Weight" onPress={handleAddWeight} />
      </View>

      {/* Show Full Weight List (Editing) */}
      <Text
        style={[
          styles.subtitle,
          { color: isDarkMode ? "#fff" : "#48efff" },
        ]}
      >
        Your Entries
      </Text>
      {allWeights.map((entry) => (
        <View key={entry.id} style={styles.entryRow}>
          {editId === entry.id ? (
            <>
              {/* Edit Mode */}
              <TextInput
                style={[
                  styles.editInput,
                  {
                    backgroundColor: isDarkMode ? "#333" : "#fff",
                    color: isDarkMode ? "#fff" : "#000",
                  },
                ]}
                keyboardType="numeric"
                value={editWeight}
                onChangeText={setEditWeight}
                placeholderTextColor={isDarkMode ? "#999" : "#666"}
              />
              <Button title="Save" onPress={handleSaveEdit} />
              <Button title="Cancel" onPress={cancelEdit} color="red" />
            </>
          ) : (
            <>
              {/* View Mode */}
              <Text
                style={[
                  styles.entryText,
                  { color: isDarkMode ? "#fff" : "#fff" }, // default to white or some other color
                ]}
              >
                {entry.weight} lbs on{" "}
                {new Date(entry.recordedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
              <TouchableOpacity onPress={() => startEdit(entry)}>
                <Text
                  style={[
                    styles.editLink,
                    { color: isDarkMode ? "#adf" : "#48efff" },
                  ]}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ))}

      {/* Chart */}
      <Text
        style={[
          styles.chartTitle,
          { color: isDarkMode ? "#fff" : "#48efff" },
        ]}
      >
        Weight Trend
      </Text>
      {weightData.length > 0 && weightLabels.length === weightData.length ? (
        <Animated.View style={{ opacity: chartAnimation }}>
          <LineChart
            data={{
              labels: weightLabels,
              datasets: [{ data: weightData, strokeWidth: 3 }],
            }}
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
      ) : (
        <Text
          style={{
            color: isDarkMode ? "#fff" : "#fff",
            textAlign: "center",
          }}
        >
          No weight data to display.
        </Text>
      )}
    </ScrollView>
  );
}

// Chart configuration
const chartConfig = {
  backgroundGradientFrom: "#0f2027",
  backgroundGradientTo: "#203a43",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(72, 239, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: { borderRadius: 16 },
  propsForLabels: { fontSize: 12 },
  propsForDots: { r: "3", strokeWidth: "3", stroke: "#48efff" },
  yAxisMinimum: 0,
  labelRotation: 0,
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: "rgba(255,255,255,0.2)",
  },
  strokeWidth: 3,
};

// Base styles. We rely heavily on inline checks for isDarkMode.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor will be overridden dynamically
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    // color is overridden for dark mode
  },
  rangeButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  addWeightContainer: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    // color is overridden
  },
  weightInput: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
    // color + backgroundColor set inline
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  entryText: {
    flex: 1,
    // color is overridden
  },
  editLink: {
    marginLeft: 10,
    textDecorationLine: "underline",
    // color is overridden
  },
  editInput: {
    flex: 1,
    padding: 6,
    marginRight: 6,
    borderRadius: 4,
    // color + backgroundColor set inline
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    // color is overridden
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
    alignSelf: "center",
  },
});