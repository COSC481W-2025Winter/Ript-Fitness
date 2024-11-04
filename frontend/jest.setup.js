// jest.setup.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// jest.setup.js

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
import '@testing-library/jest-native/extend-expect';

// Mock react-native-svg to prevent Jest from failing on SVG imports
jest.mock('react-native-svg', () => require('react-native-svg-mock'));


// jest.setup.js
jest.mock('expo-modules-core', () => ({
    NativeModule: jest.fn(),
  }));
  
  jest.mock('expo-font', () => ({
    loadAsync: jest.fn(),
  }));
  
  jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
  }));


  jest.mock('@expo/vector-icons/Ionicons', () => {
    return {
      __esModule: true,
      default: 'Ionicons',
    };
  });

  
  jest.mock('@react-navigation/native', () => {
    return {
      ...jest.requireActual('@react-navigation/native'),
      useNavigation: () => ({
        navigate: jest.fn(),
      }),
    };
  });

  jest.mock('react-native-gesture-handler', () => {
    const View = require('react-native').View;
    return {
      ScrollView: View,
      Switch: View,
      TextInput: View,
      DrawerLayoutAndroid: View,
      WebView: View,
      State: {},
      PanGestureHandler: View,
      TapGestureHandler: View,
      FlingGestureHandler: View,
      ForceTouchGestureHandler: View,
      LongPressGestureHandler: View,
      PinchGestureHandler: View,
      RotationGestureHandler: View,
      /* Add any other components as needed */
    };
  });
