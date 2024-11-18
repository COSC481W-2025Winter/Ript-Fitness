// ContactsContext.tsx
import React, { createContext, useState, ReactNode } from 'react';


// Define this at the top of your file or in a separate types file
export interface ProfileObjectsToPass {
    id: string,
    firstName: string,
    lastName: string,
    username: string,
    prs: [],
    isDeleted: false
  }
  


interface ProfileContextType {
  userProfile: ProfileObjectsToPass;
  updateUserProfile: (newExampleObject: ProfileObjectsToPass) => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
    //Creating an array here, feel free to make it whatever you want though.
  //Pretty sure this would usually be an API call unless we hardcode default profile image.
  const [myUserProfile, setMyUserProfile] = useState<ProfileObjectsToPass>(
     { id: '1', firstName: 'myFirstName', lastName: 'myLastName', username: 'myUserName', prs: [], isDeleted: false });

  const updateExampleObject = (newExampleObject: ProfileObjectsToPass) => {
    setMyUserProfile(newExampleObject);
  };


  return (
    <ProfileContext.Provider value={{ userProfile: myUserProfile, updateUserProfile: updateExampleObject }}>
      {children}
    </ProfileContext.Provider>
  );
};
