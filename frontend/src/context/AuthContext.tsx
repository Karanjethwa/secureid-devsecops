import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi, userApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { identifier: string; password: string }) => Promise<User>;
  register: (payload: any) => Promise<string>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const data = await authApi.getSession();
      if (data.user) {
        // Fetch detailed profile with sdiId and stats
        const profileData = await userApi.getProfile();
        setUser(profileData.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { identifier: string; password: string }): Promise<User> => {
    const data = await authApi.login(credentials);
    const profileData = await userApi.getProfile();
    setUser(profileData.user);
    return profileData.user;
  };

  const register = async (payload: any): Promise<string> => {
    const res = await authApi.register(payload);
    return res.message;
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
