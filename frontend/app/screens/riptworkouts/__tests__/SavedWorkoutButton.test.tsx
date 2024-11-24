import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SavedWorkoutButton, SavedWorkoutButtonProps } from '@/components/custom/SavedWorkoutButton';
import { ThemedText } from '@/components/ThemedText';

describe('SavedWorkoutButton', () => {
  const mockOnPress = jest.fn();

  const defaultProps: SavedWorkoutButtonProps = {
    key: '1',
    name: 'Test Workout',
    level: 'Beginner',
    time: 30,
    exercises: [],
    onPress: mockOnPress,
  };

  it('renders correctly with given props', () => {
    const { getByText } = render(<SavedWorkoutButton {...defaultProps} />);

    // Check that the name is rendered
    expect(getByText('Test Workout')).toBeTruthy();
    // Check that the level and time are rendered
    expect(getByText('Beginner: 30 min')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(<SavedWorkoutButton {...defaultProps} />);

    // Simulate button press
    fireEvent.press(getByText('Test Workout'));

    // Ensure onPress is called
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });


  it('does not crash if onLongPress is undefined', () => {
    const { getByText } = render(
      <SavedWorkoutButton {...defaultProps} onLongPress={undefined} />
    );

    // Simulate long press
    fireEvent(getByText('Test Workout'), 'onLongPress');
    // Should not throw an error
  });

});
