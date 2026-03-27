/**
 * secureStorage.ts
 *
 * A secure wrapper around expo-secure-store (iOS Keychain / Android Keystore)
 * with AsyncStorage as a graceful fallback for web platform where
 * expo-secure-store is not supported.
 *
 * Usage:
 *   import { secureGet, secureSet, secureDelete } from '@/utils/secureStorage';
 *   await secureSet('token', jwt);
 *   const token = await secureGet('token');
 *   await secureDelete('token');
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lazy-load SecureStore so web builds don't error
let SecureStore: typeof import('expo-secure-store') | null = null;
if (Platform.OS !== 'web') {
    try {
        SecureStore = require('expo-secure-store');
    } catch {
        // expo-secure-store not available; fall back to AsyncStorage
        SecureStore = null;
    }
}

/** Store a value securely. */
export async function secureSet(key: string, value: string): Promise<void> {
    if (SecureStore) {
        await SecureStore.setItemAsync(key, value, {
            keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
    } else {
        await AsyncStorage.setItem(key, value);
    }
}

/** Retrieve a securely stored value. Returns null if not found. */
export async function secureGet(key: string): Promise<string | null> {
    if (SecureStore) {
        return await SecureStore.getItemAsync(key);
    }
    return await AsyncStorage.getItem(key);
}

/** Delete a securely stored value. */
export async function secureDelete(key: string): Promise<void> {
    if (SecureStore) {
        await SecureStore.deleteItemAsync(key);
    } else {
        await AsyncStorage.removeItem(key);
    }
}
