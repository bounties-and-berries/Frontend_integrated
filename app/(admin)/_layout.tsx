import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Users, ChartBar as BarChart3, Calendar } from 'lucide-react-native';

export default function AdminLayout() {
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
            <User size={size} color={color} />
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
        name="events"
        options={{
          title: 'Bounties',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
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
        name="rules"
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
        name="request-berries"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="add-user"
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
        name="create-bounty"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="bounty-details"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="user-details"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="create-rule"
        options={{
          href: null, // Hide from tabs
        }}
      />
    </Tabs>
  );
}