import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { User, FileText, Calendar, History, TrendingUp } from 'lucide-react-native';

export default function FacultyLayout() {
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
        name="approvals"
        options={{
          title: 'Approvals',
          tabBarIcon: ({ size, color }) => (
            <FileText size={size} color={color} />
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
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ size, color }) => (
            <History size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="student-progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Hide from tabs - accessed through settings
        }}
      />
      <Tabs.Screen
        name="profile-photo"
        options={{
          href: null, // Hide from tabs - accessed through settings
        }}
      />
      <Tabs.Screen
        name="change-password"
        options={{
          href: null, // Hide from tabs - accessed through settings
        }}
      />
      <Tabs.Screen
        name="terms-conditions"
        options={{
          href: null, // Hide from tabs - accessed through settings
        }}
      />
      <Tabs.Screen
        name="raise-query"
        options={{
          href: null, // Hide from tabs - accessed through settings
        }}
      />
      <Tabs.Screen
        name="help-support"
        options={{
          href: null, // Hide from tabs - accessed through settings
        }}
      />
      <Tabs.Screen
        name="dashboard"
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
        name="settings"
        options={{
          href: null, // Hide from tabs
        }}
      />

    </Tabs>
  );
}