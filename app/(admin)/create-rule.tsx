import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Plus, Award, Calendar, Users, BookOpen, Trophy } from 'lucide-react-native';

const categories = [
  { id: 'academic', label: 'Academic Achievement', icon: BookOpen, color: '#6366F1' },
  { id: 'cultural', label: 'Cultural Activity', icon: Trophy, color: '#8B5CF6' },
  { id: 'volunteer', label: 'Volunteer Work', icon: Users, color: '#10B981' },
  { id: 'sports', label: 'Sports Achievement', icon: Award, color: '#F59E0B' },
  { id: 'attendance', label: 'Attendance', icon: Calendar, color: '#EF4444' },
  { id: 'leadership', label: 'Leadership Role', icon: Users, color: '#8B5CF6' },
];

export default function CreateRule() {
  const { theme } = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    activity: '',
    category: '',
    berries: '',
    description: '',
    maxPerDay: '',
    maxPerMonth: '',
  });

  const handleSubmit = () => {
    if (!formData.activity || !formData.category || !formData.berries || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Create Rule',
      'Are you sure you want to create this berry rule?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create', 
          onPress: () => {
            Alert.alert('Success', 'Berry rule created successfully!');
            router.back();
          }
        }
      ]
    );
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Create Berry Rule"
        subtitle="Set up new berry allocation rules"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rule Information */}
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
              onChangeText={(text) => setFormData({...formData, activity: text})}
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
                    onPress={() => setFormData({...formData, category: category.id})}
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
              onChangeText={(text) => setFormData({...formData, berries: text})}
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
              onChangeText={(text) => setFormData({...formData, description: text})}
            />
          </View>
        </View>

        {/* Limits */}
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
              placeholder="Enter daily limit (optional)"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
              value={formData.maxPerDay}
              onChangeText={(text) => setFormData({...formData, maxPerDay: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Maximum Per Month
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Enter monthly limit (optional)"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
              value={formData.maxPerMonth}
              onChangeText={(text) => setFormData({...formData, maxPerMonth: text})}
            />
          </View>
        </View>

        {/* Preview */}
        {formData.activity && formData.category && formData.berries && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Rule Preview
            </Text>
            
            <AnimatedCard style={styles.previewCard}>
              <View style={styles.previewContent}>
                <View style={styles.previewHeader}>
                  <View style={[
                    styles.previewIcon,
                    { backgroundColor: selectedCategory?.color + '20' }
                  ]}>
                    {selectedCategory && (
                      <selectedCategory.icon size={20} color={selectedCategory.color} />
                    )}
                  </View>
                  <View style={styles.previewInfo}>
                    <Text style={[styles.previewActivity, { color: theme.colors.text }]}>
                      {formData.activity}
                    </Text>
                    <Text style={[styles.previewCategory, { color: theme.colors.textSecondary }]}>
                      {selectedCategory?.label}
                    </Text>
                  </View>
                  <View style={styles.previewBerries}>
                    <Text style={[styles.previewBerriesText, { color: theme.colors.primary }]}>
                      +{formData.berries}
                    </Text>
                    <Text style={[styles.previewBerriesLabel, { color: theme.colors.textSecondary }]}>
                      berries
                    </Text>
                  </View>
                </View>
                
                {formData.description && (
                  <Text style={[styles.previewDescription, { color: theme.colors.textSecondary }]}>
                    {formData.description}
                  </Text>
                )}
                
                {(formData.maxPerDay || formData.maxPerMonth) && (
                  <View style={styles.previewLimits}>
                    {formData.maxPerDay && (
                      <Text style={[styles.previewLimit, { color: theme.colors.textSecondary }]}>
                        Max {formData.maxPerDay}/day
                      </Text>
                    )}
                    {formData.maxPerMonth && (
                      <Text style={[styles.previewLimit, { color: theme.colors.textSecondary }]}>
                        Max {formData.maxPerMonth}/month
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </AnimatedCard>
          </View>
        )}

        {/* Submit Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSubmit}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Create Berry Rule</Text>
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
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  previewCard: {
    marginBottom: 0,
  },
  previewContent: {
    gap: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewInfo: {
    flex: 1,
    gap: 2,
  },
  previewActivity: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  previewCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  previewBerries: {
    alignItems: 'center',
  },
  previewBerriesText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  previewBerriesLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  previewDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  previewLimits: {
    flexDirection: 'row',
    gap: 12,
  },
  previewLimit: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});