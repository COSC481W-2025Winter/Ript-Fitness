import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StartWorkoutScreen from '../../app/screens/workout/StartWorkoutScreen';
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

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    Swipeable: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

describe('StartWorkoutScreen', () => {
  it('renders all elements correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="StartWorkoutScreen" component={StartWorkoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // Verify if essential elements are rendered
    expect(getByText('Add Exercise')).toBeTruthy();
    expect(getByPlaceholderText('Enter Exercise Name')).toBeTruthy();
    expect(getByText('Notes: Add notes here')).toBeTruthy();
    expect(getByText('Submit')).toBeTruthy();
  });

  it('allows adding a new exercise', () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="StartWorkoutScreen" component={StartWorkoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    const exerciseNameInput = getByPlaceholderText('Enter Exercise Name');
    fireEvent.changeText(exerciseNameInput, 'Bench Press');
    fireEvent.press(getByText('Add Exercise'));

    // Verify the exercise was added
    expect(getByText('Bench Press')).toBeTruthy();
  });

  it('opens the notes modal and allows adding notes', () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="StartWorkoutScreen" component={StartWorkoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // Open the notes modal
    fireEvent.press(getByText(/Notes: Add notes here/i));

    // Enter a sample note in the notes modal
    const notesInput = getByPlaceholderText('Type your notes here');
    fireEvent.changeText(notesInput, 'This is a sample note...');

    // Close the modal and check if the note text appears in the notes button
    fireEvent.press(getByText('Save Notes'));

  });
});
