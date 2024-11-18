
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { httpRequests } from '@/api/httpRequests';
import { ProfileContext } from './ProfileContext';


// Define the structure of your global data
export interface GlobalData {
  token: string;
}

export interface ProfileObject {
  id: string,
  firstName: string,
  lastName: string,
  username: string,
  prs: [],
  isDeleted: false
}

interface GlobalContextType {
  data: GlobalData;
  updateGlobalData: (updatedData: GlobalData) => void;
  isLoaded: boolean;
  additionalLoadingRequired: boolean;
  loadInitialData: () => void;
  loadAdditionalData: () => void;
  setToken: (token: string) => void;
  userProfile: ProfileObject;
  updateUserProfile: (newExampleObject: ProfileObject) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {

  const [isLoaded, setIsLoaded] = useState(false);
  const [additionalLoadingRequired, setAdditionalLoadingRequired] = useState(false);
  const [data, setData] = useState<GlobalData>({ token: '' });


  const [userProfile, setMyUserProfile] = useState<ProfileObject>(
    { id: '-1', firstName: 'myFirstName', lastName: 'myLastName', username: 'myUserName', prs: [], isDeleted: false });

  const updateUserProfile = (newExampleObject: ProfileObject) => {
    setMyUserProfile(newExampleObject);
  };

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

  // Track changes to `data` and log the new value
  useEffect(() => {
    console.log("Updated token:", data.token);
  }, [data.token]); // Run whenever `data` changes

  const loadInitialData = async () => {
    if (!isLoaded) {
      await loadToken();
      if (data.token != "") {
        await Promise.all([
          loadInitialBodyData(),
          loadInitialProfileData(),
          loadInitialSocialData(),
          loadInitialWorkoutData(),
        ]);
      } else {
        setAdditionalLoadingRequired(true);
      }
      setIsLoaded(true);
    }
  };

  const loadAdditionalData = async () => {
      if (data.token != "") {
        await Promise.all([
          loadInitialBodyData(),
          loadInitialProfileData(),
          loadInitialSocialData(),
          loadInitialWorkoutData(),
        ]);
        setIsLoaded(true);
        setAdditionalLoadingRequired(false);
    }
    return false;
  };


  const loadToken = async () => {
    let storedToken
    try {
      storedToken = await AsyncStorage.getItem('@token');
      if (storedToken) {
        console.log('Token loaded:', storedToken);
        await setToken(storedToken);
      } else {
        console.log('No token found');
        return
      }
    } catch (error) {
      console.error('Failed to load token:', error);
    }

    try {
    const response = await fetch(`${httpRequests.getBaseURL()}/api/token/validate`, {
      method: 'POST', // Set method to POST
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
      },
      body: `${storedToken}`, // Convert the data to a JSON string
    }); // Use endpoint or replace with BASE_URL if needed
    if (!response.ok) {
      console.log("expired " + storedToken)
      setToken("");
    }
    //const json = await response.text() //.json(); // Parse the response as JSON;
    //return json; // Return the JSON data directly
  } catch (error) {
  
    console.error('GET request failed:', error);
    throw error; // Throw the error for further handling if needed
  }
  };



  // Simulated data loading functions
  const loadInitialBodyData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const loadInitialProfileData = async () => {
    const profileContext = useContext(ProfileContext)
      
      try {
      const response = await fetch(`${httpRequests.getBaseURL()}/userProfile/getUserProfile`, {
        method: 'GET', // Set method to POST
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
          "Authorization": `Bearer ${data.token}`,
        },
        body: "", // Convert the data to a JSON string
      }); // Use endpoint or replace with BASE_URL if needed
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      console.log("HHHHH" + profileContext)
      updateUserProfile(await response.json())
    } catch (error) {
      // If access denied
      // Send to login page
  
      console.error('GET request failed:', error);
      throw error; // Throw the error for further handling if needed
    }
  };

  const loadInitialSocialData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const loadInitialWorkoutData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };


  return (

    <GlobalContext.Provider
      value={{
        data,
        updateGlobalData,
        loadInitialData,
        loadAdditionalData,
        isLoaded,
        additionalLoadingRequired,
        setToken,
        userProfile,
        updateUserProfile
      }}
    >

      {children}
    </GlobalContext.Provider>
  );
};