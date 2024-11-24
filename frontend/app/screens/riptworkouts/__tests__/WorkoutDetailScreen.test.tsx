import React from 'react';
import { render } from '@testing-library/react-native';
import { useRoute } from '@react-navigation/native';
import WorkoutDetailScreen from '@/app/screens/riptworkouts/WorkoutDetailScreen';

// Mock `useRoute` to provide test data
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: jest.fn(),
}));

describe('WorkoutDetailScreen', () => {
  const mockWorkout = {
    name: 'Test Workout',
    level: 'Intermediate',
    time: 45,
    exercises: [
      { exercise: 'Squats', sets: 4, reps: 10 },
      { exercise: 'Push-ups', sets: 3, reps: 15 },
    ],
  };

  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue({
      params: { workout: mockWorkout },
    });
  });

  it('renders workout details correctly', () => {
    const { getByText } = render(<WorkoutDetailScreen />);

    // Check for the workout name
    expect(getByText('Test Workout')).toBeTruthy();
    // Check for workout level and time
    expect(getByText('Intermediate: 45 min')).toBeTruthy();
  });

  it('renders the list of exercises', () => {
    const { getByText } = render(<WorkoutDetailScreen />);

    // Check for exercises
    expect(getByText('Squats')).toBeTruthy();
    expect(getByText('4 sets x 10 reps')).toBeTruthy();
    expect(getByText('Push-ups')).toBeTruthy();
    expect(getByText('3 sets x 15 reps')).toBeTruthy();
  });
});
