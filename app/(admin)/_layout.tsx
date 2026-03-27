import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Users, BarChart3, Award, LayoutDashboard } from 'lucide-react-native';
import { useResponsive } from '@/hooks/useResponsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminLayout() {
  const { theme } = useTheme();
  const { isMobile, width } = useResponsive();
  const insets = useSafeAreaInsets();

  const isWide = width > 768;
  const tabHeight = isMobile ? (70 + insets.bottom) : 80;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopWidth: isWide ? 0 : 1,
          borderTopColor: theme.colors.border,
          paddingBottom: isMobile ? (insets.bottom > 0 ? insets.bottom : 10) : 10,
          paddingTop: 10,
          height: tabHeight,
          position: isWide ? 'absolute' : 'relative',
          bottom: isWide ? 20 : 0,
          width: isWide ? Math.min(width * 0.7, 700) : '100%',
          alignSelf: 'center',
          borderRadius: isWide ? 35 : 0,
          borderWidth: isWide ? 1 : 0,
          borderColor: theme.colors.border,
          elevation: isWide ? 8 : 0, // Simplified shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isWide ? 0.1 : 0,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter-Medium',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <LayoutDashboard size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="purchase-berries"
        options={{
          title: 'Berries',
          tabBarIcon: ({ size, color }) => (
            <Award size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rules"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="add-user"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="user-details"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="create-rule"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="test-logout"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="terms"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="raise-query"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="edit-user"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="edit-rule"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}