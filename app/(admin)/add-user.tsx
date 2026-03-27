import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { createUser } from '@/utils/api';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Users, Plus } from 'lucide-react-native';
import { useResponsive } from '@/hooks/useResponsive';

const roles = [
  { label: 'Student', value: 'student' },
  { label: 'Faculty', value: 'faculty' },
  { label: 'Admin', value: 'admin' },
];

export default function AddUser() {
  const { theme } = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'student',
    college_id: '',
    department: '',
    year: '',
  });
  const [loading, setLoading] = useState(false);
  const { isMobile } = useResponsive();

  const styles = getStyles(theme, isMobile);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.mobile || !formData.college_id) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Mobile validation (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        role: formData.role,
        college_id: Number(formData.college_id),
        department: formData.department || undefined,
        year: formData.year ? Number(formData.year) : undefined,
      };

      await createUser(userData);

      Alert.alert(
        'Success',
        'User created successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar
        title="Add New User"
        subtitle="Create a new student, faculty, or admin account"
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedCard style={styles.formCard}>
          {/* Name Field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Full Name *
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Users size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Enter full name"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
              />
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Email Address *
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Users size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Enter email address"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Mobile Field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Mobile Number *
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Users size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Enter 10-digit mobile number"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.mobile}
                onChangeText={(value) => handleChange('mobile', value)}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          {/* Role Selection */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Role *
            </Text>
            <View style={styles.roleContainer}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.value}
                  style={[
                    styles.roleButton,
                    {
                      backgroundColor: formData.role === role.value
                        ? theme.colors.primary
                        : theme.colors.surface,
                      borderColor: formData.role === role.value
                        ? theme.colors.primary
                        : theme.colors.border,
                    }
                  ]}
                  onPress={() => handleChange('role', role.value)}
                >
                  <Text style={[
                    styles.roleText,
                    {
                      color: formData.role === role.value
                        ? '#FFFFFF'
                        : theme.colors.textSecondary
                    }
                  ]}>
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* College ID Field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              College ID *
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Users size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Enter college ID"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.college_id}
                onChangeText={(value) => handleChange('college_id', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Department Field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Department
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Users size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Enter department"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.department}
                onChangeText={(value) => handleChange('department', value)}
              />
            </View>
          </View>

          {/* Year Field (Only for students) */}
          {formData.role === 'student' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Year
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <Users size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Enter year (1-4)"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.year}
                  onChangeText={(value) => handleChange('year', value)}
                  keyboardType="numeric"
                  maxLength={1}
                />
              </View>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating User...' : 'Create User'}
            </Text>
          </TouchableOpacity>
        </AnimatedCard>
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
    padding: 20,
  },
  formCard: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    padding: 0,
    margin: 0,
  },
  roleContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 44,
  },
  roleText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 10,
    minHeight: 44,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});