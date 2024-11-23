import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AddWorkoutScreen } from '@/app/screens/workout/AddWorkoutScreen';
import { WorkoutContext } from '@/context/WorkoutContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ReactNavigation from '@react-navigation/native';

// Mock navigation
const mockNavigate = jest.fn();

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
    id: '-1',
    isVisible: false,
  },
  setModalObject: jest.fn(),
  setVisible: jest.fn(),
  workouts: [],
};

const Stack = createNativeStackNavigator();

describe('AddWorkoutScreen', () => {
  it('renders the screen correctly', () => {
    const { getByText } = render(
      <WorkoutContext.Provider value={mockContext}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="AddWorkoutScreen" component={AddWorkoutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </WorkoutContext.Provider>
    );

    expect(getByText('Submit')).toBeTruthy();
  });


// Mock TextInput from react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const actualGestureHandler = jest.requireActual('react-native-gesture-handler');
  return {
    ...actualGestureHandler,
    TextInput: actualGestureHandler.TextInput ? actualGestureHandler.TextInput : 'TextInput',
  };
});

const Stack = createNativeStackNavigator();


  it('opens and closes the modal', async () => {
    // Set modalObject.isVisible to true to simulate the modal being open
    const mockContext = {
      modalObject: {
        id: '',
        isVisible: true,
      },
      setModalObject: jest.fn(),
      setVisible: jest.fn((visible) => {
        mockContext.modalObject.isVisible = visible;
      }),
      workouts: [],
    };

    const { getByText, queryByText, getByTestId } = render(
      <WorkoutContext.Provider value={mockContext}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="AddWorkoutScreen" component={AddWorkoutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </WorkoutContext.Provider>
    );

    // Verify modal is visible by checking for 'Save' button
    expect(getByText('Save')).toBeTruthy();

    // Close modal
    fireEvent.press(getByTestId('close-modal'));

    // Wait for the modal to close
    await waitFor(() => {
      expect(queryByText('Save')).toBeNull();
    });
  });
});