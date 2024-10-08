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
  