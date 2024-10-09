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

  import React from 'react';

  jest.mock('react-native-gesture-handler', () => {
    const View = require('react-native').View; // Use View for certain mock components
    const React = require('react'); // Import React directly inside the mock
  
    return {
      ...jest.requireActual('react-native-gesture-handler'), // Preserve actual implementation of react-native-gesture-handler
      PanGestureHandler: React.forwardRef((props, ref) => <div ref={ref} {...props} />),
      TouchableOpacity: React.forwardRef((props, ref) => (
        <button ref={ref} onClick={props.onPress}>
          {props.children}
        </button>
      )),
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
    };
  });
