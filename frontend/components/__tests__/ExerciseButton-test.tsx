import * as React from 'react';
import { render } from '@testing-library/react-native';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ExerciseButton } from '../custom/ExerciseButton';

it(`ExerciseButton renders correctly`, () => {
  const workouts = [
    { id: '1', name: 'Push-Ups', description: "5 Sets", values: ["10", "9", "8", "8", "9"], valueTypes: "Reps", color: "#F2846C" }
  ];

  const sideButtons = [
    { id: '1', icon: 'pencil', func: undefined },
    { id: '2', icon: 'arrow-up', func: undefined, style: styles.viewButton },
  ];

  const item = workouts[0]; // Access the first workout
  const { tree } = render(
    <ExerciseButton
      id={item.id}
      leftColor={item.color}
      title={item.name}
      desc={item.description}
      isActive={false}
      style={styles.myWidth}
      sideButtons={sideButtons}
    >
      {item.values.map((value, index) => (
        <View key={index} style={styles.rowItem}>
          <ThemedText style={styles.floatLeft}>{value}</ThemedText>
          <ThemedText style={styles.floatRight}>{item.valueTypes}</ThemedText>
        </View>
      ))}
    </ExerciseButton>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

const styles = StyleSheet.create({
  viewButton: {
    transform: [{ rotate: '90deg' }],
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  floatLeft: {
    textAlign: 'left',
  },
  floatRight: {
    textAlign: 'right',
  },
  myWidth: {
    width: '100%',
  }
});
