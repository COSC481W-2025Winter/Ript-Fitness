import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';




// Define the structure of your global data
export interface GlobalData {
  token: string;
}


export interface Workout {
  id: number; // Optional, as it will be mapped from workoutsId
  name: string;
  exercises: Exercise[];
  isDeleted?: boolean;
}


export interface Exercise {
  exerciseId: number;
  nameOfExercise: string;
  sets: number;
  reps: number[];
  weight: number[];
  description: string;
  exerciseType: number;
  isDeleted?: boolean;


}


interface GlobalContextType {
  data: GlobalData;
  updateGlobalData: (updatedData: GlobalData) => void;
  isLoaded: boolean;
  loadInitialData: () => void;
  setToken: (token: string) => void;
 
  workouts: Workout[];
  fetchWorkouts: () => Promise<void>;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (updatedWorkout: Workout) => void;


}
const httpRequests = {
  getBaseURL: () => "http://ript-fitness-app.azurewebsites.net",
};


const defaultGlobalContext: GlobalContextType = {
  data: { token: '' },
  updateGlobalData: () => {},
  isLoaded: false,
  loadInitialData: () => {},
  setToken: () => {},


  workouts: [],
  fetchWorkouts: async () => {},
  addWorkout: () => {},
  updateWorkout: () => {}, // Default no-op


};




export const GlobalContext = createContext<GlobalContextType>(defaultGlobalContext);


interface GlobalProviderProps {
  children: ReactNode;
}


export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {


  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<GlobalData>({ token: '' });
  const [workouts, setWorkouts] = useState<Workout[]>([]);




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
  const updateWorkout = (updatedWorkout: Workout) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      )
    );
  };


  const fetchWorkouts = async () => {
    try {
      console.log("Fetching workouts with token:", data.token);


      const response = await fetch(`${httpRequests.getBaseURL()}/workouts/getUsersWorkouts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });


      if (!response.ok) {
        throw new Error(`Failed to fetch workouts: ${response.statusText}`);
      }


      const fetchedWorkouts: Workout[] = await response.json();
      console.log("Fetched workouts:", fetchedWorkouts);


      setWorkouts(fetchedWorkouts); // Update the state with fetched workouts
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };
  const addWorkout = (workout: Workout) => {
    console.log("Adding workout to global context:", workout);
    setWorkouts((prevWorkouts) => [...prevWorkouts, workout]);
  };




  // Track changes to `data` and log the new value
  useEffect(() => {
    console.log("Updated token:", data.token);
  }, [data]); // Run whenever `data` changes


  const loadInitialData = async () => {
    try {
      console.log("Loading initial data...");
     
      // Simulated or real initial loading functions
      const loadInitialBodyData = async () => {
        console.log("Loading body data...");
        // Simulate delay or real API calls here
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Body data loaded.");
      };
 
      const loadInitialProfileData = async () => {
        console.log("Loading profile data...");
        // Simulate delay or real API calls here
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Profile data loaded.");
      };
 
      const loadInitialSocialData = async () => {
        console.log("Loading social data...");
        // Simulate delay or real API calls here
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Social data loaded.");
      };
 
      const loadInitialWorkoutData = async () => {
        console.log("Loading workout data...");
        await fetchWorkouts(); // Ensure workouts are fetched
        console.log("Workout data loaded.");
      };
 
      // Execute all loading tasks in parallel
      await Promise.all([
        loadInitialBodyData(),
        loadInitialProfileData(),
        loadInitialSocialData(),
        loadInitialWorkoutData(),
      ]);
 
      console.log("All initial data loaded.");
      setIsLoaded(true); // Indicate that the data is loaded
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };


  return (


    <GlobalContext.Provider
      value={{
        data,
        updateGlobalData,
        loadInitialData,
        isLoaded,
        setToken,
        workouts,
        fetchWorkouts,
        addWorkout,
        updateWorkout,
      }}
    >


      {children}
    </GlobalContext.Provider>
  );
};

