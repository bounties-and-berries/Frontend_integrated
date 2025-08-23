import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Send, AlertCircle, MessageSquare, FileText, HelpCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const queryCategories = [
  { id: 'technical', label: 'Technical Issue', icon: AlertCircle, color: '#EF4444' },
  { id: 'academic', label: 'Academic Query', icon: FileText, color: '#3B82F6' },
  { id: 'administrative', label: 'Administrative', icon: MessageSquare, color: '#10B981' },
  { id: 'general', label: 'General Inquiry', icon: HelpCircle, color: '#F59E0B' },
];

const priorityLevels = [
  { id: 'low', label: 'Low', color: '#10B981' },
  { id: 'medium', label: 'Medium', color: '#F59E0B' },
  { id: 'high', label: 'High', color: '#EF4444' },
  { id: 'urgent', label: 'Urgent', color: '#DC2626' },
];

export default function RaiseQuery() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleSubmit = () => {
    if (!selectedCategory || !selectedPriority || !subject.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Here you would typically send the data to your backend
    Alert.alert(
      'Success',
      'Your query has been submitted successfully. We will get back to you within 24-48 hours.',
      [{ text: 'OK', onPress: () => resetForm() }]
    );
  };

  const resetForm = () => {
    setSelectedCategory('');
    setSelectedPriority('');
    setSubject('');
    setDescription('');
    setContactNumber('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Raise Query"
        subtitle="Submit your questions and concerns"
        showBackButton={true}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View style={styles.section}>
          <AnimatedCard style={styles.headerCard}>
            <View style={styles.headerContent}>
              <View style={[styles.headerIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <MessageSquare size={32} color={theme.colors.primary} />
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                  Need Help?
                </Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                  We're here to help! Submit your query and we'll get back to you as soon as possible.
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Query Form */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Query Details
          </Text>

          {/* Category Selection */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Category *
            </Text>
            <View style={styles.categoriesGrid}>
              {queryCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: selectedCategory === category.id 
                        ? category.color + '20' 
                        : theme.colors.card,
                      borderColor: selectedCategory === category.id 
                        ? category.color 
                        : theme.colors.border,
                    }
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <category.icon 
                    size={20} 
                    color={selectedCategory === category.id ? category.color : theme.colors.textSecondary} 
                  />
                  <Text style={[
                    styles.categoryLabel,
                    { 
                      color: selectedCategory === category.id 
                        ? category.color 
                        : theme.colors.textSecondary 
                    }
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Priority Selection */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Priority Level *
            </Text>
            <View style={styles.priorityRow}>
              {priorityLevels.map((priority) => (
                <TouchableOpacity
                  key={priority.id}
                  style={[
                    styles.priorityButton,
                    {
                      backgroundColor: selectedPriority === priority.id 
                        ? priority.color + '20' 
                        : theme.colors.card,
                      borderColor: selectedPriority === priority.id 
                        ? priority.color 
                        : theme.colors.border,
                    }
                  ]}
                  onPress={() => setSelectedPriority(priority.id)}
                >
                  <Text style={[
                    styles.priorityLabel,
                    { 
                      color: selectedPriority === priority.id 
                        ? priority.color 
                        : theme.colors.textSecondary 
                    }
                  ]}>
                    {priority.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Subject */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Subject *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              placeholder="Brief description of your query"
              placeholderTextColor={theme.colors.textSecondary}
              value={subject}
              onChangeText={setSubject}
              maxLength={100}
            />
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Detailed Description *
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              placeholder="Please provide detailed information about your query..."
              placeholderTextColor={theme.colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={[styles.characterCount, { color: theme.colors.textSecondary }]}>
              {description.length}/500 characters
            </Text>
          </View>

          {/* Contact Number */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Contact Number (Optional)
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              placeholder="Your contact number for urgent queries"
              placeholderTextColor={theme.colors.textSecondary}
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Send size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Submit Query</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <AnimatedCard style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <HelpCircle size={24} color={theme.colors.primary} />
              <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                What happens next?
              </Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                • Your query will be reviewed by our support team{'\n'}
                • You'll receive an acknowledgment within 2 hours{'\n'}
                • We aim to resolve queries within 24-48 hours{'\n'}
                • For urgent matters, we'll contact you directly
              </Text>
            </View>
          </AnimatedCard>
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
  headerCard: {
    marginBottom: 0,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
    minWidth: (width - 64) / 2 - 6,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    flex: 1,
  },
  priorityLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
    marginTop: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  infoCard: {
    marginBottom: 0,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  infoContent: {
    paddingLeft: 36,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});
