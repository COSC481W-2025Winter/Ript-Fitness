import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LogFoodButton from '@/components/foodlog/FoodLogButton';

describe('LogFoodButton', () => {
  const mockProps = {
    id: 1,
    name: 'Chicken Breast',
    calories: 200,
    protein: 30,
    carbs: 5,
    fat: 5,
    multiplier: 1,
    saveFoodChanges: jest.fn(),
    logFoodToDay: jest.fn(),
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    width: 200,
    textColor: '#000',
    fontSize: 16,
  };

  it('renders correctly with given props', () => {
    const { getByText } = render(<LogFoodButton {...mockProps} />);
    expect(getByText('Chicken Breast')).toBeTruthy();
    expect(getByText('Calories: 200')).toBeTruthy();
  });


  it('saves changes when "Save" is clicked', async () => {
    const { getByText, getByTestId, getByDisplayValue } = render(<LogFoodButton {...mockProps} />);
    
    // Open modal and toggle to edit mode
    fireEvent.press(getByText('Chicken Breast'));
    fireEvent.press(getByText('Edit'));
    
    // Simulate change in food name
    const input = getByDisplayValue('Chicken Breast');
    fireEvent.changeText(input, 'Grilled Chicken');

    // Simulate save
    fireEvent.press(getByText('Save'));
    
    // Check if saveFoodChanges is called with the updated values
    await waitFor(() => expect(mockProps.saveFoodChanges).toHaveBeenCalledWith({
      id: 1,
      name: 'Grilled Chicken',
      calories: 200,
      protein: 30,
      carbs: 5,
      fat: 5,
      multiplier: 1,
      isDeleted: false,
    }));
  });

  it('logs the food to the day when "Log Today" is clicked', async () => {
    const { getByText, getByTestId } = render(<LogFoodButton {...mockProps} />);
    
    // Open modal
    fireEvent.press(getByText('Chicken Breast'));
    
    // Simulate logging the food
    fireEvent.press(getByText('Log Today'));
    
    // Check if logFoodToDay is called with the updated food
    await waitFor(() => expect(mockProps.logFoodToDay).toHaveBeenCalledWith({
      id: 1,
      name: 'Chicken Breast',
      calories: 200,
      protein: 30,
      carbs: 5,
      fat: 5,
      multiplier: 1,
      isDeleted: false,
    }));
  });
});
