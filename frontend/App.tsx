// App.tsx

import 'react-native-gesture-handler';
import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { View, Text, StatusBar, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SocialStack from './app/(tabs)/SocialStack';
import WorkoutStack from './app/(tabs)/WorkoutStack';
import BodyStack from './app/(tabs)/BodyStack';
import ProfileStack from './app/(tabs)/ProfileStack';
import { GlobalContext, GlobalProvider } from './context/GlobalContext';
import { StreakProvider } from './context/StreakContext';
import SplashScreen from '@/app/screens/SplashScreen';
import WelcomeScreen from '@/app/screens/welcome/WelcomeScreen';
import LoginScreen from '@/app/screens/welcome/LoginScreen';
import SignupScreen from '@/app/screens/welcome/SignupScreen';

import { SocialFeedProvider } from './context/SocialFeedContext';

import { NotesProvider } from './components/MyNotes/NotesContext';
import { httpRequests } from './api/httpRequests';


// Define types for the navigation stack
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};
export type RootScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainApp() {
  return (
    <Tab.Navigator 
      initialRouteName="Social"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0D0D0D',
        tabBarInactiveTintColor: '#73726F',
      }}
    >
      <Tab.Screen 
        name="Social" 
        component={SocialStack}
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color}/>
          ),
        }}
      />
      <Tab.Screen 
        name="Workout" 
        component={WorkoutStack} 
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name={focused ? 'barbell' : 'barbell-outline'} size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Body" 
        component={BodyStack} 
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name={focused ? 'body' : 'body-outline'} size={size} color={color}/>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack} 
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const context = useContext(GlobalContext)
  const isLoading = context.isLoaded
  const [verifiedToken, setVerifiedToken] = useState(false)
  const [temp, setTemp] = useState(true)
  let user = (context.data.token != '')

const validateExistingToken = async () => {
  try {
  const response = await fetch(`${httpRequests.getBaseURL()}/api/token/validate`, {
    method: 'POST', // Set method to POST
    headers: {
      'Content-Type': 'application/json', // Set content type to JSON
    },
    body: `${context?.data.token}`, // Convert the data to a JSON string
  }); // Use endpoint or replace with BASE_URL if needed
  console.log("foooo " + response.ok)
  if (!response.ok) {
    context.setToken("");
    user = (context.data.token != '')
  }
  setVerifiedToken(true)
  const json = await response.text() //.json(); // Parse the response as JSON;
  return json; // Return the JSON data directly
} catch (error) {

  console.error('GET request failed:', error);
  throw error; // Throw the error for further handling if needed
}
}

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user && !verifiedToken) {
    console.log("1234")
    validateExistingToken();
  }

  return (
    <Stack.Navigator
      screenOptions={{ gestureEnabled: true }}
      initialRouteName={user ? 'Home' : 'Welcome'}
    >
      {user && verifiedToken? (
        <Stack.Screen
          name="Home"
          component={MainApp}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <StreakProvider>
        <NotesProvider>
        <SocialFeedProvider>
        <>
          <StatusBar barStyle="default" />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </>
        </SocialFeedProvider>
          </NotesProvider>

      </StreakProvider>
    </GlobalProvider>
  );
}
