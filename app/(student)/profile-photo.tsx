import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Student } from '@/types';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Camera, Image as ImageIcon, Trash2, ArrowLeft, Check } from 'lucide-react-native';

export default function StudentProfilePhoto() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const student = user as Student;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleTakePhoto = () => {
    Alert.alert('Take Photo', 'Camera functionality will be implemented soon.');
  };

  const handleChoosePhoto = () => {
    Alert.alert('Choose Photo', 'Gallery functionality will be implemented soon.');
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setSelectedImage(null)
        }
      ]
    );
  };

  const handleSavePhoto = () => {
    if (selectedImage) {
      Alert.alert('Success', 'Profile photo updated successfully!');
      router.back();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="Profile Photo"
        subtitle="Update your profile picture"
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Photo Display */}
        <View style={styles.section}>
          <AnimatedCard style={styles.photoCard}>
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: selectedImage || student?.profileImage }}
                style={styles.profileImage}
                defaultSource={{ uri: 'https://via.placeholder.com/150' }}
              />
              {selectedImage && (
                <View style={styles.photoOverlay}>
                  <Check size={24} color="#FFFFFF" />
                </View>
              )}
            </View>
            <Text style={[styles.photoLabel, { color: theme.colors.textSecondary }]}>
              {selectedImage ? 'New Photo Selected' : 'Current Profile Photo'}
            </Text>
          </AnimatedCard>
        </View>

        {/* Photo Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Photo Options
          </Text>
          
          <AnimatedCard style={styles.optionCard} onPress={handleTakePhoto}>
            <View style={styles.optionContent}>
              <View style={[styles.optionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Camera size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                  Take New Photo
                </Text>
                <Text style={[styles.optionSubtitle, { color: theme.colors.textSecondary }]}>
                  Use camera to capture a new photo
                </Text>
              </View>
            </View>
          </AnimatedCard>

          <AnimatedCard style={styles.optionCard} onPress={handleChoosePhoto}>
            <View style={styles.optionContent}>
              <View style={[styles.optionIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
                <ImageIcon size={24} color={theme.colors.secondary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                  Choose from Gallery
                </Text>
                <Text style={[styles.optionSubtitle, { color: theme.colors.textSecondary }]}>
                  Select an existing photo from your device
                </Text>
              </View>
            </View>
          </AnimatedCard>

          {selectedImage && (
            <AnimatedCard style={styles.optionCard} onPress={handleRemovePhoto}>
              <View style={styles.optionContent}>
                <View style={[styles.optionIcon, { backgroundColor: theme.colors.error + '20' }]}>
                  <Trash2 size={24} color={theme.colors.error} />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                    Remove Selected Photo
                  </Text>
                  <Text style={[styles.optionSubtitle, { color: theme.colors.textSecondary }]}>
                    Clear the selected photo
                  </Text>
                </View>
              </View>
            </AnimatedCard>
          )}
        </View>

        {/* Photo Guidelines */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Photo Guidelines
          </Text>
          
          <AnimatedCard style={styles.guidelinesCard}>
            <View style={styles.guidelinesContent}>
              <Text style={[styles.guidelineText, { color: theme.colors.textSecondary }]}>
                • Use a clear, high-quality photo
              </Text>
              <Text style={[styles.guidelineText, { color: theme.colors.textSecondary }]}>
                • Ensure good lighting and focus
              </Text>
              <Text style={[styles.guidelineText, { color: theme.colors.textSecondary }]}>
                • Face should be clearly visible
              </Text>
              <Text style={[styles.guidelineText, { color: theme.colors.textSecondary }]}>
                • Professional appearance recommended
              </Text>
              <Text style={[styles.guidelineText, { color: theme.colors.textSecondary }]}>
                • Supported formats: JPG, PNG
              </Text>
            </View>
          </AnimatedCard>
        </View>

        {/* Save Button */}
        {selectedImage && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSavePhoto}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  photoCard: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 0,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(34, 197, 94, 0.8)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  optionCard: {
    marginBottom: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  guidelinesCard: {
    marginBottom: 0,
  },
  guidelinesContent: {
    padding: 20,
    gap: 8,
  },
  guidelineText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
