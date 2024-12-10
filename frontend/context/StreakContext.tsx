import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { GlobalContext } from './GlobalContext';
import { httpRequests } from '@/api/httpRequests';

interface StreakData {
  id: number;
  currentSt: number;
  prevLogin: string;
}

interface StreakContextProps {
  streak: number;
  loading: boolean;
  error: string | null;
  refreshStreak: () => Promise<void>;
}

const StreakContext = createContext<StreakContextProps | undefined>(undefined);

interface StreakProviderProps {
  children: ReactNode;
}

export const StreakProvider: React.FC<StreakProviderProps> = ({ children }) => {
  const context = useContext(GlobalContext);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStreak = async () => {
    const token = context?.data.token;
    //context.setToken("");
    setLoading(true);
    setError(null);
    console.log("Fetching Streak ree")

    if (!token) {
      setStreak(0);
      setLoading(false);
      return;
    }

    try {
      //const data: StreakData = await httpRequests.put('/streak/updateStreak', token, {});
      const workoutResponse = await fetch(
        `${httpRequests.getBaseURL()}/streak/updateStreak`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context?.data.token}`,
          },
          body: '',
        });
      const data = await workoutResponse.json()
      setStreak(data.currentSt);
    } catch (err) {
      console.error('Error fetching streak:', err);
      console.error('Full error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError('Failed to fetch streak. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshStreak = async () => {
    await fetchStreak();
  };

  useEffect(() => {
    fetchStreak().catch((err) => {
      console.error('Unhandled error in fetchStreak:', err);
      setError('Failed to fetch streak. Please try again.');
    });
  }, [context?.data.token]);

  const value = {
    streak,
    loading,
    error,
    refreshStreak,
  };

  return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>;
};

export const useStreak = (): StreakContextProps => {
  const context = useContext(StreakContext);
  if (context === undefined) {
    throw new Error('useStreak must be used within a StreakProvider');
  }
  return context;
};

export default StreakContext;