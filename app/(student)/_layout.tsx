import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { LayoutDashboard, Gift, Calendar, Trophy } from 'lucide-react-native';
import { useResponsive } from '@/hooks/useResponsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StudentLayout() {
  const { theme } = useTheme();
  const { isMobile, width } = useResponsive();
  const insets = useSafeAreaInsets();

  const isWide = width > 768;
  const tabHeight = isMobile ? 65 + insets.bottom : 75;

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
          paddingBottom: isMobile ? (insets.bottom || 10) : 10,
          paddingTop: 10,
          height: tabHeight,
          position: isWide ? 'absolute' : 'relative',
          bottom: isWide ? 20 : 0,
          width: isWide ? Math.min(width * 0.7, 700) : '100%',
          alignSelf: 'center',
          borderRadius: isWide ? 35 : 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: isWide ? 10 : 0,
          borderWidth: isWide ? 1 : 0,
          borderColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: isWide ? 12 : 10,
          fontFamily: 'Inter-Medium',
          marginTop: 2,
        },
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
        name="events"
        options={{
          title: 'Bounties',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ size, color }) => (
            <Gift size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="myrewards"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="request-points"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="claim-history"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="raise-query"
        options={{
          href: null, // Hide from tabs
        }}
      />
    </Tabs>
  );
}