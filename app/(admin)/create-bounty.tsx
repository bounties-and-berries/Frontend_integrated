import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Calendar, MapPin, Users, Award, Camera, Plus } from 'lucide-react-native';

const categories = [
  { id: 'academic', label: 'Academic', color: '#6366F1' },
  { id: 'cultural', label: 'Cultural', color: '#8B5CF6' },
  { id: 'volunteer', label: 'Volunteer', color: '#10B981' },
  { id: 'sports', label: 'Sports', color: '#F59E0B' },
];

export default function CreateBounty() {
  const { theme } = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    location: '',
    berries: '',
    registrationDeadline: '',
    maxParticipants: '',
    image: '',
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.category || !formData.date || !formData.location || !formData.berries) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Create Bounty',
      'Are you sure you want to create this bounty?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create', 
          onPress: () => {
            Alert.alert('Success', 'Bounty created successfully!');
            router.back();
          }
        }
      ]
    );
  };

  const handleImageUpload = () => {
    Alert.alert('Upload Image', 'Image upload functionality will be available soon.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Create Bounty"
        subtitle="Set up a new activity for students"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Basic Information
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Bounty Title *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Enter bounty title"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.title}
              onChangeText={(text) => setFormData({...formData, title: text})}
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
              placeholder="Describe the bounty activity..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Category *
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
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
              ))}
            </View>
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Bounty Details
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Date *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.date}
              onChangeText={(text) => setFormData({...formData, date: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Location *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Enter location"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
            />
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
              Registration Deadline
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.registrationDeadline}
              onChangeText={(text) => setFormData({...formData, registrationDeadline: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Max Participants
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Enter maximum participants"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
              value={formData.maxParticipants}
              onChangeText={(text) => setFormData({...formData, maxParticipants: text})}
            />
          </View>
        </View>

        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Bounty Image
          </Text>
          
          <TouchableOpacity 
            style={[styles.uploadButton, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border 
            }]}
            onPress={handleImageUpload}
          >
            <Camera size={32} color={theme.colors.primary} />
            <Text style={[styles.uploadText, { color: theme.colors.primary }]}>
              Upload Bounty Image
            </Text>
            <Text style={[styles.uploadSubtext, { color: theme.colors.textSecondary }]}>
              Add an attractive image for your bounty
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSubmit}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Create Bounty</Text>
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
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: 12,
  },
  uploadText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  uploadSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
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