import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import FoodLogLoggedPage from '@/app/screens/foodlog/FoodLogLogged';
import { GlobalContext } from '@/context/GlobalContext';
import { NavigationContainer } from '@react-navigation/native';

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

    const renderWithNavigation = (component) => {
        return render(
            <GlobalContext.Provider value={mockContextValue}>
                <NavigationContainer>{component}</NavigationContainer>
            </GlobalContext.Provider>
        );
    };

    it('renders loading state initially', () => {
        renderWithNavigation(<FoodLogLoggedPage dayId={1} />);

        // Assert that a loading message is displayed
        expect(screen.getByText('Loading...')).toBeTruthy();
    });
});
