import { Stack, Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { User, FileText, Calendar } from 'lucide-react-native';

export default function FacultyLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 350,
        animationTypeForReplace: 'push',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      {/* Main tab navigation for primary sections */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Stack pages that slide in from right */}
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="student-progress" />
      <Stack.Screen name="create-event" />
    </Stack>
  );
}