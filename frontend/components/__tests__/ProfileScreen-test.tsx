// components/__tests__/ProfileScreen.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import ProfileScreen from '@/app/screens/ProfileScreen'; // Adjust the import path as needed
import { GlobalContext } from '@/context/GlobalContext';
import { NavigationContainer } from '@react-navigation/native';
import fetchMock from 'jest-fetch-mock';

// Mock react-native-svg to prevent errors during testing
jest.mock('react-native-svg', () => require('react-native-svg-mock'));

// Mock useNavigation to prevent actual navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      reset: jest.fn(),
      getState: jest.fn(() => ({
        stale: false,
        type: 'stack',
        key: 'stack-viEzMxCXHrIc-KT7_foks',
        index: 0,
        routeNames: ['Profile'],
        routes: [{ key: 'Profile-...', name: 'Profile', params: undefined }],
      })),
    }),
  };
});

describe('ProfileScreen', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const mockContextValue: any = {
    data: {
      token: 'mock-token',
      // Add other necessary data properties if any
    },
    setToken: jest.fn(),
    updateGlobalData: jest.fn(),
    isLoaded: true,
    loadInitialData: jest.fn(),
    // Add any other required properties from GlobalContextType
  };

  it('renders user profile information correctly', () => {
    const { getByText, getAllByText } = render(
      <GlobalContext.Provider value={mockContextValue}>
        <NavigationContainer>
          <ProfileScreen />
        </NavigationContainer>
      </GlobalContext.Provider>
    );

    // Verify user's name is rendered
    expect(getByText('Steve')).toBeTruthy();

    // Verify Friends label
    expect(getByText('Friends:')).toBeTruthy();

    // Verify "+1" more friends
    expect(getByText('+1')).toBeTruthy();

    // Verify tabs are rendered
    const progressTabs = getAllByText('Progress');
    const photosTabs = getAllByText('Photos');
    const postsTabs = getAllByText('Posts');

    expect(progressTabs.length).toBeGreaterThan(0);
    expect(photosTabs.length).toBeGreaterThan(0);
    expect(postsTabs.length).toBeGreaterThan(0);
  });
});
