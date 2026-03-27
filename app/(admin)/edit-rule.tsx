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
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { getRuleById, updateRule } from '@/utils/api';
import { Save, Award, Calendar, Users, BookOpen, Trophy } from 'lucide-react-native';
import { useResponsive } from '@/hooks/useResponsive';

const categories = [
  { id: 'academic', label: 'Academic Achievement', icon: BookOpen, color: '#6366F1' },
  { id: 'cultural', label: 'Cultural Activity', icon: Trophy, color: '#8B5CF6' },
  { id: 'volunteer', label: 'Volunteer Work', icon: Users, color: '#10B981' },
  { id: 'sports', label: 'Sports Achievement', icon: Award, color: '#F59E0B' },
  { id: 'attendance', label: 'Attendance', icon: Calendar, color: '#EF4444' },
  { id: 'leadership', label: 'Leadership Role', icon: Users, color: '#8B5CF6' },
];

export default function EditRule() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    activity: '',
    category: '',
    berries: '',
    description: '',
    maxPerDay: '',
    maxPerMonth: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isMobile } = useResponsive();

  const styles = getStyles(theme, isMobile);

  useEffect(() => {
    const fetchRule = async () => {
      try {
        const response = await getRuleById(id as string);
        const rule = response.data;
        setFormData({
          activity: rule.name || '',
          category: rule.category || '',
          berries: rule.points?.toString() || '',
          description: rule.description || '',
          maxPerDay: rule.max_per_day?.toString() || '',
          maxPerMonth: rule.max_per_semester?.toString() || '',
        });
      } catch (error) {
        console.error('Error fetching rule:', error);
        Alert.alert('Error', 'Failed to fetch rule details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRule();
  }, [id]);

  const handleSubmit = async () => {
    if (!formData.activity || !formData.category || !formData.berries || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const berriesValue = parseInt(formData.berries);
    if (isNaN(berriesValue) || berriesValue <= 0) {
      Alert.alert('Error', 'Please enter a valid number of berries');
      return;
    }

    setSaving(true);

    try {
      const ruleData = {
        name: formData.activity,
        category: formData.category,
        points: berriesValue,
        description: formData.description,
        max_per_day: formData.maxPerDay ? parseInt(formData.maxPerDay) : null,
        max_per_semester: formData.maxPerMonth ? parseInt(formData.maxPerMonth) : null,
      };

      await updateRule(id as string, ruleData);

      Alert.alert(
        'Success',
        'Berry rule updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('Error updating rule:', error);
      Alert.alert('Error', error.message || 'Failed to update berry rule');
    } finally {
      setSaving(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar
        title="Edit Berry Rule"
        subtitle="Modify existing berry allocation rules"
        showBackButton={true}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Rule Information
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Activity Name *
            </Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }]}
              placeholder="Enter activity name"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.activity}
              onChangeText={(text) => setFormData({ ...formData, activity: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Category *
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor: formData.category === category.id
                          ? category.color + '20'
                          : theme.colors.card,
                        borderColor: formData.category === category.id
                          ? category.color
                          : theme.colors.border,
                      }
                    ]}
                    onPress={() => setFormData({ ...formData, category: category.id })}
                  >
                    <IconComponent
                      size={20}
                      color={formData.category === category.id ? category.color : theme.colors.textSecondary}
                    />
                    <Text style={[
                      styles.categoryLabel,
                      {
                        color: formData.category === category.id
                          ? category.color
                          : theme.colors.text
                      }
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Berries Reward *
            </Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }]}
              placeholder="Enter berries amount"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
              value={formData.berries}
              onChangeText={(text) => setFormData({ ...formData, berries: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Description *
            </Text>
            <TextInput
              style={[styles.textArea, {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }]}
              placeholder="Describe the activity and requirements..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Limits (Optional)
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Maximum Per Day
            </Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }]}
              placeholder="Enter daily limit"
              keyboardType="numeric"
              value={formData.maxPerDay}
              onChangeText={(text) => setFormData({ ...formData, maxPerDay: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Maximum Per Semester
            </Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }]}
              placeholder="Enter semester limit"
              keyboardType="numeric"
              value={formData.maxPerMonth}
              onChangeText={(text) => setFormData({ ...formData, maxPerMonth: text })}
            />
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSubmit}
            disabled={saving}
          >
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any, isMobile: boolean) => StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontFamily: 'Poppins-SemiBold', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 16, fontFamily: 'Inter-SemiBold', marginBottom: 8 },
  input: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 1, fontSize: 16, fontFamily: 'Inter-Regular', minHeight: 44 },
  textArea: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 1, fontSize: 16, fontFamily: 'Inter-Regular', textAlignVertical: 'top', minHeight: 100 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: { width: isMobile ? '100%' : '48%', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, borderWidth: 1, gap: 8, minHeight: 44 },
  categoryLabel: { fontSize: 12, fontFamily: 'Inter-SemiBold', flex: 1 },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8, minHeight: 44 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter-SemiBold' },
});
