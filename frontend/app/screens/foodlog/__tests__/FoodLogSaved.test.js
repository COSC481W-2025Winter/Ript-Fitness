import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FoodLogSavedPage from '@/app/screens/foodlog/FoodLogSaved';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetchMock from 'jest-fetch-mock';
import { GlobalContext } from '@/context/GlobalContext';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));
jest.mock('@/api/httpRequests', () => ({
  httpRequests: {
    getBaseURL: () => 'https://mockbaseurl.com',
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('FoodLogSavedPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    AsyncStorage.clear();
  });

  const mockContext = {
    data: { token: 'mock-token' },
  };

  it('renders loading state correctly', () => {
    const { getByText } = render(
      <GlobalContext.Provider value={mockContext}>
        <FoodLogSavedPage />
      </GlobalContext.Provider>
    );
    expect(getByText('Loading...')).toBeTruthy();
  });


});