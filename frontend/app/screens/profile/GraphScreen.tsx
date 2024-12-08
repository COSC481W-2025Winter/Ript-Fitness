import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Svg, Defs, LinearGradient, Stop } from "react-native-svg";
import {
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native";

interface RepsData {
  date: Date;
  averageReps: number;
}

// Generate random data for the graph based on the selected range
const generateData = (range: "week" | "month" | "year"): RepsData[] => {
  const data: RepsData[] = [];
  const today = new Date();

  switch (range) {
    case "week":
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        data.push({
          date: date,
          averageReps: Math.floor(20 + Math.random() * 30),
        });
      }
      break;

    case "month":
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        data.push({
          date: date,
          averageReps: Math.floor(20 + Math.random() * 30),
        });
      }
      break;

    case "year":
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(today.getMonth() - i);
        data.push({
          date: date,
          averageReps: Math.floor(200 + Math.random() * 300),
        });
      }
      break;
  }

  return data;
};

const GraphScreen: React.FC = () => {
  const [range, setRange] = useState<"week" | "month" | "year">("week");
  const [data, setData] = useState<RepsData[]>(generateData("week"));

  const handleRangeChange = (selectedRange: "week" | "month" | "year") => {
    setRange(selectedRange);
    setData(generateData(selectedRange));
  };

  const getTickValues = () => {
    if (range === "month") {
      const tickIndices = [0, 5, 10, 15, 20, 25, 29];
      return tickIndices.map((index) => data[index].date);
    }
    return data.map((d) => d.date);
  };

  const tickFormat = (x: Date) => {
    if (range === "year") {
      return x.toLocaleString("default", { month: "short" });
    }
    return x.toISOString().split("T")[0].slice(5, 10);
  };

  const screenWidth = Dimensions.get("window").width;

  const getYDomain = () => {
    const values = data.map((d) => d.averageReps);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const padding = (max - min) * 0.2;
    return [min - padding, max + padding];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Average Reps Over Time</Text>
      <View style={styles.chartContainer}>
        <VictoryChart
          width={screenWidth - 40}
          height={300}
          padding={{ top: 40, bottom: 40, left: 50, right: 20 }}
          scale={{ x: "time" }}
          domain={{ y: getYDomain() }}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }: any) =>
                range === "year"
                  ? `Month: ${datum.date.toLocaleString("default", {
                      month: "short",
                    })}\nAvg Reps: ${datum.averageReps}`
                  : `Date: ${datum.date
                      .toISOString()
                      .split("T")[0]
                      .slice(5, 10)}\nAvg Reps: ${datum.averageReps}`
              }
              labelComponent={
                <VictoryTooltip
                  style={{ fontSize: 12, fill: "#212121" }}
                  flyoutStyle={{
                    fill: "#ffffff",
                    stroke: "#bdbdbd",
                    strokeWidth: 1,
                  }}
                />
              }
            />
          }
        >
          <Defs>
            <LinearGradient id="gradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#60A5FA" stopOpacity={0.2} />
              <Stop offset="100%" stopColor="#60A5FA" stopOpacity={0.02} />
            </LinearGradient>
          </Defs>

          <VictoryArea
            data={data}
            x="date"
            y="averageReps"
            interpolation="natural"
            style={{
              data: {
                fill: "url(#gradientFill)",
                stroke: "#60A5FA",
                strokeWidth: 2,
              },
            }}
          />

          <VictoryAxis
            tickValues={getTickValues()}
            tickFormat={tickFormat}
            style={{
              axis: { stroke: "#E5E5E5", strokeWidth: 1 },
              ticks: { size: 5, stroke: "#E5E5E5" },
              tickLabels: {
                fontSize: 10,
                padding: 5,
                fill: "#9CA3AF",
              },
              grid: { stroke: "transparent" },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(y: number) => `${y}`}
            style={{
              axis: { stroke: "#E5E5E5", strokeWidth: 1 },
              ticks: { size: 5, stroke: "#E5E5E5" },
              tickLabels: {
                fontSize: 10,
                padding: 5,
                fill: "#9CA3AF",
              },
              grid: { stroke: "transparent" },
            }}
          />
        </VictoryChart>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, range === "week" && styles.activeButton]}
          onPress={() => handleRangeChange("week")}
        >
          <Text
            style={[
              styles.buttonText,
              range === "week" && styles.activeButtonText,
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, range === "month" && styles.activeButton]}
          onPress={() => handleRangeChange("month")}
        >
          <Text
            style={[
              styles.buttonText,
              range === "month" && styles.activeButtonText,
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, range === "year" && styles.activeButton]}
          onPress={() => handleRangeChange("year")}
        >
          <Text
            style={[
              styles.buttonText,
              range === "year" && styles.activeButtonText,
            ]}
          >
            Year
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#212121",
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 4,
  },
  activeButton: {
    backgroundColor: "#60A5FA",
  },
  buttonText: {
    color: "#4B5563",
    fontSize: 14,
  },
  activeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default GraphScreen;
