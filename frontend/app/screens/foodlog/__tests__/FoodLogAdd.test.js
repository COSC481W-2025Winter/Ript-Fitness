import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FoodLogAddPage from '@/app/screens/foodlog/FoodLogAdd';
import { GlobalContext } from '@/context/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { httpRequests } from '@/api/httpRequests';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));
jest.mock('@/api/httpRequests', () => ({
    getBaseURL: jest.fn(() => 'http://mockurl.com'),
}));

const mockGlobalContext = {
    data: {
        token: 'mock-token',
    },
};

describe('FoodLogAddPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders without crashing', () => {
        const { getByPlaceholderText } = render(
            <GlobalContext.Provider value={mockGlobalContext}>
                <FoodLogAddPage />
            </GlobalContext.Provider>
        );
        expect(getByPlaceholderText('Add Name')).toBeTruthy();
    });

    test('validates food name input', () => {
        const { getByPlaceholderText } = render(
            <GlobalContext.Provider value={mockGlobalContext}>
                <FoodLogAddPage />
            </GlobalContext.Provider>
        );

        const foodNameInput = getByPlaceholderText('Add Name');
        fireEvent.changeText(foodNameInput, '');
        expect(foodNameInput.props.value).toBe('');
    });

    test('validates calorie input', () => {
        const { getByPlaceholderText } = render(
            <GlobalContext.Provider value={mockGlobalContext}>
                <FoodLogAddPage />
            </GlobalContext.Provider>
        );

        const calorieInput = getByPlaceholderText('Add Calories');
        fireEvent.changeText(calorieInput, '-50');
        expect(calorieInput.props.value).toBe('');
    });

    test('fetches and sets the day on mount', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(1));
        const { getByText } = render(
            <GlobalContext.Provider value={mockGlobalContext}>
                <FoodLogAddPage />
            </GlobalContext.Provider>
        );

        await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith('day'));
    });
});
