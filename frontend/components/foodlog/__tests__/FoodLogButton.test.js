import React from 'react';
import { render } from '@testing-library/react-native';
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
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    width: 200,
    textColor: '#000',
    fontSize: 16,
  };

  it('renders correctly with given props', () => {
    const { getByText } = render(<LogFoodButton {...mockProps} />);

    // Check if name and calories text are displayed
    expect(getByText('Chicken Breast')).toBeTruthy();
    expect(getByText('Calories: 200')).toBeTruthy();
  });
});
