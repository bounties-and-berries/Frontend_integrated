import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react-native';

export default function ChangePassword() {
  const { theme } = useTheme();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      Alert.alert('Error', 'Password does not meet security requirements');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Password changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    }, 1500);
  };

  const validation = validatePassword(newPassword);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="Change Password"
        subtitle="Update your account password"
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Password Requirements */}
        <View style={styles.section}>
          <AnimatedCard style={styles.requirementsCard}>
            <View style={styles.requirementsHeader}>
              <Lock size={24} color={theme.colors.primary} />
              <Text style={[styles.requirementsTitle, { color: theme.colors.text }]}>
                Password Requirements
              </Text>
            </View>
            <View style={styles.requirementsList}>
              <View style={styles.requirementItem}>
                <CheckCircle 
                  size={16} 
                  color={validation.minLength ? '#10B981' : theme.colors.textSecondary} 
                />
                <Text style={[
                  styles.requirementText, 
                  { color: validation.minLength ? '#10B981' : theme.colors.textSecondary }
                ]}>
                  At least 8 characters long
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <CheckCircle 
                  size={16} 
                  color={validation.hasUpperCase ? '#10B981' : theme.colors.textSecondary} 
                />
                <Text style={[
                  styles.requirementText, 
                  { color: validation.hasUpperCase ? '#10B981' : theme.colors.textSecondary }
                ]}>
                  Contains uppercase letter (A-Z)
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <CheckCircle 
                  size={16} 
                  color={validation.hasLowerCase ? '#10B981' : theme.colors.textSecondary} 
                />
                <Text style={[
                  styles.requirementText, 
                  { color: validation.hasLowerCase ? '#10B981' : theme.colors.textSecondary }
                ]}>
                  Contains lowercase letter (a-z)
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <CheckCircle 
                  size={16} 
                  color={validation.hasNumbers ? '#10B981' : theme.colors.textSecondary} 
                />
                <Text style={[
                  styles.requirementText, 
                  { color: validation.hasNumbers ? '#10B981' : theme.colors.textSecondary }
                ]}>
                  Contains number (0-9)
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <CheckCircle 
                  size={16} 
                  color={validation.hasSpecialChar ? '#10B981' : theme.colors.textSecondary} 
                />
                <Text style={[
                  styles.requirementText, 
                  { color: validation.hasSpecialChar ? '#10B981' : theme.colors.textSecondary }
                ]}>
                  Contains special character (!@#$%^&*)
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Password Form */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Password Details
          </Text>

          {/* Current Password */}
          <AnimatedCard style={styles.inputCard}>
            <View style={styles.inputContainer}>
              <Lock size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Current Password"
                placeholderTextColor={theme.colors.textSecondary}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                {showCurrentPassword ? (
                  <EyeOff size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Eye size={20} color={theme.colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </AnimatedCard>

          {/* New Password */}
          <AnimatedCard style={styles.inputCard}>
            <View style={styles.inputContainer}>
              <Lock size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="New Password"
                placeholderTextColor={theme.colors.textSecondary}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? (
                  <EyeOff size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Eye size={20} color={theme.colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </AnimatedCard>

          {/* Confirm New Password */}
          <AnimatedCard style={styles.inputCard}>
            <View style={styles.inputContainer}>
              <Lock size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Confirm New Password"
                placeholderTextColor={theme.colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <EyeOff size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Eye size={20} color={theme.colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </AnimatedCard>
        </View>

        {/* Security Note */}
        <View style={styles.section}>
          <AnimatedCard style={styles.securityCard}>
            <View style={styles.securityContent}>
              <AlertCircle size={24} color={theme.colors.warning || '#F59E0B'} />
              <View style={styles.securityText}>
                <Text style={[styles.securityTitle, { color: theme.colors.text }]}>
                  Security Reminder
                </Text>
                <Text style={[styles.securityDescription, { color: theme.colors.textSecondary }]}>
                  After changing your password, you'll need to log in again on all devices. 
                  Make sure to use a strong, unique password that you don't use elsewhere.
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Change Password Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.changeButton, 
              { 
                backgroundColor: validation.isValid && currentPassword && confirmPassword 
                  ? theme.colors.primary 
                  : theme.colors.textSecondary 
              }
            ]}
            onPress={handleChangePassword}
            disabled={!validation.isValid || !currentPassword || !confirmPassword || isLoading}
          >
            <Text style={styles.changeButtonText}>
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        </View>
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
  requirementsCard: {
    marginBottom: 0,
  },
  requirementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requirementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  inputCard: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  securityCard: {
    marginBottom: 0,
  },
  securityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
  },
  securityText: {
    flex: 1,
    gap: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  securityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  changeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 0,
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
