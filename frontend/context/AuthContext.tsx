import { createContext, useContext, useState, ReactNode, isValidElement } from 'react';
import { View, Text } from 'react-native';

interface AuthContextType {
  token: string;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//chatGPT assisted with this
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState("");

  let safeChildren = children;
  if (typeof children === 'string' || typeof children === 'number') {
    safeChildren = <Text>{children}</Text>;
  } else if (!isValidElement(children) && Array.isArray(children)) {
    safeChildren = children.map((child, index) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return <Text key={index}>{child}</Text>;
      }
      return child;
    });
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {safeChildren}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
