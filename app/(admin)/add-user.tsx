import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { 
  UserPlus, 
  Phone, 
  User, 
  Shield, 
  Hash, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Plus
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const roles = [
  { 
    label: 'Student', 
    value: 'student',
    description: 'College student with berry earning capabilities',
    icon: '👨‍🎓'
  },
  { 
    label: 'Faculty', 
    value: 'faculty',
    description: 'Teaching staff with event management access',
    icon: '👨‍🏫'
  },
  { 
    label: 'Admin', 
    value: 'admin',
    description: 'System administrator with full access',
    icon: '👨‍💼'
  },
];

export default function AddUser() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [form, setForm] = useState({
    mobile: '',
    name: '',
    role: 'student',
    college_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!form.mobile.trim()) {
      setError('Mobile number is required');
      return false;
    }
    if (!form.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!form.college_id.trim()) {
      setError('College ID is required');
      return false;
    }
    if (form.mobile.length < 10) {
      setError('Please enter a valid mobile number');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult = {
        id: Math.floor(Math.random() * 10000),
        ...form,
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      setResult(mockResult);
      Alert.alert(
        'Success!',
        `User "${form.name}" has been created successfully.`,
        [
          {
            text: 'Create Another',
            onPress: () => {
              setForm({ mobile: '', name: '', role: 'student', college_id: '' });
              setResult(null);
            }
          },
          {
            text: 'Done',
            onPress: () => router.back()
          }
        ]
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.mobile.trim() && form.name.trim() && form.college_id.trim();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="Add New User"
        subtitle="Create a new user account"
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Card */}
          <View style={styles.section}>
            <AnimatedCard style={styles.headerCard}>
              <LinearGradient
                colors={theme.colors.gradient.primary as [string, string]}
                style={styles.headerGradient}
              >
                <View style={styles.headerContent}>
                  <View style={styles.headerIcon}>
                    <UserPlus size={32} color="#FFFFFF" />
                  </View>
                  <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>Create New User</Text>
                    <Text style={styles.headerSubtitle}>
                      Add students, faculty, or administrators to the system
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </AnimatedCard>
          </View>

          {/* Form Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              User Information
            </Text>

            {/* Name Input */}
            <AnimatedCard style={styles.inputCard}>
              <View style={styles.inputContainer}>
                <View style={[styles.inputIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <User size={20} color={theme.colors.primary} />
                </View>
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Full Name"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={form.name}
                  onChangeText={(value) => handleChange('name', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </AnimatedCard>

            {/* Mobile Input */}
            <AnimatedCard style={styles.inputCard}>
              <View style={styles.inputContainer}>
                <View style={[styles.inputIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
                  <Phone size={20} color={theme.colors.secondary} />
                </View>
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Mobile Number"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={form.mobile}
                  onChangeText={(value) => handleChange('mobile', value)}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </AnimatedCard>

            {/* College ID Input */}
            <AnimatedCard style={styles.inputCard}>
              <View style={styles.inputContainer}>
                <View style={[styles.inputIcon, { backgroundColor: theme.colors.accent + '20' }]}>
                  <Hash size={20} color={theme.colors.accent} />
                </View>
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="College ID"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={form.college_id}
                  onChangeText={(value) => handleChange('college_id', value)}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </AnimatedCard>

            {/* Role Selection */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 24 }]}>
              User Role
            </Text>
            
            <View style={styles.roleContainer}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.value}
                  style={[
                    styles.roleCard,
                    { 
                      borderColor: form.role === role.value ? theme.colors.primary : theme.colors.border,
                      backgroundColor: form.role === role.value ? theme.colors.primary + '10' : theme.colors.card
                    }
                  ]}
                  onPress={() => handleChange('role', role.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.roleHeader}>
                    <Text style={styles.roleIcon}>{role.icon}</Text>
                    <View style={[
                      styles.roleRadio,
                      { 
                        borderColor: form.role === role.value ? theme.colors.primary : theme.colors.border,
                        backgroundColor: form.role === role.value ? theme.colors.primary : 'transparent'
                      }
                    ]}>
                      {form.role === role.value && (
                        <CheckCircle size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </View>
                  <Text style={[styles.roleLabel, { color: theme.colors.text }]}>
                    {role.label}
                  </Text>
                  <Text style={[styles.roleDescription, { color: theme.colors.textSecondary }]}>
                    {role.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Error Display */}
            {error && (
              <View style={styles.section}>
                <AnimatedCard style={styles.errorCard}>
                  <View style={styles.errorContent}>
                    <AlertCircle size={24} color={theme.colors.error} />
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                      {error}
                    </Text>
                  </View>
                </AnimatedCard>
              </View>
            )}

            {/* Submit Button */}
            <View style={styles.section}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { 
                    backgroundColor: isFormValid ? theme.colors.primary : theme.colors.textSecondary 
                  }
                ]}
                onPress={handleSubmit}
                disabled={!isFormValid || loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isFormValid ? theme.colors.gradient.primary as [string, string] : [theme.colors.textSecondary, theme.colors.textSecondary] as [string, string]}
                  style={styles.submitButtonGradient}
                >
                  {loading ? (
                    <Text style={styles.submitButtonText}>Creating User...</Text>
                  ) : (
                    <>
                      <Plus size={20} color="#FFFFFF" />
                      <Text style={styles.submitButtonText}>Create User</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Success Result */}
            {result && (
              <View style={styles.section}>
                <AnimatedCard style={styles.successCard}>
                  <View style={styles.successHeader}>
                    <CheckCircle size={24} color="#10B981" />
                    <Text style={[styles.successTitle, { color: theme.colors.text }]}>
                      User Created Successfully!
                    </Text>
                  </View>
                  <View style={styles.successDetails}>
                    <View style={styles.successRow}>
                      <Text style={[styles.successLabel, { color: theme.colors.textSecondary }]}>Name:</Text>
                      <Text style={[styles.successValue, { color: theme.colors.text }]}>{result.name}</Text>
                    </View>
                    <View style={styles.successRow}>
                      <Text style={[styles.successLabel, { color: theme.colors.textSecondary }]}>Role:</Text>
                      <Text style={[styles.successValue, { color: theme.colors.text }]}>{result.role}</Text>
                    </View>
                    <View style={styles.successRow}>
                      <Text style={[styles.successLabel, { color: theme.colors.textSecondary }]}>Mobile:</Text>
                      <Text style={[styles.successValue, { color: theme.colors.text }]}>{result.mobile}</Text>
                    </View>
                    <View style={styles.successRow}>
                      <Text style={[styles.successLabel, { color: theme.colors.textSecondary }]}>College ID:</Text>
                      <Text style={[styles.successValue, { color: theme.colors.text }]}>{result.college_id}</Text>
                    </View>
                  </View>
                </AnimatedCard>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
  headerCard: {
    marginBottom: 0,
  },
  headerGradient: {
    borderRadius: 16,
    padding: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  inputCard: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  inputIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  roleContainer: {
    gap: 12,
  },
  roleCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleIcon: {
    fontSize: 24,
  },
  roleRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  errorCard: {
    marginBottom: 0,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  successCard: {
    marginBottom: 0,
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    padding: 20,
    paddingBottom: 0,
  },
  successTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  successDetails: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  successValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});