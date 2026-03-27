/**
 * authMiddleware.ts
 * Client-side authentication helpers.
 * Uses secureStorage (Keychain/Keystore) for token storage.
 */

import { secureGet, secureDelete } from '@/utils/secureStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

/** Returns true if a valid-looking token is present. */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await secureGet('token');
    return !!token;
  } catch {
    return false;
  }
};

/** Redirects to /login if the user is not authenticated. */
export const requireAuth = async (): Promise<boolean> => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    router.replace('/login');
    return false;
  }
  return true;
};

/** Redirects to the appropriate home screen if already authenticated. */
export const redirectIfAuthenticated = async (): Promise<boolean> => {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    try {
      const token = await secureGet('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role || 'student';
        switch (role) {
          case 'admin':
            router.replace('/(admin)' as any);
            break;
          case 'faculty':
            router.replace('/(faculty)' as any);
            break;
          default:
            router.replace('/(student)' as any);
        }
      }
    } catch {
      router.replace('/(student)' as any);
    }
    return true;
  }
  return false;
};

/** Clears all authentication data (secure storage + AsyncStorage fallback keys). */
export const clearAuthData = async (): Promise<void> => {
  try {
    // Remove from secure store
    await secureDelete('token');

    // Also sweep any AsyncStorage keys left from older app versions
    const keys = await AsyncStorage.getAllKeys();
    const authKeys = keys.filter(
      k => k.includes('token') || k.includes('user') || k.includes('auth') || k === 'lastLogin'
    );
    if (authKeys.length > 0) {
      await AsyncStorage.multiRemove(authKeys);
    }
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

export default { isAuthenticated, requireAuth, redirectIfAuthenticated, clearAuthData };