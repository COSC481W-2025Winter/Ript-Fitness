// ContactsContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';
import { GlobalContext } from './GlobalContext';


// Define this at the top of your file or in a separate types file
export interface BodyObjectsToPass {
    id: string;
    name: string;
    title: string;
    employer: string;
    // ... other fields
  }
  


interface BodyContextType {
  isLoaded: boolean;
  exampleObject: BodyObjectsToPass[];
  updateExampleObject: (newExampleObject: BodyObjectsToPass) => void;
  //loadInitialData: () => void;
}

export const BodyContext = createContext<BodyContextType | undefined>(undefined);

interface BodyProviderProps {
  children: ReactNode;
}

export const BodyProvider: React.FC<BodyProviderProps> = ({ children }) => {
  //Creating an array here, feel free to make it whatever you want though.
  //Pretty sure this would usually be an API call unless we hardcode body parts or something like that.
  const [exampleObject, setExampleObject] = useState<BodyObjectsToPass[]>([
     { id: '1', name: 'Alice Smith', title: 'Engineer', employer: 'Tech Corp' },
     { id: '2', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
     { id: '3', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
     { id: '4', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
     { id: '5', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
  ]);

  const [isLoaded, setIsLoaded] = useState(false)

  const updateExampleObject = (newExampleObject: BodyObjectsToPass) => {
    console.log(newExampleObject)
    setExampleObject(previousObject =>
      previousObject.map(exampleObject =>
        exampleObject.id === newExampleObject.id ? newExampleObject : exampleObject
      )
    );
  };


  


  console.log("BodyProvider")
  return (
    <BodyContext.Provider value={{ exampleObject, updateExampleObject, isLoaded }}>
      {children}
    </BodyContext.Provider>
  );
};
