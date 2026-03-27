import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import TopMenuBar from '@/components/TopMenuBar';
import { getUserByIdAdmin, updateUserAdmin } from '@/utils/api';
import { Save, User, Mail, Smartphone, Shield, GraduationCap, Calendar } from 'lucide-react-native';
import { useResponsive } from '@/hooks/useResponsive';

export default function EditUser() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: '',
    department: '',
    year: '',
    roll_no: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isMobile } = useResponsive();

  const styles = getStyles(theme, isMobile);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserByIdAdmin(id as string);
        const user = response.data;
        setFormData({
          name: user.name || '',
          email: user.email || '',
          mobile: user.mobile || user.mobilenumber || '',
          role: user.role_name || '',
          department: user.department || '',
          year: user.year?.toString() || '',
          roll_no: user.roll_no || '',
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        Alert.alert('Error', 'Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      Alert.alert('Error', 'Name, Email and Role are required');
      return;
    }

    setSaving(true);
    try {
      await updateUserAdmin(id as string, {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        department: formData.department,
        year: formData.year,
        roll_no: formData.roll_no,
      });

      Alert.alert('Success', 'User updated successfully!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (error: any) {
      console.error('Error updating user:', error);
      Alert.alert('Error', error.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar title="Edit User" subtitle="Modify user account details" showBackButton={true} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Full Name *</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <User size={20} color={theme.colors.textSecondary} />
              <TextInput style={[styles.input, { color: theme.colors.text }]} value={formData.name} onChangeText={t => setFormData({...formData, name: t})} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Email Address *</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Mail size={20} color={theme.colors.textSecondary} />
              <TextInput style={[styles.input, { color: theme.colors.text }]} value={formData.email} keyboardType="email-address" onChangeText={t => setFormData({...formData, email: t})} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Mobile Number</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Smartphone size={20} color={theme.colors.textSecondary} />
              <TextInput style={[styles.input, { color: theme.colors.text }]} value={formData.mobile} keyboardType="phone-pad" onChangeText={t => setFormData({...formData, mobile: t})} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Academic Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Department</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <GraduationCap size={20} color={theme.colors.textSecondary} />
              <TextInput style={[styles.input, { color: theme.colors.text }]} value={formData.department} onChangeText={t => setFormData({...formData, department: t})} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Year</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Calendar size={20} color={theme.colors.textSecondary} />
              <TextInput style={[styles.input, { color: theme.colors.text }]} value={formData.year} keyboardType="numeric" onChangeText={t => setFormData({...formData, year: t})} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Roll Number / ID</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Shield size={20} color={theme.colors.textSecondary} />
              <TextInput style={[styles.input, { color: theme.colors.text }]} value={formData.roll_no} onChangeText={t => setFormData({...formData, roll_no: t})} />
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.colors.primary }]} onPress={handleSubmit} disabled={saving}>
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any, isMobile: boolean) => StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins-SemiBold', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontFamily: 'Inter-SemiBold', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, gap: 10, minHeight: 48 },
  input: { flex: 1, fontSize: 16, fontFamily: 'Inter-Regular' },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8, marginBottom: 40 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter-SemiBold' },
});
