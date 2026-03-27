import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { jwtDecode } from 'jwt-decode';
import { loginApi, logoutApi, fetchCurrentUser, BASE_URL } from '@/utils/api';
import { secureGet, secureSet, secureDelete } from '@/utils/secureStorage';
import { clearAuthData } from '@/utils/authMiddleware';
import { router } from 'expo-router';
import { Alert, Platform } from 'react-native';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from secure storage on app start
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const token = await secureGet('token');
      if (token) {
        const decoded: any = jwtDecode(token);
        
        // Initial user state from token
        const initialUser: User = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email || '',
          role: decoded.role,
          createdAt: '',
        };
        setUser(initialUser);

        // Fetch full profile (including image) from backend
        try {
          const result = await fetchCurrentUser();
          const userData = result.data || result;
          const imgUrl = userData.img_url
            ? (userData.img_url.startsWith('http') 
              ? userData.img_url 
              : `${BASE_URL}${userData.img_url.split('/').map((s: string) => encodeURIComponent(s)).join('/')}?t=${Date.now()}`)
            : undefined;
          
          setUser(prev => prev ? {
            ...prev,
            name: userData.name || prev.name,
            email: userData.email || prev.email,
            profileImage: imgUrl,
          } : null);
        } catch {
          // Profile fetch failed; token data is still useful
        }
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      await secureDelete('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await loginApi(username, password, role);
      const { token } = data;

      await secureSet('token', token);
      const decoded: any = jwtDecode(token);

      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email || '',
        role: decoded.role,
        createdAt: '',
      });
      
      // Fetch full profile info
      await refreshUser();
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      throw error; // Throw the actual error so UI can display specific message
    }
  };

  const refreshUser = async () => {
    try {
      const result = await fetchCurrentUser();
      const userData = result.data || result;
      const imgUrl = userData.img_url 
        ? (userData.img_url.startsWith('http') 
          ? userData.img_url 
          : `${BASE_URL}${userData.img_url.split('/').map((s: string) => encodeURIComponent(s)).join('/')}?t=${Date.now()}`)
        : undefined;
      
      setUser(prev => prev ? {
        ...prev,
        name: userData.name || prev.name,
        email: userData.email || prev.email,
        profileImage: imgUrl,
      } : null);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      try {
        await logoutApi();
      } catch {
        // Advisory
      }
      await clearAuthData();
      setUser(null);
      router.replace('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      if (Platform.OS === 'web') {
        window.alert('Logout failed: ' + error.message);
      } else {
        Alert.alert('Error', 'Logout failed: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}