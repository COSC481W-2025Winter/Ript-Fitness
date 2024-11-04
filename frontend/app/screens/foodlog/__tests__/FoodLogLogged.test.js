import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import FoodLogLoggedPage from '@/app/screens/foodlog/FoodLogLogged';
import { GlobalContext } from '@/context/GlobalContext';

// Mock the fetch API and the context
global.fetch = jest.fn();

const mockContextValue = {
    data: {
        token: 'mocked-token',
    },
};

describe('FoodLogLoggedPage', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear previous mocks
    });

    it('renders loading state initially', () => {
        render(
            <GlobalContext.Provider value={mockContextValue}>
                <FoodLogLoggedPage dayId={1} />
            </GlobalContext.Provider>
        );

        // Assert that the loading spinner or message appears
        // You can implement a loading state in your component for this
    });

    it('fetches food details and displays them', async () => {
        const mockFoodData = [
            { id: 1, name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, multiplier: 1, isDelted: false },
        ];
    
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve({ foodIdsInFoodsEatenInDayList: [1, 2] }),
            })
        );
    
        fetch.mockImplementationOnce((url) => {
            if (url.includes('/getFood/')) {
                const foodId = url.split('/').pop();
                const foodItem = mockFoodData.find((item) => item.id === Number(foodId));
                return Promise.resolve({
                    status: 200,
                    json: () => Promise.resolve(foodItem),
                });
            }
            return Promise.reject(new Error('Not Found'));
        });
    
        render(
            <GlobalContext.Provider value={mockContextValue}>
                <FoodLogLoggedPage dayId={1} />
            </GlobalContext.Provider>
        );
    
        // Wait for each food item to appear using findByText
        const apple = await screen.findByText('Apple');
    
        // Assert that the food items are truthy
        expect(apple).toBeTruthy();

    });
});
