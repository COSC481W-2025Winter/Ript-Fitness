import 'react-native-gesture-handler';  // Necessary for React Navigation
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Define types for the navigation stack
type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

//const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <GlobalProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Social">
        <Tab.Screen name="Social" component={SocialStack}  //Each Tab!
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="globe-outline" size={size} color={color} /> //recommend changing the icon
                    ),
                  }}/>
                  
        <Tab.Screen name="Workout" component={WorkoutStack} 
                  options={{  headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="barbell" size={size} color={color} />
                    ),
                  }}/>
    
        <Tab.Screen name="Body" component={BodyStack} 
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="body" size={size} color={color} />
                    ),
                  }}/>
                  
                  <Tab.Screen name="Profile" component={ProfileStack} 
                  options={{
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="home" size={size} color={color} />
                    ),
                  }}/>
      </Tab.Navigator>
    </NavigationContainer>

    <SplashScreen />
    </GestureHandlerRootView>
    </GlobalProvider>
  );
}
