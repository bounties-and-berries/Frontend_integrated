import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, Faculty, Admin } from '@/types';
import { mockUsers } from '@/data/mockData';
import { jwtDecode } from 'jwt-decode';
import { loginApi, getUserAvailableBerries } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  refreshUserBerries: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const login = async (name: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await loginApi(name, password, role);
      const { token } = data;
      // Store token using AsyncStorage for React Native
      await AsyncStorage.setItem('token', token);
      // Decode token to get user info
      const decoded: any = jwtDecode(token);
      
      // For students, fetch the correct available berries
      let totalPoints = 0;
      if (decoded.role === 'student') {
        try {
          const berriesData = await getUserAvailableBerries();
          totalPoints = berriesData.availableBerries || 0;
        } catch (error) {
          console.warn('Failed to fetch available berries, using default value');
          totalPoints = 0;
        }
      }
      
      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email || '', // TODO: fetch user profile for full info
        role: decoded.role,
        createdAt: '', // TODO: fetch user profile for full info
        ...(decoded.role === 'student' && { totalPoints }),
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const refreshUserBerries = async () => {
    if (user?.role === 'student') {
      try {
        const berriesData = await getUserAvailableBerries();
        const availableBerries = berriesData.availableBerries || 0;
        setUser(prev => prev ? { ...prev, totalPoints: availableBerries } : null);
      } catch (error) {
        console.warn('Failed to refresh user berries');
      }
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUserBerries }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}