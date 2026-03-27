import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { changePassword } from '@/utils/api';
import TopMenuBar from '@/components/TopMenuBar';
import { Lock, Eye, EyeOff } from 'lucide-react-native';
import AnimatedCard from '@/components/AnimatedCard';

export default function ChangePasswordScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return 'All fields are required';
    }
    if (newPassword.length < 6) {
      return 'New password must be at least 6 characters long';
    }
    if (newPassword !== confirmPassword) {
      return 'New passwords do not match';
    }
    return '';
  };

  const handleSubmit = async () => {
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user) {
      setError('You must be logged in to change your password');
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        oldPassword,
        newPassword,
      });

      if (Platform.OS === 'web') {
        window.alert('Password changed successfully!');
        router.back();
      } else {
        Alert.alert('Success', 'Password changed successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TopMenuBar
        title="Change Password"
        subtitle="Secure your account"
        showBackButton
        onBackPress={() => router.back()}
      />

      <AnimatedCard style={styles.card}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + '15' }]}>
            <Lock size={32} color={theme.colors.primary} />
          </View>
        </View>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: theme.colors.error + '15', borderColor: theme.colors.error }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Current Password</Text>
          <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <Lock size={18} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Enter current password"
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry={!showOld}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TouchableOpacity onPress={() => setShowOld(!showOld)} style={styles.eyeBtn}>
              {showOld ? <EyeOff size={18} color={theme.colors.textSecondary} /> : <Eye size={18} color={theme.colors.textSecondary} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>New Password</Text>
          <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <Lock size={18} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Enter new password"
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
              {showNew ? <EyeOff size={18} color={theme.colors.textSecondary} /> : <Eye size={18} color={theme.colors.textSecondary} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.inputGroup, { marginBottom: 24 }]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Confirm New Password</Text>
          <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
            <Lock size={18} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Confirm new password"
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
              {showConfirm ? <EyeOff size={18} color={theme.colors.textSecondary} /> : <Eye size={18} color={theme.colors.textSecondary} />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: theme.colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </AnimatedCard>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { marginHorizontal: 20, marginTop: 20, padding: 24 },
  iconContainer: { alignItems: 'center', marginBottom: 24 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  errorBox: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 16, alignItems: 'center' },
  errorText: { fontSize: 13, fontFamily: 'Inter-Medium', textAlign: 'center' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontFamily: 'Inter-Medium', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter-Regular' },
  eyeBtn: { padding: 4 },
  submitBtn: { height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Inter-SemiBold' },
});
