import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Student } from '@/types';
import { updateProfileImage, updateUserProfile } from '@/utils/api';
import * as ImagePicker from 'expo-image-picker';
import AnimatedCard from '@/components/AnimatedCard';
import { Users, Lock, Bell, HelpCircle, FileText, MessageSquare, Camera, LogOut, ChevronRight } from 'lucide-react-native';

export default function StudentSettings() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const student = user as Student;

  const [notificationsEnabled, setNotificationsEnabled] = useState(student?.push_notifications_enabled ?? true);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      if (user) {
        await updateUserProfile(user.id, { push_notifications_enabled: value });
      }
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      Alert.alert('Error', 'Failed to save notification settings');
      setNotificationsEnabled(!value);
    }
  };

  const handleLogout = async () => {
    console.log('🟢 Student handleLogout called');

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        console.log('🟢 Logout confirmed, calling logout function...');
        try {
          await logout();
          console.log('✅ Logout function completed');
        } catch (error: any) {
          console.error('❌ Error during logout:', error);
          window.alert('Failed to logout: ' + error.message);
        }
      } else {
        console.log('❌ Logout cancelled');
      }
      return;
    }

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('❌ Logout cancelled')
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            console.log('🟢 Logout confirmed, calling logout function...');
            try {
              await logout();
              console.log('✅ Logout function completed');
            } catch (error: any) {
              console.error('❌ Error during logout:', error);
              Alert.alert('Error', 'Failed to logout: ' + error.message);
            }
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  const handleRaiseQuery = () => {
    router.push('/(student)/raise-query');
  };

  const handleUploadPhoto = async () => {
    router.push('/profile-photo');
  };

  const settingsOptions = [
    {
      id: 'profile',
      title: 'Profile Photo',
      subtitle: isUploadingPhoto ? 'Uploading...' : 'Change your profile picture',
      icon: Camera,
      onPress: handleUploadPhoto,
      loading: isUploadingPhoto,
    },
    {
      id: 'password',
      title: 'Change Password',
      subtitle: 'Update your account password',
      icon: Lock,
      onPress: handleChangePassword,
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      subtitle: 'Read our terms and conditions',
      icon: FileText,
      onPress: () => router.push('/terms'),
    },
    {
      id: 'query',
      title: 'Raise Query',
      subtitle: 'Contact faculty, college, or app support',
      icon: MessageSquare,
      onPress: handleRaiseQuery,
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help with using the app',
      icon: HelpCircle,
      onPress: () => router.push('/help'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Manage your account and preferences
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <AnimatedCard
            style={styles.profileCard}
            onPress={() => router.push('/(student)/profile')}
          >
            <View style={styles.profileContent}>
              <Image
                source={student?.profileImage ? { uri: student.profileImage } : require('@/assets/images/default-avatar.png')}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.colors.text }]}>
                  {student?.name}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
                  {student?.email}
                </Text>
                <Text style={[styles.profileDepartment, { color: theme.colors.textSecondary }]}>
                  {student?.department} • Year {student?.year}
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </View>
          </AnimatedCard>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Preferences
          </Text>

          <AnimatedCard style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={styles.settingInfo}>
                <View style={[styles.settingIcon, { backgroundColor: theme.colors.accent + '20' }]}>
                  <Bell size={20} color={theme.colors.accent} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                    Push Notifications
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                    Receive notifications for updates
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : theme.colors.surface}
              />
            </View>
          </AnimatedCard>
        </View>

        {/* Settings Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Account
          </Text>

          {settingsOptions.map((option) => (
            <AnimatedCard
              key={option.id}
              style={styles.settingCard}
              onPress={option.loading ? undefined : option.onPress}
            >
              <View style={styles.settingContent}>
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
                    {option.loading ? (
                      <ActivityIndicator size={20} color={theme.colors.secondary} />
                    ) : (
                      <option.icon size={20} color={theme.colors.secondary} />
                    )}
                  </View>
                  <View>
                    <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                      {option.title}
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                      {option.subtitle}
                    </Text>
                  </View>
                </View>
                {!option.loading && (
                  <ChevronRight size={20} color={theme.colors.textSecondary} />
                )}
              </View>
            </AnimatedCard>
          ))}
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <AnimatedCard style={styles.logoutCard} onPress={handleLogout}>
            <View style={styles.logoutContent}>
              <View style={[styles.settingIcon, { backgroundColor: theme.colors.error + '20' }]}>
                <LogOut size={20} color={theme.colors.error} />
              </View>
              <Text style={[styles.logoutText, { color: theme.colors.error }]}>
                Logout
              </Text>
            </View>
          </AnimatedCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  profileCard: {
    marginBottom: 0,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  profileDepartment: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  settingCard: {
    marginBottom: 12,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  logoutCard: {
    marginBottom: 0,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});