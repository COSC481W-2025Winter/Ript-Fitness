import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AddWorkoutScreen } from '@/app/screens/workout/AddWorkoutScreen';
import { WorkoutContext } from '@/context/WorkoutContext';
import { NavigationContainer } from '@react-navigation/native';
import { jest } from '@jest/globals';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create a Stack Navigator for testing navigation behavior
const Stack = createNativeStackNavigator();

// Mock navigation
const mockNavigate = jest.fn();

import * as ReactNavigation from '@react-navigation/native';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual<typeof ReactNavigation>('@react-navigation/native');

  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({
      navigate: mockNavigate,
    })),
  };
});

// Mock WorkoutContext
const mockContext = {
  modalObject: {
    id: "-1", // Mock ID value
    isVisible: false, // Mock initial visibility
  },
  setModalObject: jest.fn(), // Mock function for setting the modal object
  setVisible: jest.fn(), // Mock function for setting visibility
};



// Main test suite
describe('AddWorkoutScreen', () => {
  it('renders the screen correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <WorkoutContext.Provider value={mockContext}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='AddWorkoutScreen' component={AddWorkoutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </WorkoutContext.Provider>
    );

    // Check if the submit button is present
    expect(getByText('Submit')).toBeTruthy();
  });

  it('opens and closes the modal', async () => {
    const { getByText, queryByText, getByTestId } = render(
      <WorkoutContext.Provider
        value={{
          ...mockContext,
          modalObject: {
            isVisible: true,
            id: ''
          },
        }}
      >
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='AddWorkoutScreen' component={AddWorkoutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </WorkoutContext.Provider>
    );

    // Check if modal content is visible
    const closeIcon = getByTestId('close-modal')
    expect(getByText('Exercise Name')).toBeTruthy();

    // Simulate close modal
    fireEvent.press(getByText('closeIcon')); // Assuming the close button text is "x" or use a testID.

    await waitFor(() => {
      expect(queryByText('Exercise Name')).toBeNull(); // Modal should be closed
    });
  });

  it('adds an exercise', () => {
    const { getByText, getByPlaceholderText } = render(
      <WorkoutContext.Provider value={mockContext}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='AddWorkoutScreen' component={AddWorkoutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </WorkoutContext.Provider>
    );

    // Simulate adding an exercise
    const addExerciseButton = getByText('Add Set');
    fireEvent.press(addExerciseButton);

    const exerciseInput = getByPlaceholderText('Exercise Name');
    fireEvent.changeText(exerciseInput, 'Push-Ups');

    const saveButton = getByText('Save');
    fireEvent.press(saveButton);

    // Verify exercise added
    expect(mockContext.setVisible).toHaveBeenCalledWith(false);
    expect(getByText('Push-Ups')).toBeTruthy();
  });

  it('removes a workout via swipe', async () => {
    const { getByText, queryByText } = render(
      <WorkoutContext.Provider value={mockContext}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='AddWorkoutScreen' component={AddWorkoutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </WorkoutContext.Provider>
    );

    // Find the workout to remove
    const workoutToRemove = getByText('Push-Ups');

    // Simulate swipe action
    fireEvent(workoutToRemove, 'swipeableOpen'); // Adjust event to match your Swipeable implementation

    // Check if the workout was removed
    await waitFor(() => {
      expect(queryByText('Push-Ups')).toBeNull();
    });
  });
});
