import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Admin } from '@/types';
import { getAdminProfile, updateAdminProfile } from '@/utils/api';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Users } from 'lucide-react-native';
import { useResponsive } from '@/hooks/useResponsive';

export default function AdminProfile() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const admin = user as Admin;
  const { isMobile } = useResponsive();

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    collegeName: admin?.collegeName || '',
  });

  const styles = getStyles(theme, isMobile);

  const handleSaveProfile = async () => {
    if (!profileData.name || !profileData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        collegeName: profileData.collegeName || undefined,
      };

      await updateAdminProfile(updateData);

      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhoto = () => {
    router.push('/profile-photo');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar
        title="Admin Profile"
        subtitle="Manage your profile information"
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo Section */}
        <View style={styles.section}>
          <AnimatedCard style={styles.photoCard}>
            <View style={styles.photoContent}>
              <Image
                source={admin?.profileImage ? { uri: admin.profileImage } : require('@/assets/images/default-avatar.png')}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: theme.colors.primary + '20' }]}
                onPress={handleUploadPhoto}
              >
                <Users size={20} color={theme.colors.primary} />
                <Text style={[styles.uploadButtonText, { color: theme.colors.primary }]}>
                  Change Photo
                </Text>
              </TouchableOpacity>
            </View>
          </AnimatedCard>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Profile Information
          </Text>

          <AnimatedCard style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Full Name *
              </Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }]}
                placeholder="Enter full name"
                placeholderTextColor={theme.colors.textSecondary}
                value={profileData.name}
                onChangeText={(text) => setProfileData({ ...profileData, name: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Email Address *
              </Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }]}
                placeholder="Enter email address"
                placeholderTextColor={theme.colors.textSecondary}
                value={profileData.email}
                onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                College Name
              </Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }]}
                placeholder="Enter college name"
                placeholderTextColor={theme.colors.textSecondary}
                value={profileData.collegeName}
                onChangeText={(text) => setProfileData({ ...profileData, collegeName: text })}
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSaveProfile}
              disabled={loading}
            >
              <Users size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>
                {loading ? 'Saving...' : 'Save Profile'}
              </Text>
            </TouchableOpacity>
          </AnimatedCard>
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any, isMobile: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  photoCard: {
    padding: 20,
  },
  photoContent: {
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.border,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  formCard: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 44,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 10,
    minHeight: 44,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});