import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

/**
 * Complete logout utility that clears all auth data and redirects to login
 * This is a more robust approach that ensures proper session termination
 */
export const performLogout = async (): Promise<void> => {
  try {
    // Step 1: Clear all authentication-related data from storage
    const keys = await AsyncStorage.getAllKeys();
    const authKeys = keys.filter(key => 
      key.startsWith('user') || 
      key.startsWith('session') || 
      key.startsWith('auth') ||
      key.startsWith('token') ||
      key === 'lastLogin' ||
      key === 'theme'
    );
    
    if (authKeys.length > 0) {
      await AsyncStorage.multiRemove(authKeys);
    }
    
    // Step 2: Clear the main auth token specifically
    await AsyncStorage.removeItem('token');
    
    // Step 3: Add a small delay to ensure all async operations complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Step 4: Navigate to login screen using a simpler approach
    // First try router.replace
    try {
      router.replace('/login');
    } catch (navError) {
      console.warn('router.replace failed, trying alternative navigation');
      // If that fails, try router.push
      try {
        router.push('/login');
      } catch (pushError) {
        console.error('Both router.replace and router.push failed:', pushError);
        // Last resort: reload the app
        window.location.href = '/login';
      }
    }
    
  } catch (error) {
    console.error('Error during logout:', error);
    // Even if there's an error, still try to navigate to login
    try {
      router.replace('/login');
    } catch (navError) {
      console.error('Error during navigation after logout:', navError);
      // Last resort
      window.location.href = '/login';
    }
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

/**
 * Get the current auth token
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};