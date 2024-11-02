import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the structure of your global data
export interface GlobalData {
  token: string;
}

interface GlobalContextType {
  data: GlobalData;
  updateGlobalData: (updatedData: GlobalData) => void;
  isLoaded: boolean;
  loadInitialData: () => void;
  setToken: (token: string) => void;
}

const defaultGlobalContext: GlobalContextType = {
  data: { token: '' },
  updateGlobalData: () => {},
  isLoaded: false,
  loadInitialData: () => {},
  setToken: () => {},
};

export const GlobalContext = createContext<GlobalContextType>(defaultGlobalContext);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<GlobalData>({ token: '' });

  const updateGlobalData = (updatedData: GlobalData) => {
    setData(updatedData);
  };

  const setToken = async (token: string) => {
    console.log('Setting token:', token);
    try {
      await AsyncStorage.setItem('@token', token);
      setData((prevData) => ({ ...prevData, token }));
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  };

  const loadInitialData = async () => {
    await Promise.all([
      loadInitialBodyData(),
      loadInitialProfileData(),
      loadInitialSocialData(),
      loadInitialWorkoutData(),
    ]);
    setIsLoaded(true);
  };

  // Simulated data loading functions
  const loadInitialBodyData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const loadInitialProfileData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const loadInitialSocialData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const loadInitialWorkoutData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // Load the token from AsyncStorage when the app starts
  useEffect(() => {
    const loadToken = async () => {
      try {
        console.log('Loading token...');
        const storedToken = await AsyncStorage.getItem('@token');
        if (storedToken) {
          console.log('Token loaded:', storedToken);
          setData((prevData) => ({ ...prevData, token: storedToken }));
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Failed to load token:', error);
      }
    };

    loadToken().catch((error) => {
      console.error('Unhandled error in loadToken:', error);
    });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        data,
        updateGlobalData,
        loadInitialData,
        isLoaded,
        setToken,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
