import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Chrome as Home, Gift, Calendar, Trophy } from 'lucide-react-native';

export default function StudentLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter-Medium',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
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
        name="raise-query"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="help-support"
        options={{
          href: null, // Hide from tabs
        }}
      />
    </Tabs>
  );
}