import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      console.log('AuthContext - Loading user from storage...');
      const userJson = await storage.getItem('user');
      if (userJson) {
        const userData = JSON.parse(userJson);
        console.log('AuthContext - User loaded:', userData._id);
        setUser(userData);
      } else {
        console.log('AuthContext - No user found in storage');
      }
    } catch (error) {
      console.error('AuthContext - Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User) => {
    try {
      console.log('AuthContext - Saving user:', userData._id);
      await storage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      console.log('AuthContext - User saved successfully');
    } catch (error) {
      console.error('AuthContext - Error saving user:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext - Logging out user');
      await storage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('AuthContext - Error logging out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
