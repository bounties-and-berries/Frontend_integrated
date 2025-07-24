import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Admin } from '@/types';
import AnimatedCard from '@/components/AnimatedCard';
import { User, Lock, Bell, CircleHelp as HelpCircle, FileText, MessageSquare, Camera, Moon, Sun, LogOut, ChevronRight } from 'lucide-react-native';

export default function AdminSettings() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const admin = user as Admin;
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This feature will be available soon.');
  };

  const handleRaiseQuery = () => {
    Alert.alert('Raise Query', 'This feature will be available soon.');
  };

  const handleUploadPhoto = () => {
    Alert.alert('Upload Photo', 'This feature will be available soon.');
  };

  const settingsOptions = [
    {
      id: 'profile',
      title: 'Profile Photo',
      subtitle: 'Change your profile picture',
      icon: Camera,
      onPress: handleUploadPhoto,
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
      onPress: () => Alert.alert('Terms & Conditions', 'This will open the terms page.'),
    },
    {
      id: 'query',
      title: 'Raise Query',
      subtitle: 'Contact app support',
      icon: MessageSquare,
      onPress: handleRaiseQuery,
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help with using the app',
      icon: HelpCircle,
      onPress: () => Alert.alert('Help & Support', 'This will open the help center.'),
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
          <AnimatedCard style={styles.profileCard}>
            <View style={styles.profileContent}>
              <Image
                source={{ uri: admin?.profileImage }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.colors.text }]}>
                  {admin?.name}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
                  {admin?.email}
                </Text>
                <Text style={[styles.profileCollege, { color: theme.colors.textSecondary }]}>
                  {admin?.collegeName}
                </Text>
              </View>
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
                <View style={[styles.settingIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  {isDark ? (
                    <Moon size={20} color={theme.colors.primary} />
                  ) : (
                    <Sun size={20} color={theme.colors.primary} />
                  )}
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                    Switch between light and dark theme
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={isDark ? '#FFFFFF' : theme.colors.surface}
              />
            </View>
          </AnimatedCard>

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
                onValueChange={setNotificationsEnabled}
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
              onPress={option.onPress}
            >
              <View style={styles.settingContent}>
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
                    <option.icon size={20} color={theme.colors.secondary} />
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
                <ChevronRight size={20} color={theme.colors.textSecondary} />
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
  profileCollege: {
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