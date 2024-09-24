// ContactsContext.tsx
import React, { createContext, useState, ReactNode } from 'react';


// Put any data that needs to be accessible from multiple tabs here.
//for example, session_id, as most (if not all) of our api requests should include a session id. (excluding logging in)
export interface GlobalData {
    session_id: string;
    //tabs_loaded : { socialTab: boolean, workoutTab: boolean, bodyTab: boolean, profileTab: boolean}
    // ... other fields
  }
  


  //All objects/functions being passed in this context.
  //currently only a GlobalData object named "data"
  //and a function to update the global data.
interface GlobalContextType {
  data: GlobalData;
  updateGlobalData: (updatedData: GlobalData) => void;
  isLoaded: boolean;
  loadInitialData: () => void;
}

//Create and export the context based on our ContextType
export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);


interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {

  const [isLoaded, setIsLoaded] = useState(false)
  //build the data, I believe this would usually be an API request
  const [data, setData] = useState<GlobalData>(
     { session_id: "FakeSessionIdHere02u342" } );

  const updateGlobalData = (updatedData: GlobalData) => {
    setData(updatedData); 
  };

  const loadInitialData = async () => {
    await Promise.all([
      loadInitialBodyData(),
      loadInitialProfileData(),
      loadInitialSocialData(),
      loadInitialWorkoutData(),
    ]);
    setIsLoaded(true)
  }

  const loadInitialBodyData = async () => {
    // Simulate an async operation like fetching data
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const loadInitialProfileData = async () => {
    // Simulate an async operation like fetching data
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const loadInitialSocialData = async () => {
    // Simulate an async operation like fetching data
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const loadInitialWorkoutData = async () => {
    // Simulate an async operation like fetching data
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return (
    <GlobalContext.Provider value={{ data, updateGlobalData, loadInitialData, isLoaded }}>
      {children}
    </GlobalContext.Provider>
  );
};
