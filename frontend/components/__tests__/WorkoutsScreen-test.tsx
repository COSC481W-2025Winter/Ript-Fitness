import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WorkoutApiScreen from "@/app/screens/workout/WorkoutApiScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create a Stack Navigator for testing navigation behavior
const Stack = createNativeStackNavigator();

// Mock the navigation prop
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('WorkoutApiScreen', () => {
  it('renders all elements correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="WorkoutApiScreen" component={WorkoutApiScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(getByText('My Workouts')).toBeTruthy();
    expect(getByText('Add Workout')).toBeTruthy();
    expect(getByText('Ript Workouts')).toBeTruthy();
    expect(getByText('Start Workout')).toBeTruthy();
  });

  it('navigates when buttons are pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="WorkoutApiScreen" component={WorkoutApiScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    fireEvent.press(getByText('My Workouts'));
    expect(mockNavigate).toHaveBeenCalledWith('MyWorkoutsScreen', {});

    fireEvent.press(getByText('Add Workout'));
    expect(mockNavigate).toHaveBeenCalledWith('AddWorkoutScreen', {});

    fireEvent.press(getByText('Ript Workouts'));
    expect(mockNavigate).toHaveBeenCalledWith('ApiScreen', {});

    fireEvent.press(getByText('Start Workout'));
    expect(mockNavigate).toHaveBeenCalledWith('StartWorkoutScreen', {});
  });
});
