import React from 'react';
import { render } from '@testing-library/react-native';
import StreakCounter from '@/components/StreakCounter';
import { useStreak } from '@/context/StreakContext';

jest.mock('@/context/StreakContext', () => ({
  useStreak: jest.fn(),
}));

describe('StreakCounter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when loading is true', () => {
    (useStreak as jest.Mock).mockReturnValue({
      streak: 0,
      loading: true,
      error: null,
    });

    const { queryByText } = render(<StreakCounter />);

    expect(queryByText('0')).toBeNull();
  });

  it('does not render when there is an error', () => {
    (useStreak as jest.Mock).mockReturnValue({
      streak: 0,
      loading: false,
      error: 'Error fetching streak',
    });

    const { queryByText } = render(<StreakCounter />);

    expect(queryByText('0')).toBeNull();
  });

  it('renders correctly with streak data', () => {
    (useStreak as jest.Mock).mockReturnValue({
      streak: 5,
      loading: false,
      error: null,
    });

    const { getByText } = render(<StreakCounter />);
    const streakElement = getByText('5');
    expect(streakElement).toBeTruthy();
  });

  it('renders correctly with different streak data', () => {
    (useStreak as jest.Mock).mockReturnValue({
      streak: 10,
      loading: false,
      error: null,
    });

    const { getByText } = render(<StreakCounter />);
    const streakElement = getByText('10');
    expect(streakElement).toBeTruthy();
  });
});