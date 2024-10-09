import 'react-native-gesture-handler';  // Necessary for React Navigation
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
import ApiScreen from '@/app/screens/ApiScreen';
import WelcomeScreen from '@/app/screens/WelcomeScreen';
import LoginScreen from '@/app/screens/LoginScreen';
import SignupScreen from '@/app/screens/SignupScreen';


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

function MainApp() {
  return (
    <Tab.Navigator 
      initialRouteName="Social"
      screenOptions={{
        // tabBarLabelStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#0D0D0D',
        tabBarInactiveTintColor: '#73726F',
      }}
    >
      <Tab.Screen name="Social" component={SocialStack}  //Each Tab!
                options={{
                  tabBarIcon: ({ focused, size, color }) => (
                    <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color}/> //recommend changing the icon
                  ),
                }}/>
                
      <Tab.Screen name="Workout" component={WorkoutStack} 
                options={{
                  tabBarIcon: ({ focused, size, color }) => (
                    <Ionicons name={focused ? 'barbell' : 'barbell-outline'} size={size} color={color} />
                  ),
                  headerShown: false,
                }}/>

      <Tab.Screen name="Body" component={BodyStack} 
                options={{
                  tabBarIcon: ({ focused, size, color }) => (
                    <Ionicons name={focused ? 'body' : 'body-outline'} size={size} color={color}/>
                  ),
                }}/>
                
                <Tab.Screen name="Profile" component={ProfileStack} 
                options={{
                  tabBarIcon: ({ focused, size, color }) => (
                    <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
                  ),
                }}/>
    </Tab.Navigator>
  );
}
// gestureEnabled to False for a simple fix so users can't navigate to login

export default function App() {

  return (
    <GlobalProvider>

      <StatusBar barStyle="default" />


    {/* {false ? */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{gestureEnabled: true }} initialRouteName="Welcome">  
          <Stack.Screen 
            options={{headerShown: false}}  
            name="Welcome" component={WelcomeScreen} 
          />
          <Stack.Screen 
            options={{headerShown: false}}  
            name="Login" component={LoginScreen} 
          />
          <Stack.Screen 
            options={{headerShown: false}}  
            name="Signup" component={SignupScreen} 
          />
          <Stack.Screen 
            options={{headerShown: false}} 
            name="Home" 
            component={MainApp} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    {/* // :
    // <SplashScreen />
    <WelcomeScreen /> } */}

    </GlobalProvider>
  );
}
