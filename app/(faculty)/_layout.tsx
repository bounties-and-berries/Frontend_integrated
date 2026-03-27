import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

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
      <Stack.Screen name="create-event" />
      <Stack.Screen name="review-bounty" />
      <Stack.Screen name="review-student-request" />
      <Stack.Screen name="raise-query" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}