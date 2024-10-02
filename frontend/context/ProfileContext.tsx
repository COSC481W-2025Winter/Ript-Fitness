// ContactsContext.tsx
import React, { createContext, useState, ReactNode } from 'react';


// Define this at the top of your file or in a separate types file
export interface ProfileObjectsToPass {
    id: string;
    name: string;
    title: string;
    employer: string;
    // ... other fields
  }
  


interface ProfileContextType {
  exampleObject: ProfileObjectsToPass[];
  updateExampleObject: (newExampleObject: ProfileObjectsToPass) => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
    //Creating an array here, feel free to make it whatever you want though.
  //Pretty sure this would usually be an API call unless we hardcode default profile image.
  const [exampleObject, setExampleObject] = useState<ProfileObjectsToPass[]>([
     { id: '1', name: 'Alice Smith', title: 'Engineer', employer: 'Tech Corp' },
     { id: '2', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
     { id: '3', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
     { id: '4', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
     { id: '5', name: 'Bob Johnson', title: 'Designer', employer: 'Design Studio' },
  ]);

  const updateExampleObject = (newExampleObject: ProfileObjectsToPass) => {
    console.log(newExampleObject)
    setExampleObject(previousObject =>
      previousObject.map(exampleObject =>
        exampleObject.id === newExampleObject.id ? newExampleObject : exampleObject
      )
    );
  };

  return (
    <ProfileContext.Provider value={{ exampleObject, updateExampleObject }}>
      {children}
    </ProfileContext.Provider>
  );
};
