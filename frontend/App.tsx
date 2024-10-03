import 'react-native-gesture-handler';  // Necessary for React Navigation
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SocialStack from './app/(tabs)/SocialStack';
import WorkoutStack from './app/(tabs)/WorkoutStack';
import BodyStack from './app/(tabs)/BodyStack';
import ProfileStack from './app/(tabs)/ProfileStack';
import { GlobalContext, GlobalProvider } from './context/GlobalContext';
import { useContext, useEffect, useState } from 'react';
import { ThemedView } from './components/ThemedView';
import { ThemedText } from './components/ThemedText';
import { BodyContext } from './context/BodyContext';
import SplashScreen from '@/app/screens/SplashScreen';
import WelcomeScreen from '@/app/screens/WelcomeScreen';
import LoginScreen from '@/app/screens/LoginScreen';
import SignupScreen from './app/screens/SignupScreen';

// Define types for the navigation stack
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  // Details: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <GlobalProvider>
      <StatusBar barStyle="default" />

    {/* {false ? */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen options={{headerShown: false}}  name="Welcome" component={WelcomeScreen} />
          <Stack.Screen options={{headerShown: false}}  name="Login" component={LoginScreen} />
          <Stack.Screen options={{headerShown: false}}  name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      </NavigationContainer>

    {/* <NavigationContainer>
      <Tab.Navigator initialRouteName="Social">
        <Tab.Screen name="Social" component={SocialStack}  //Each Tab!
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="home" size={size} color={color} /> //recommend changing the icon
                    ),
                  }}/>
                  
        <Tab.Screen name="Workout" component={WorkoutStack} 
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="home" size={size} color={color} />
                    ),
                  }}/>
    
        <Tab.Screen name="Body" component={BodyStack} 
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="home" size={size} color={color} />
                    ),
                  }}/>
                  
                  <Tab.Screen name="Profile" component={ProfileStack} 
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="home" size={size} color={color} />
                    ),
                  }}/>
      </Tab.Navigator>
    </NavigationContainer> */}
    {/* // :
    // <SplashScreen />
    <WelcomeScreen />
                } */}
    </GlobalProvider>
  );
}
