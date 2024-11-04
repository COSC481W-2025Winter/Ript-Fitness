import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FoodLogScreen from '@/app/screens/foodlog/FoodLog';
import { GlobalContext } from '@/context/GlobalContext';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('FoodLogScreen', () => {
  const mockContext = {
    data: { token: 'mockToken' }
  };

  it('renders basic elements without crashing', () => {
    const { getByText } = render(
      <GlobalContext.Provider value={mockContext}>
        <FoodLogScreen />
      </GlobalContext.Provider>
    );

    // Check that the macro buttons are rendered
    expect(getByText('Calories')).toBeTruthy();
    expect(getByText('Protein')).toBeTruthy();
    expect(getByText('Carbs')).toBeTruthy();
    expect(getByText('Fat')).toBeTruthy();
    expect(getByText('Water')).toBeTruthy();

    // Check that navigation items are rendered
    expect(getByText('Logged')).toBeTruthy();
    expect(getByText('Saved')).toBeTruthy();
    expect(getByText('Add')).toBeTruthy();
  });

  it('navigates between pages without error', () => {
    const { getByText } = render(
      <GlobalContext.Provider value={mockContext}>
        <FoodLogScreen />
      </GlobalContext.Provider>
    );

    fireEvent.press(getByText('Saved'));
    expect(getByText('Saved')).toHaveStyle({ textDecorationLine: 'underline' });

    fireEvent.press(getByText('Add'));
    expect(getByText('Add')).toHaveStyle({ textDecorationLine: 'underline' });

    fireEvent.press(getByText('Logged'));
    expect(getByText('Logged')).toHaveStyle({ textDecorationLine: 'underline' });
  });

  it('handles "Today" button press without error', () => {
    const { getByText } = render(
      <GlobalContext.Provider value={mockContext}>
        <FoodLogScreen />
      </GlobalContext.Provider>
    );

    fireEvent.press(getByText('Today'));
    // No further assertion needed as we’re just checking if it renders and is pressable
  });
});
