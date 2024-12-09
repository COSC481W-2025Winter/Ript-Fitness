import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import FoodLogScreen from '@/app/screens/foodlog/FoodLog';
import { GlobalContext } from '@/context/GlobalContext';
import { NavigationContainer } from '@react-navigation/native';

// Mocking global context
const mockContextValue = {
  data: {
    token: 'mock-token',
  },
};

// Mock the fetch function
jest.mock('node-fetch', () => jest.fn(() => 
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve([]), // Mock successful fetch response
  })
));

// Suppress console logs
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('FoodLogScreen', () => {
  const renderComponent = async () => {
    await waitFor(() =>
      render(
        <GlobalContext.Provider value={mockContextValue}>
          <NavigationContainer>
            <FoodLogScreen />
          </NavigationContainer>
        </GlobalContext.Provider>
      )
    );
  };

  it('renders without crashing', async () => {
    await renderComponent();
    await waitFor(() => expect(screen.getByText('Today')).toBeTruthy());
  });

  it('should display the correct macro totals', async () => {
    await renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Calories')).toBeTruthy();
      expect(screen.getByText('Protein')).toBeTruthy();
      expect(screen.getByText('Carbs')).toBeTruthy();
      expect(screen.getByText('Fat')).toBeTruthy();
      expect(screen.getByText('Water')).toBeTruthy();
    });
  });

  it('should change page when "Logged", "Saved", or "Add" is clicked', async () => {
    await renderComponent();

    fireEvent.press(screen.getByText('Logged'));
    await waitFor(() => expect(screen.getByText('Logged')).toBeTruthy());

    fireEvent.press(screen.getByText('Saved'));
    await waitFor(() => expect(screen.getByText('Saved')).toBeTruthy());

    fireEvent.press(screen.getByText('Add'));
    await waitFor(() => expect(screen.getByText('Add')).toBeTruthy());
  });
});
