import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PreCreatedWorkoutButton from "@/components/custom/PreCreatedWorkoutButton"
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

describe('PreCreatedWorkoutButton', () => {
  it('renders all buttons correctly', () => {
    const { getAllByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="PreCreatedWorkoutButton" component={PreCreatedWorkoutButton} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // Check if all predefined buttons are rendered
    const buttonTitles = ['Push Day 1', 'Pull Day 1', 'Back/bis', 'Legs: Glutes/Ham', 'Push (Summer)', 'Pull (Summer)', 'Legs (Summer)', 'Upper Body', 'Push Day 2', 'Pull Day 2'];
    buttonTitles.forEach(title => {
      expect(getAllByText(title)).toBeTruthy();
    });
  });

  it('navigates when a button is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="PreCreatedWorkoutButton" component={PreCreatedWorkoutButton} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // Test navigation for one of the buttons
    const firstButton = getByText('Push Day 1');
    fireEvent.press(firstButton);
    expect(mockNavigate).toHaveBeenCalledWith('SocialFeed');
  });
});
