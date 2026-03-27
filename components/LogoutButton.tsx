import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface LogoutButtonProps {
  style?: object;
  textStyle?: object;
  showIcon?: boolean;
  onLogoutSuccess?: () => void;
  onLogoutError?: (error: any) => void;
}

export default function LogoutButton({
  style,
  textStyle,
  showIcon = true,
  onLogoutSuccess,
  onLogoutError,
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const { theme } = useTheme();

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        try {
          await logout();
          if (onLogoutSuccess) onLogoutSuccess();
        } catch (error) {
          console.error('Logout error:', error);
          if (onLogoutError) onLogoutError(error);
          else window.alert('Failed to logout');
        }
      }
      return;
    }

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              if (onLogoutSuccess) {
                onLogoutSuccess();
              }
            } catch (error) {
              console.error('Logout error:', error);
              if (onLogoutError) {
                onLogoutError(error);
              }
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handleLogout}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: theme.colors.error }, textStyle]}>
        Logout
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});