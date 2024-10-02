// ContactsContext.tsx
import React, { createContext, useState, ReactNode } from 'react';


// Define this at the top of your file or in a separate types file
export interface SocialObjectsToPass {
    id: string;
    name: string;
    title: string;
    employer: string;
    // ... other fields
  }
  


interface SocialContextType {
  exampleObject: SocialObjectsToPass[];
  updateExampleObject: (newExampleObject: SocialObjectsToPass) => void;
}

export const SocialContext = createContext<SocialContextType | undefined>(undefined);

interface SocialProviderProps {
  children: ReactNode;
}

export const SocialProvider: React.FC<SocialProviderProps> = ({ children }) => {
  //Creating an array here, feel free to make it whatever you want though.
  //Pretty sure this would usually be an API call unless we hardcode... maybe a default user profile picture?
  const [exampleObject, setExampleObject] = useState<SocialObjectsToPass[]>([
     { id: '1', name: 'Alice Smith', title: 'Engineer', employer: 'Tech Corp' },
     { id: '2', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
     { id: '3', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
     { id: '4', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
     { id: '5', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
  ]);

  const updateExampleObject = (newExampleObject: SocialObjectsToPass) => {
    console.log(newExampleObject)
    setExampleObject(previousObject =>
      previousObject.map(exampleObject =>
        exampleObject.id === newExampleObject.id ? newExampleObject : exampleObject
      )
    );
  };

  return (
    <SocialContext.Provider value={{ exampleObject, updateExampleObject }}>
      {children}
    </SocialContext.Provider>
  );
};
