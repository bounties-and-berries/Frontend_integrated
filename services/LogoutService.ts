/**
 * Logout Service - A completely different approach to handle logout
 * This service provides multiple fallback methods to ensure logout always works
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { clearAuthData } from '@/utils/authMiddleware';

class LogoutService {
  private static instance: LogoutService;
  
  private constructor() {}
  
  static getInstance(): LogoutService {
    if (!LogoutService.instance) {
      LogoutService.instance = new LogoutService();
    }
    return LogoutService.instance;
  }
  
  /**
   * Complete logout process with multiple fallback methods
   */
  async logout(): Promise<boolean> {
    try {
      console.log('Starting logout process...');
      // Step 1: Clear all auth-related data using the middleware
      await clearAuthData();
      
      // Step 2: Notify any listeners that logout occurred
      this.notifyLogout();
      
      // Step 3: Redirect to login using the most reliable method
      const success = await this.redirectToLogin();
      console.log('Logout process completed with success:', success);
      return success;
    } catch (error) {
      console.error('LogoutService logout error:', error);
      // Even if there's an error, try to navigate to login
      try {
        await this.redirectToLogin();
        return true;
      } catch (navError) {
        console.error('Navigation after logout error:', navError);
        return false;
      }
    }
  }
  
  /**
   * Notify any listeners about logout
   */
  private notifyLogout(): void {
    try {
      console.log('Notifying logout event...');
      // Dispatch a custom event that other parts of the app can listen to
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
      }
    } catch (error) {
      console.error('Error dispatching logout event:', error);
    }
  }
  
  /**
   * Redirect to login with multiple fallback methods
   */
  private async redirectToLogin(): Promise<boolean> {
    console.log('Attempting to redirect to login...');
    
    // Add a small delay to ensure all async operations complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Method 1: Try to use the expo-router (imported directly)
    try {
      console.log('Trying router.replace...');
      if (router && router.replace) {
        router.replace('/login');
        console.log('router.replace successful');
        return true;
      }
    } catch (error) {
      console.warn('Method 1 (expo-router.replace) failed:', error);
    }
    
    // Method 2: Try push method
    try {
      console.log('Trying router.push...');
      if (router && router.push) {
        router.push('/login');
        console.log('router.push successful');
        return true;
      }
    } catch (error) {
      console.warn('Method 2 (expo-router.push) failed:', error);
    }
    
    // Method 3: Try navigate method
    try {
      console.log('Trying router.navigate...');
      if (router && router.navigate) {
        router.navigate('/login');
        console.log('router.navigate successful');
        return true;
      }
    } catch (error) {
      console.warn('Method 3 (expo-router.navigate) failed:', error);
    }
    
    // Method 4: Try dismiss all and then navigate
    try {
      console.log('Trying router.dismissAll...');
      if (router && router.dismissAll) {
        router.dismissAll();
        // Small delay to ensure dismissal is complete
        await new Promise(resolve => setTimeout(resolve, 100));
        router.replace('/login');
        console.log('router.dismissAll + replace successful');
        return true;
      }
    } catch (error) {
      console.warn('Method 4 (router.dismissAll) failed:', error);
    }
    
    // Method 5: Try to reload the app (this will restart the app and should go to login)
    try {
      console.log('Trying window.location.reload...');
      if (typeof window !== 'undefined' && window.location && window.location.reload) {
        window.location.reload();
        console.log('window.location.reload successful');
        return true;
      }
    } catch (error) {
      console.warn('Method 5 (window.location.reload) failed:', error);
    }
    
    // Method 6: Try window.location.href
    try {
      console.log('Trying window.location.href...');
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/login';
        console.log('window.location.href successful');
        return true;
      }
    } catch (error) {
      console.warn('Method 6 (window.location.href) failed:', error);
    }
    
    // Method 7: Last resort - manual navigation with full path
    try {
      console.log('Trying full path navigation...');
      if (router && router.replace) {
        router.replace('/login');
        console.log('Full path navigation successful');
        return true;
      }
    } catch (error) {
      console.warn('Method 7 (full path navigation) failed:', error);
    }
    
    // Method 8: Final fallback - throw an error to be caught by the calling function
    console.error('All logout redirect methods failed');
    throw new Error('Unable to redirect to login page after logout');
  }
  
  /**
   * Check if user is currently authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }
}

// Export singleton instance
export default LogoutService.getInstance();

// Also export as named export for convenience
export const logoutService = LogoutService.getInstance();