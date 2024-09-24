// ContactsContext.tsx
import React, { createContext, useState, ReactNode } from 'react';


// Define this at the top of your file or in a separate types file
export interface WorkoutObjectsToPass {
    id: string;
    name: string;
    title: string;
    employer: string;
    // ... other fields
  }
  


interface WorkoutContextType {
  exampleObject: WorkoutObjectsToPass[];
  updateExampleObject: (newExampleObject: WorkoutObjectsToPass) => void;
}

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
  children: ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
    //Creating an array here, feel free to make it whatever you want though.
  //Pretty sure this would usually be an API call unless we hardcode some workouts?
  const [exampleObject, setExampleObject] = useState<WorkoutObjectsToPass[]>([
     { id: '1', name: 'Alice Smith', title: 'Engineer', employer: 'Tech Corp' },
     { id: '2', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
     { id: '3', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
     { id: '4', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
     { id: '5', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
  ]);

  const updateExampleObject = (newExampleObject: WorkoutObjectsToPass) => {
    console.log(newExampleObject)
    setExampleObject(previousObject =>
      previousObject.map(exampleObject =>
        exampleObject.id === newExampleObject.id ? newExampleObject : exampleObject
      )
    );
  };

  return (
    <WorkoutContext.Provider value={{ exampleObject, updateExampleObject }}>
      {children}
    </WorkoutContext.Provider>
  );
};
