import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Bell, Menu } from 'lucide-react-native';

interface CommonHeaderProps {
  title: string;
  subtitle?: string;
  showNotifications?: boolean;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
}

export default function CommonHeader({ 
  title, 
  subtitle, 
  showNotifications = true,
  onMenuPress,
  onNotificationPress 
}: CommonHeaderProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      // Default notification navigation based on role
      switch (user?.role) {
        case 'student':
          router.push('/(student)/notifications' as any);
          break;
        case 'faculty':
          router.push('/(faculty)/notifications' as any);
          break;
        case 'admin':
          router.push('/(admin)/notifications' as any);
          break;
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
        
        <View style={styles.headerActions}>
          {showNotifications && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
              onPress={handleNotificationPress}
              activeOpacity={0.7}
            >
              <Bell size={20} color={theme.colors.text} />
            </TouchableOpacity>
          )}
          
          {onMenuPress && (
            <TouchableOpacity
              style={[styles.menuButton, { backgroundColor: theme.colors.card }]}
              onPress={onMenuPress}
              activeOpacity={0.7}
            >
              <Menu size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});