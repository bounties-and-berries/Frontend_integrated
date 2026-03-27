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
  TextInput,
  Modal,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Faculty } from '@/types';
import { changePassword, updateProfileImage } from '@/utils/api';
import * as ImagePicker from 'expo-image-picker';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import DocumentPicker from '@/components/DocumentPicker';
// @ts-ignore - lucide-react-native icons work at runtime despite TS warnings
import { Users, Lock, Info, FileText, MessageSquare, Camera, LogOut, ChevronRight } from 'lucide-react-native';

export default function FacultySettings() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const faculty = user as Faculty;

  // Loading states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

  const handleLogout = async () => {
    console.log('🟢 Faculty handleLogout called');

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
          }
        }
      ]
    );
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    setIsChangingPassword(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert('Success', 'Password changed successfully!', [
        {
          text: 'OK', onPress: () => {
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRaiseQuery = () => {
    router.push('/(faculty)/raise-query');
  };

  const handleUploadPhoto = () => {
    router.push('/profile-photo');
  };

  const handleTerms = () => {
    router.push('/terms');
  };

  const handleHelpSupport = () => {
    router.push('/help');
  };

  const handleDocumentUpload = () => {
    setShowDocumentModal(true);
  };

  const handleFileSelected = (file: any) => {
    setUploadedDocuments(prev => [...prev, {
      id: Date.now().toString(),
      name: file.name || file.fileName,
      size: file.size || file.fileSize,
      type: file.type || file.mimeType,
      uri: file.uri,
      uploadedAt: new Date().toISOString(),
    }]);
    Alert.alert('Success', `Document "${file.name || file.fileName}" uploaded successfully!`);
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
      loading: false,
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      subtitle: 'Read our terms and conditions',
      icon: FileText,
      onPress: handleTerms,
      loading: false,
    },
    {
      id: 'documents',
      title: 'Upload Documents',
      subtitle: 'Upload certificates, forms, or other documents',
      icon: FileText,
      onPress: handleDocumentUpload,
      loading: false,
    },
    {
      id: 'query',
      title: 'Raise Query',
      subtitle: 'Contact college or app support',
      icon: MessageSquare,
      onPress: handleRaiseQuery,
      loading: false,
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help with using the app',
      icon: Info,
      onPress: handleHelpSupport,
      loading: false,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, flex: 1 }]}>
      <TopMenuBar
        title="Settings"
        subtitle="Manage your account and preferences"
        showBackButton={true}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <AnimatedCard style={styles.profileCard}>
            <View style={styles.profileContent}>
              <Image
                source={faculty?.profileImage ? { uri: faculty.profileImage } : require('@/assets/images/default-avatar.png')}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.colors.text }]}>
                  {faculty?.name}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
                  {faculty?.email}
                </Text>
                <Text style={[styles.profileDepartment, { color: theme.colors.textSecondary }]}>
                  {faculty?.department} • {faculty?.subject}
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Preferences Section - REMOVED */}
        {/* Dark/Light mode toggle moved to home page header */}

        {/* Settings Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Account
          </Text>

          {settingsOptions.map((option) => (
            <AnimatedCard
              key={option.id}
              style={{
                ...styles.settingCard,
                opacity: option.loading ? 0.7 : 1
              }}
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
                  <View style={styles.settingTextContainer}>
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

      {/* Password Change Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="fade"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
              <Text style={[styles.modalCancelButton, { color: theme.colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Change Password</Text>
            <TouchableOpacity
              onPress={handlePasswordChange}
              disabled={isChangingPassword}
            >
              <Text style={[
                styles.modalSaveButton,
                { color: isChangingPassword ? theme.colors.textSecondary : theme.colors.primary }
              ]}>
                {isChangingPassword ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Current Password</Text>
              <TextInput
                style={[styles.textInput, {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }]}
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                secureTextEntry
                placeholder="Enter current password"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>New Password</Text>
              <TextInput
                style={[styles.textInput, {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }]}
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                secureTextEntry
                placeholder="Enter new password (min 6 characters)"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Confirm New Password</Text>
              <TextInput
                style={[styles.textInput, {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }]}
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                secureTextEntry
                placeholder="Confirm new password"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            {isChangingPassword && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                  Changing password...
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Document Upload Modal */}
      <Modal
        visible={showDocumentModal}
        animationType="fade"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDocumentModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setShowDocumentModal(false)}>
              <Text style={[styles.modalCancelButton, { color: theme.colors.primary }]}>Close</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Upload Documents</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.uploadSection}>
              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Upload New Document</Text>
              <Text style={[styles.sectionDescription, { color: theme.colors.textSecondary }]}>
                Supported formats: PDF, DOCX, PNG, JPG (Max 10MB)
              </Text>

              <DocumentPicker
                onFileSelected={handleFileSelected}
                acceptedTypes={['pdf', 'docx', 'png', 'jpg', 'jpeg']}
                maxSizeBytes={10 * 1024 * 1024}
                placeholder="Select document to upload"
                style={{ marginTop: 16 }}
              />
            </View>

            {/* Uploaded Documents List */}
            {uploadedDocuments.length > 0 && (
              <View style={styles.uploadedSection}>
                <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Uploaded Documents</Text>
                <View style={styles.documentsList}>
                  {uploadedDocuments.map((doc) => (
                    <View key={doc.id} style={[styles.documentItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                      <View style={styles.documentInfo}>
                        <FileText size={20} color={theme.colors.primary} />
                        <View style={styles.documentDetails}>
                          <Text style={[styles.documentName, { color: theme.colors.text }]}>
                            {doc.name}
                          </Text>
                          <Text style={[styles.documentMeta, { color: theme.colors.textSecondary }]}>
                            {(doc.size / (1024 * 1024)).toFixed(2)} MB • {new Date(doc.uploadedAt).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.documentAction}
                        onPress={() => {
                          Alert.alert(
                            'Document Options',
                            `What would you like to do with "${doc.name}"?`,
                            [
                              { text: 'Cancel', style: 'cancel' },
                              { text: 'View', onPress: () => Alert.alert('View', 'Opening document...') },
                              {
                                text: 'Delete', style: 'destructive', onPress: () => {
                                  setUploadedDocuments(prev => prev.filter(d => d.id !== doc.id));
                                  Alert.alert('Deleted', 'Document removed successfully.');
                                }
                              }
                            ]
                          );
                        }}
                      >
                        <Text style={[styles.documentActionText, { color: theme.colors.primary }]}>Options</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
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
  profileDepartment: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  settingCard: {
    marginBottom: 12,
    minHeight: 72, // Ensure minimum 44px touch target with padding
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56, // 44px + padding
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    width: 44, // Minimum touch target
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
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
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  modalCancelButton: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    minWidth: 60,
  },
  modalSaveButton: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    minWidth: 60,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 52, // Ensure proper touch target
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  // Document upload styles
  uploadSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  uploadedSection: {
    marginBottom: 32,
  },
  documentsList: {
    gap: 12,
    marginTop: 16,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  documentDetails: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  documentMeta: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  documentAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  documentActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});