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
    expect(weekButton.parent?.props.style).toEqual([{"color": "#4B5563", "fontSize": 14}, {"color": "#fff", "fontWeight": "bold"}]);

    const monthButton = getByText('Month');
    fireEvent.press(monthButton);

    expect(monthButton.parent?.props.style).toEqual( [{"color": "#4B5563", "fontSize": 14}, {"color": "#fff", "fontWeight": "bold"}]);

    expect(weekButton.parent?.props.style).not.toEqual([{"color": "#4B5563", "fontSize": 14}, {"color": "#fff", "fontWeight": "bold"}]);

    const yearButton = getByText('Year');
    fireEvent.press(yearButton);

    expect(yearButton.parent?.props.style).toEqual([{"color": "#4B5563", "fontSize": 14}, {"color": "#fff", "fontWeight": "bold"}]);

    expect(monthButton.parent?.props.style).not.toContainEqual({ backgroundColor: '#60A5FA' });
  });

  it('renders VictoryChart correctly', () => {
    const { getByTestId } = render(<GraphScreen />);
  });
});