import { httpRequests } from '@/api/httpRequests';
import React, { createContext, useState, ReactNode, useContext } from 'react';
import { GlobalContext } from './GlobalContext';


// Define RequestingFriend type
export interface RequestingFriend {
  id: string,
  firstName: string,
  lastName: string,
  username: string,
  displayname: string,
  bio: string,
  profilePicture: string,
  isDeleted: false,
  restDays: number,
  restDaysLeft: number,
  restResetDate: string,
  restRestDayOfWeek: number,
}

interface ProfileContextType {
  requestingFriends: RequestingFriend[];
  requestsOpen: boolean;
  setRequestsOpen: (isOpen: boolean) => void;
  reloadFriendRequests: () => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {

  const context = useContext(GlobalContext)

  const [loadedRequests, setLoadedRequests] = useState(false)
  const [loadingRequests, setLoadingRequests] = useState(false)


  const defaultUserProfile: RequestingFriend = {
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    displayname: '',
    bio: '',
    profilePicture: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAABU0lEQVR4nO3WP4+CMBgG8BdaXBr/JZCaMOjCon7/T+FkMIaQoAmUGGCSaAik7Q3kOI+cRCdveN+ptDzPr2ON3W4HnxjzIyrCCCOMMMIII/xf4aZpfN9vmgYAhBD7/T4IgqqqXmx8jA809GGlVBzHhBAAKMvyfr9vNhvOeZIkr6iP8eGGPpwkCeecUgoAt9ttPp8TQmazWV3XWuv2n6IoTqcTAJzP5zzPn8UHGvpwlmWMMcZY+yml7CpM01RKtWvbtrXWURQppRzHeRYfaAAA+ggXRVHXdRzHAHA4HBaLhZSyqzDNn1tyzsMw9DxvIL7dbgkhzxp+wev1ul2EYbharaqqulwu0+m0LMvRaGQYRnuqtRZCuK4rhPA8r9vvxSmljLE/G/pwb8bj8fV6PR6PlmUtl8tuP03TyWTiOI6UMk1T13XfbQAAAx/0CCOMMMIII/w9XxQt4FPrpYzlAAAAAElFTkSuQmCC",
    isDeleted: false,
    restDays: 0,
    restDaysLeft: 0,
    restResetDate: '',
    restRestDayOfWeek: 0,
  };


  const updateFriendRequests = (newProfiles: RequestingFriend[]) => {
    setRequestingFriends(newProfiles)
    /*setRequestingFriends((prevProfiles) => {
      // Create a map for new profiles based on their IDs
      const newProfilesMap = new Map(newProfiles.map((profile) => [profile.id, profile]));
  
      // Update existing profiles or add new ones
      const updatedProfiles = prevProfiles.map((profile) =>
        newProfilesMap.has(profile.id)
          ? {
              ...profile,
              ...newProfilesMap.get(profile.id),
              profilePicture:
                newProfilesMap.get(profile.id)?.profilePicture || profile.profilePicture,
            }
          : profile
      );
  
      // Add any new profiles that don't already exist in prevProfiles
      newProfiles.forEach((profile) => {
        if (!prevProfiles.some((prevProfile) => prevProfile.id === profile.id)) {
          updatedProfiles.push(profile);
        }
      });
  
      return updatedProfiles;
    });*/
  };
  

  const [requestingFriends, setRequestingFriends] = useState<RequestingFriend[]>([]);

  const [requestsOpen, setRequestsOpen] = useState(false);

  const fetchFriendRequests = async () => {
    let friendList;
    try {
    setLoadingRequests(true)
    const response = await fetch(`${httpRequests.getBaseURL()}/friendRequest/getAllAccountsWithSpecificStatus/PENDING`, {
      method: 'GET', // Set method to POST
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
        "Authorization": `Bearer ${context?.data.token}`,
      },
      body: "", // Convert the data to a JSON string
    }); // Use endpoint or replace with BASE_URL if needed
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    friendList = await response.json()

  } catch (error) {
    // If access denied
    // Send to login page
    //context?.setToken("")
    console.error('0013 GET request failed:', error);
    throw error; // Throw the error for further handling if needed
  }

  try {
    const response = await fetch(`${httpRequests.getBaseURL()}/userProfile/getUserProfilesFromList`, {
      method: 'POST', // Set method to POST
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
        "Authorization": `Bearer ${context?.data.token}`,
      },
      body: JSON.stringify(friendList), // Convert the data to a JSON string
    }); // Use endpoint or replace with BASE_URL if needed
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json()

    updateFriendRequests(json)
  } catch (error) {
    // If access denied
    // Send to login page
    //context?.setToken("")
    console.error('0012 GET request failed:', error);
    throw error; // Throw the error for further handling if needed
  } finally {
    setLoadedRequests(true)
    setLoadingRequests(false)
  }
  }
  const reloadFriendRequests = () => {
    console.log(!loadingRequests)
    if (!loadingRequests) {
      fetchFriendRequests();
    }
}

  return (
    <ProfileContext.Provider
      value={{
        requestingFriends,
        requestsOpen,
        setRequestsOpen,
        reloadFriendRequests
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
