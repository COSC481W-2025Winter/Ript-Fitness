import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import MyNotesScreen from '@/screens/notes/MyNotesScreen';
import StartWorkoutScreen from '@/screens/workout/StartWorkoutScreen';
import { jest } from '@jest/globals';

// Mock data for tests
const mockNotes = [
  { id: 1, title: 'Note 1', date: '2024-11-01', text: 'This is a test note' },
  { id: 2, title: 'Note 2', date: '2024-11-02', text: 'Another test note' },
];

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('App Screens Tests', () => {
  // MyNotesScreen Tests
  describe('MyNotesScreen', () => {
    it('renders the screen and displays notes', () => {
      render(
        <NotesProvider initialNotes={mockNotes}>
          <MyNotesScreen />
        </NotesProvider>
      );

      expect(screen.getByText('Note 1')).toBeTruthy();
      expect(screen.getByText('Note 2')).toBeTruthy();
    });

    it('renders empty state when no notes are available', () => {
      render(
        <NotesProvider initialNotes={[]}>
          <MyNotesScreen />
        </NotesProvider>
      );

      expect(screen.getByText('Notes will be displayed here')).toBeTruthy();
    });
  });

  // StartWorkoutScreen Tests
  describe('StartWorkoutScreen', () => {
    it('renders the screen and allows adding an exercise', () => {
      render(<StartWorkoutScreen />);

      const input = screen.getByPlaceholderText('Enter Exercise Name');
      fireEvent.changeText(input, 'Push-ups');

      const addButton = screen.getByText('Add Exercise');
      fireEvent.press(addButton);

      expect(screen.getByText('Push-ups')).toBeTruthy();
    });

    it('allows adding multiple exercises', () => {
      render(<StartWorkoutScreen />);

      const input = screen.getByPlaceholderText('Enter Exercise Name');

      // Add first exercise
      fireEvent.changeText(input, 'Push-ups');
      fireEvent.press(screen.getByText('Add Exercise'));

      // Add second exercise
      fireEvent.changeText(input, 'Squats');
      fireEvent.press(screen.getByText('Add Exercise'));

      expect(screen.getByText('Push-ups')).toBeTruthy();
      expect(screen.getByText('Squats')).toBeTruthy();
    });
  });
});
