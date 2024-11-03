import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GraphScreen from '@/app/screens/profile/GraphScreen';

describe('GraphScreen', () => {
  it('renders the title and range buttons', () => {
    const { getByText } = render(<GraphScreen />);

    expect(getByText('Average Reps Over Time')).toBeTruthy();

    expect(getByText('Week')).toBeTruthy();
    expect(getByText('Month')).toBeTruthy();
    expect(getByText('Year')).toBeTruthy();
  });

  it('changes the range when a different button is pressed', () => {
    const { getByText, getByTestId } = render(<GraphScreen />);

    const weekButton = getByText('Week');
    expect(weekButton.parent?.props.style).toContainEqual({ backgroundColor: '#60A5FA' });

    const monthButton = getByText('Month');
    fireEvent.press(monthButton);

    expect(monthButton.parent?.props.style).toContainEqual({ backgroundColor: '#60A5FA' });

    expect(weekButton.parent?.props.style).not.toContainEqual({ backgroundColor: '#60A5FA' });

    const yearButton = getByText('Year');
    fireEvent.press(yearButton);

    expect(yearButton.parent?.props.style).toContainEqual({ backgroundColor: '#60A5FA' });

    expect(monthButton.parent?.props.style).not.toContainEqual({ backgroundColor: '#60A5FA' });
  });

  it('renders VictoryChart correctly', () => {
    const { getByTestId } = render(<GraphScreen />);
  });
});