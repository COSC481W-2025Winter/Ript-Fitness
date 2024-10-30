import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory-native';

interface RepsData {
  date: Date;
  averageReps: number;
}

// Generate random data to populate the chart
const generateData = (range: 'week' | 'month' | 'year'): RepsData[] => {
  const data: RepsData[] = [];
  const today = new Date();

  switch (range) {
    case 'week':
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        data.push({
          date: date,
          averageReps: Math.floor(20 + Math.random() * 30),
        });
      }
      break;

    case 'month':
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        data.push({
          date: date,
          averageReps: Math.floor(20 + Math.random() * 30),
        });
      }
      break;

    case 'year':
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(today.getMonth() - i);
        data.push({
          date: date,
          averageReps: Math.floor(200 + Math.random() * 300),
        });
      }
      break;

    default:
      break;
  }

  return data;
};

const GraphScreen: React.FC = () => {
  const [range, setRange] = useState<'week' | 'month' | 'year'>('week');
  const [data, setData] = useState<RepsData[]>(generateData('week'));

  const handleRangeChange = (selectedRange: 'week' | 'month' | 'year') => {
    setRange(selectedRange);
    setData(generateData(selectedRange));
  };

  const getTickValues = () => {
    if (range === 'month') {
      const tickIndices = [0, 5, 10, 15, 20, 25, 29];
      return tickIndices.map(index => data[index].date);
    } else {
      return data.map((d) => d.date);
    }
  };

  const tickFormat = (x: Date) => {
    if (range === 'year') {
      return x.toLocaleString('default', { month: 'short' });
    } else {
      return x.toISOString().split('T')[0].slice(5, 10);
    }
  };

  const getLabelAngle = () => {
    if (range === 'month') {
      return 45;
    } else {
      return 0;
    }
  };

  const getTextAnchor = () => {
    if (range === 'month') {
      return 'middle';
    } else {
      return 'middle';
    }
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Average Reps Over Time</Text>
      <View style={styles.chartContainer}>
        <VictoryChart
          width={screenWidth - 40}
          height={300}
          scale={{ x: 'time' }}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) =>
                range === 'year'
                  ? `Month: ${datum.date.toLocaleString('default', { month: 'short' })}\nAvg Reps: ${datum.averageReps}`
                  : `Date: ${datum.date.toISOString().split('T')[0].slice(5, 10)}\nAvg Reps: ${datum.averageReps}`
              }
              labelComponent={
                <VictoryTooltip
                  style={{ fontSize: 12, fill: '#212121' }}
                  flyoutStyle={{
                    fill: '#ffffff',
                    stroke: '#bdbdbd',
                    strokeWidth: 1,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                  }}
                  cornerRadius={4}
                  pointerLength={8}
                />
              }
            />
          }
        >
          <VictoryAxis
            tickValues={getTickValues()}
            tickFormat={tickFormat}
            style={{
              axis: { stroke: '#9e9e9e', strokeWidth: 1 },
              ticks: { size: 5, stroke: '#9e9e9e', strokeWidth: 1 },
              tickLabels: {
                fontSize: 12,
                padding: 5,
                angle: getLabelAngle(),
                textAnchor: getTextAnchor(),
                fill: '#616161',
              },
              grid: {
                stroke: '#e0e0e0',
                strokeDasharray: '4, 4',
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(y: number) => `${y}`}
            style={{
              axis: { stroke: '#9e9e9e', strokeWidth: 1 },
              ticks: { size: 5, stroke: '#9e9e9e', strokeWidth: 1 },
              tickLabels: { fontSize: 12, padding: 5, fill: '#616161' },
              grid: {
                stroke: '#e0e0e0',
                strokeDasharray: '4, 4',
              },
            }}
          />
          <VictoryLine
            data={data}
            x="date"
            y="averageReps"
            interpolation="monotoneX"
            style={{
              data: { stroke: '#3f51b5', strokeWidth: 2 },
            }}
          />
        </VictoryChart>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, range === 'week' && styles.activeButton]}
          onPress={() => handleRangeChange('week')}
        >
          <Text style={[styles.buttonText, range === 'week' && styles.activeButtonText]}>
            Week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, range === 'month' && styles.activeButton]}
          onPress={() => handleRangeChange('month')}
        >
          <Text style={[styles.buttonText, range === 'month' && styles.activeButtonText]}>
            Month
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, range === 'year' && styles.activeButton]}
          onPress={() => handleRangeChange('year')}
        >
          <Text style={[styles.buttonText, range === 'year' && styles.activeButtonText]}>
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
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 4,
  },
  activeButton: {
    backgroundColor: '#3f51b5',
  },
  buttonText: {
    color: '#212121',
    fontSize: 14,
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GraphScreen;