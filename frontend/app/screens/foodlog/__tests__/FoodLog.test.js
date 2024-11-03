import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FoodLogScreen from '@/app/screens/foodlog/FoodLog';
import { GlobalContext } from '@/context/GlobalContext';
import { httpRequests } from "@/api/httpRequests";

jest.mock('@/api/httpRequests', () => ({
  getBaseURL: jest.fn(() => 'https://api.example.com')
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('FoodLogScreen', () => {
  const mockContext = {
    data: { token: 'mockToken' }
  };

  it('renders macro buttons with correct initial values', () => {
    const { getByText } = render(
      <GlobalContext.Provider value={mockContext}>
        <FoodLogScreen />
      </GlobalContext.Provider>
    );

    expect(getByText('Calories')).toBeTruthy();
    expect(getByText('Protein')).toBeTruthy();
    expect(getByText('Carbs')).toBeTruthy();
    expect(getByText('Fat')).toBeTruthy();
    expect(getByText('Water')).toBeTruthy();
  });

  it('changes selected page when navbar buttons are pressed', () => {
    const { getByText } = render(
      <GlobalContext.Provider value={mockContext}>
        <FoodLogScreen />
      </GlobalContext.Provider>
    );

    fireEvent.press(getByText('Saved'));
    expect(getByText('Saved')).toHaveStyle({ textDecorationLine: 'underline' });

    fireEvent.press(getByText('Add'));
    expect(getByText('Add')).toHaveStyle({ textDecorationLine: 'underline' });
  });

  it('adds water when the add water button is pressed', async () => {
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValue({ totalWaterConsumed: 10 })
    };
    global.fetch = jest.fn(() => Promise.resolve(mockResponse));

    const { getByTestId, getByText } = render(
      <GlobalContext.Provider value={mockContext}>
        <FoodLogScreen />
      </GlobalContext.Provider>
    );

    fireEvent.press(getByTestId('add-water-button'));
    await waitFor(() => expect(getByText('10')).toBeTruthy());

    global.fetch.mockRestore();
  });

  it('subtracts water when the minus water button is pressed', async () => {
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValue({ totalWaterConsumed: 0 })
    };
    global.fetch = jest.fn(() => Promise.resolve(mockResponse));

    const { getByTestId, getByText } = render(
      <GlobalContext.Provider value={mockContext}>
        <FoodLogScreen />
      </GlobalContext.Provider>
    );

    fireEvent.press(getByTestId('minus-water-button'));
    await waitFor(() => expect(getByText('0')).toBeTruthy());

    global.fetch.mockRestore();
  });

  it('calls newDay API and clears macros when "Today" is pressed', async () => {
    const mockResponse = {
      status: 201,
      json: jest.fn().mockResolvedValue({ id: 'newDayId' })
    };
    global.fetch = jest.fn(() => Promise.resolve(mockResponse));

    const { getByText } = render(
      <GlobalContext.Provider value={mockContext}>
        <FoodLogScreen />
      </GlobalContext.Provider>
    );

    fireEvent.press(getByText('Today'));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/nutritionCalculator/addDay',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer mockToken',
        })
      })
    ));
    global.fetch.mockRestore();
  });

  it('fetches and updates macros when setTotalForDay is called', async () => {
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValue({
        calories: 500,
        totalCarbs: 100,
        totalProtein: 50,
        totalFat: 20
      })
    };
    global.fetch = jest.fn(() => Promise.resolve(mockResponse));

    const { getByText } = render(
      <GlobalContext.Provider value={mockContext}>
        <FoodLogScreen />
      </GlobalContext.Provider>
    );

    await waitFor(() => expect(getByText('500')).toBeTruthy());
    await waitFor(() => expect(getByText('100')).toBeTruthy());
    await waitFor(() => expect(getByText('50')).toBeTruthy());
    await waitFor(() => expect(getByText('20')).toBeTruthy());

    global.fetch.mockRestore();
  });
});
