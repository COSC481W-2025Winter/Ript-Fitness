import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import LoginScreen from '@/app/screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';


export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Signup: undefined;
    Home: undefined;
    // Details: undefined;
  };

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
// Mock the navigation and route
const Stack = createStackNavigator<RootStackParamList>();


const mockNavigate = jest.fn();
const mockReset = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      reset: mockReset,
    }),
  };
});

// Mock HTTP Requests
jest.mock('@/api/httpRequests', () => ({
  httpRequests: {
    put: jest.fn(() => Promise.resolve({
      status: 200,
      text: jest.fn(() => Promise.resolve('Success'))
    }))
  }
}));

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign into your Account')).toBeTruthy();
    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  it('allows entering username and password', () => {
    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'testpass');

    expect(usernameInput.props.value).toBe('testuser');
    expect(passwordInput.props.value).toBe('testpass');
  });

  it('handles login button press', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    const loginButton = getByText('Log in');

    await act(async () => {
      fireEvent.press(loginButton);
    });

    //expect(mockNavigate).toHaveBeenCalledWith('Home');
  });
});
