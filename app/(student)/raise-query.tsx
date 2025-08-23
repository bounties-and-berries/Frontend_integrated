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
  { id: 'general', label: 'General Inquiry', icon: HelpCircle, color: '#8B5CF6' },
];

const priorityLevels = [
  { id: 'low', label: 'Low', color: '#10B981' },
  { id: 'medium', label: 'Medium', color: '#F59E0B' },
  { id: 'high', label: 'High', color: '#EF4444' },
  { id: 'urgent', label: 'Urgent', color: '#DC2626' },
];

export default function StudentRaiseQuery() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedPriority || !subject || !description) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Query Submitted',
        'Your query has been submitted successfully. We will get back to you within 24-48 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setSelectedCategory('');
              setSelectedPriority('');
              setSubject('');
              setDescription('');
              setContactNumber('');
            },
          },
        ]
      );
    }, 1500);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = queryCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : HelpCircle;
  };

  const getPriorityColor = (priorityId: string) => {
    const priority = priorityLevels.find(pri => pri.id === priorityId);
    return priority ? priority.color : theme.colors.textSecondary;
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
        {/* Info Section */}
        <View style={styles.section}>
          <AnimatedCard style={styles.infoCard}>
            <View style={styles.infoContent}>
              <HelpCircle size={24} color={theme.colors.primary} />
              <View style={styles.infoText}>
                <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                  Need Help?
                </Text>
                <Text style={[styles.infoSubtitle, { color: theme.colors.textSecondary }]}>
                  Submit your query and we'll get back to you as soon as possible. 
                  For urgent matters, please contact your faculty directly.
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Query Category *
          </Text>
          <View style={styles.categoriesGrid}>
            {queryCategories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    { 
                      backgroundColor: isSelected ? category.color + '20' : theme.colors.card,
                      borderColor: isSelected ? category.color : theme.colors.border,
                    }
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                  activeOpacity={0.7}
                >
                  <IconComponent 
                    size={24} 
                    color={isSelected ? category.color : theme.colors.textSecondary} 
                  />
                  <Text style={[
                    styles.categoryLabel,
                    { 
                      color: isSelected ? category.color : theme.colors.textSecondary,
                      fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Regular'
                    }
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Priority Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Priority Level *
          </Text>
          <View style={styles.priorityGrid}>
            {priorityLevels.map((priority) => {
              const isSelected = selectedPriority === priority.id;
              return (
                <TouchableOpacity
                  key={priority.id}
                  style={[
                    styles.priorityButton,
                    { 
                      backgroundColor: isSelected ? priority.color + '20' : theme.colors.card,
                      borderColor: isSelected ? priority.color : theme.colors.border,
                    }
                  ]}
                  onPress={() => setSelectedPriority(priority.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.priorityLabel,
                    { 
                      color: isSelected ? priority.color : theme.colors.textSecondary,
                      fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Regular'
                    }
                  ]}>
                    {priority.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Subject */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Subject *
          </Text>
          <AnimatedCard style={styles.inputCard}>
            <TextInput
              style={[styles.textInput, { color: theme.colors.text }]}
              placeholder="Brief description of your query"
              placeholderTextColor={theme.colors.textSecondary}
              value={subject}
              onChangeText={setSubject}
              maxLength={100}
            />
            <Text style={[styles.charCount, { color: theme.colors.textSecondary }]}>
              {subject.length}/100
            </Text>
          </AnimatedCard>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Detailed Description *
          </Text>
          <AnimatedCard style={styles.inputCard}>
            <TextInput
              style={[styles.textArea, { color: theme.colors.text }]}
              placeholder="Please provide detailed information about your query..."
              placeholderTextColor={theme.colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: theme.colors.textSecondary }]}>
              {description.length}/500
            </Text>
          </AnimatedCard>
        </View>

        {/* Contact Number */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Contact Number (Optional)
          </Text>
          <AnimatedCard style={styles.inputCard}>
            <TextInput
              style={[styles.textInput, { color: theme.colors.text }]}
              placeholder="Your contact number for follow-up"
              placeholderTextColor={theme.colors.textSecondary}
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </AnimatedCard>
        </View>

        {/* Submit Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { 
                backgroundColor: isSubmitting ? theme.colors.textSecondary : theme.colors.primary,
                opacity: isSubmitting ? 0.7 : 1
              }
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Send size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Query'}
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
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  infoCard: {
    marginBottom: 0,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: (width - 64) / 2,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    gap: 8,
  },
  categoryLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  priorityLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  inputCard: {
    marginBottom: 0,
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  textArea: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
