import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import FoodLogSavedPage from '@/app/screens/foodlog/FoodLogSaved';
import { GlobalContext } from '@/context/GlobalContext';
import { httpRequests } from '@/api/httpRequests';

// Mocking the GlobalContext
const mockContextValue = {
    data: {
        token: 'mocked-token',
    },
};

// Mock the fetch function to return a resolved promise with fake food data
global.fetch = jest.fn(() =>
    Promise.resolve({
        status: 200,
        json: () => Promise.resolve([
            { id: 1, name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, multiplier: 1, isDeleted: false },
            { id: 2, name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, multiplier: 1, isDeleted: false },
            { id: 3, name: 'Carrot', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, multiplier: 1, isDeleted: false },
        ]),
    })
);

describe('FoodLogSavedPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly and displays food items', async () => {
        render(
            <GlobalContext.Provider value={mockContextValue}>
                <FoodLogSavedPage />
            </GlobalContext.Provider>
        );

        // Wait for the food items to be fetched and displayed
        await waitFor(() => {
            expect(screen.getByText('Apple')).toBeTruthy();
            expect(screen.getByText('Banana')).toBeTruthy();
            expect(screen.getByText('Carrot')).toBeTruthy();
        });
    });

    test('fetches food details and updates state', async () => {
        render(
            <GlobalContext.Provider value={mockContextValue}>
                <FoodLogSavedPage />
            </GlobalContext.Provider>
        );

        // Ensure the fetch was called correctly
        expect(fetch).toHaveBeenCalledWith(`${httpRequests.getBaseURL()}/nutritionCalculator/getFoodIdsOfLoggedInUser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${mockContextValue.data.token}`,
            },
        });

        // // Wait for the FlatList to render with the correct items
        // await waitFor(() => {
        //     const foodItems = screen.getAllByText(/Apple|Banana|Carrot/i);
        //     expect(foodItems).toHaveLength(3);
        // });
        const foodItems = await screen.findAllByText(/Apple|Banana|Carrot/i);
        expect(foodItems).toHaveLength(3);
    });
});
