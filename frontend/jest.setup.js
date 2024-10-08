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
  
  jest.mock('@react-navigation/native', () => {
    return {
      ...jest.requireActual('@react-navigation/native'),
      useNavigation: () => ({
        navigate: jest.fn(),
      }),
    };
  });



// jest.setup.js
import React from 'react';

jest.mock('react-native-gesture-handler', () => {
  const React = require('react'); // Import React directly inside the mock
  return {
    ...jest.requireActual('react-native-gesture-handler'),
    PanGestureHandler: React.forwardRef((props, ref) => <div ref={ref} {...props} />),
    TouchableOpacity: React.forwardRef((props, ref) => <button ref={ref} onClick={props.onPress}>{props.children}</button>),
    // Include other components as needed
  };
});
