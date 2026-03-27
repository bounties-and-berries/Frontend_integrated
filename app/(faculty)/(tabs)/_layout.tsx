import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { FileText, Calendar, LayoutDashboard, BarChart3 } from 'lucide-react-native';
import { useResponsive } from '@/hooks/useResponsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FacultyTabsLayout() {
  const { theme } = useTheme();
  const { isMobile, width } = useResponsive();
  const insets = useSafeAreaInsets();

  const isWide = width > 768;
  const tabHeight = isMobile ? (70 + insets.bottom) : 80;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
          elevation: isWide ? 8 : 0,
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
          title: 'Events',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Progress',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}