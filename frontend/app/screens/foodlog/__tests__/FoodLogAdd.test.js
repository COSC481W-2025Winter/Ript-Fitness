import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import FoodLogAddPage from '@/app/screens/foodlog/FoodLogAdd';
import { GlobalContext } from '@/context/GlobalContext';

// Mock the API requests
global.fetch = jest.fn();

const mockContextValue = {
    data: {
        token: 'mockToken'
    }
};

describe('FoodLogAddPage', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('renders input fields correctly', () => {
        render(
            <GlobalContext.Provider value={mockContextValue}>
                <FoodLogAddPage dayId={1} />
            </GlobalContext.Provider>
        );

        expect(screen.getByPlaceholderText('Food Name')).toBeTruthy();
        expect(screen.getByPlaceholderText('Calories')).toBeTruthy();
        expect(screen.getByPlaceholderText('Total Fat')).toBeTruthy();
        expect(screen.getByPlaceholderText('Total Carbohydrates')).toBeTruthy();
        expect(screen.getByPlaceholderText('Total Protein')).toBeTruthy();
        expect(screen.getByPlaceholderText('Number of Servings')).toBeTruthy();
    });

    it('saves food correctly when provided with valid data', async () => {
        fetch.mockResolvedValueOnce({
            status: 201,
            json: jest.fn().mockResolvedValue({ id: 1 })
        }).mockResolvedValueOnce({
            status: 201
        });

        render(
            <GlobalContext.Provider value={mockContextValue}>
                <FoodLogAddPage dayId={1} />
            </GlobalContext.Provider>
        );

        fireEvent.changeText(screen.getByPlaceholderText('Food Name'), 'Valid Food');
        fireEvent.changeText(screen.getByPlaceholderText('Calories'), '100');
        fireEvent.changeText(screen.getByPlaceholderText('Total Fat'), '10');
        fireEvent.changeText(screen.getByPlaceholderText('Total Carbohydrates'), '20');
        fireEvent.changeText(screen.getByPlaceholderText('Total Protein'), '5');
        fireEvent.changeText(screen.getByPlaceholderText('Number of Servings'), '1');

        fireEvent.press(screen.getByText('Save Food'));

        // Wait for the fetch call to be made
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        }, { timeout: 10000 }); // Wait up to 10 seconds
        
        // Check the fetch call details
        
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/nutritionCalculator/addFood'),
            expect.objectContaining({
                method: 'POST',
            })
        );
        });

});
