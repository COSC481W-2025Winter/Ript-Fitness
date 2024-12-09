import React from 'react';
import { render } from '@testing-library/react-native';
import MacroButton from '@/components/foodlog/MacroButton';

describe('MacroButton', () => {
  const mockProps = {
    title: 'Protein',
    total: 150,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    width: 100,
    textColor: '#000',
    fontSize: 16,
  };

  it('renders correctly with given props', () => {
    const { getByText } = render(<MacroButton {...mockProps} />);

    // Check if title and total text are displayed
    expect(getByText('Protein')).toBeTruthy();
    expect(getByText('150')).toBeTruthy();
  });
});
