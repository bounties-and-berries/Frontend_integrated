import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { createEvent } from '@/utils/api';
import TopMenuBar from '@/components/TopMenuBar';
import NativeDatePicker from '@/components/NativeDatePicker';
import DocumentPicker from '@/components/DocumentPicker';
import { useRouter } from 'expo-router';

export default function CreateEvent() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    date: null as Date | null,
    time: null as Date | null,
    deadlineDate: null as Date | null,
    venue: '',
    points: '',
    berries: '',
    capacity: '',
    type: 'event',
    image: null as File | null,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // Form change handler
  const handleFormChange = (key: string, value: string | Date | null) => {
    setCreateForm(prev => ({ ...prev, [key]: value }));
    if (createError) setCreateError(''); // Clear error when user makes changes
  };

  const validateForm = () => {
    if (!createForm.title.trim()) {
      setCreateError('Event title is required');
      return false;
    }
    if (!createForm.description.trim()) {
      setCreateError('Event description is required');
      return false;
    }
    if (!createForm.date) {
      setCreateError('Event date is required');
      return false;
    }
    if (!createForm.venue.trim()) {
      setCreateError('Event venue is required');
      return false;
    }
    if (!createForm.points || parseInt(createForm.points) <= 0) {
      setCreateError('Valid points value is required');
      return false;
    }
    if (!createForm.capacity || parseInt(createForm.capacity) <= 0) {
      setCreateError('Valid capacity value is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setCreateError('');
    
    if (!validateForm()) {
      return;
    }

    // Add haptic feedback
    if (Platform.OS !== 'web') {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setCreateLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', createForm.title.trim());
      formData.append('description', createForm.description.trim());
      
      // Combine date and time
      let dateTime: string;
      if (createForm.time && createForm.date) {
        const combinedDate = new Date(createForm.date);
        combinedDate.setHours(createForm.time.getHours(), createForm.time.getMinutes());
        dateTime = combinedDate.toISOString();
      } else if (createForm.date) {
        dateTime = createForm.date.toISOString();
      } else {
        dateTime = new Date().toISOString();
      }
      formData.append('date', dateTime);
      
      formData.append('venue', createForm.venue.trim());
      formData.append('points', createForm.points);
      formData.append('berries', createForm.berries || '0');
      formData.append('capacity', createForm.capacity);
      formData.append('type', createForm.type);
      
      if (createForm.image) formData.append('image', createForm.image);
      
      const result = await createEvent(formData);
      
      Alert.alert(
        'Success', 
        'Event created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (err: any) {
      console.error('Create event error:', err);
      setCreateError(err.message || 'Failed to create event');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCancel = () => {
    if (Platform.OS !== 'web') {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Create Event"
        subtitle="Create a new college event"
        showBackButton={true}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          style={styles.formContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: Math.max(insets.bottom + 100, 120) 
          }}
        >
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.colors.text }]}>Event Title *</Text>
            <TextInput 
              placeholder="Enter event title"
              placeholderTextColor={theme.colors.textSecondary}
              value={createForm.title} 
              onChangeText={v => handleFormChange('title', v)} 
              style={[styles.formInput, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }]} 
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.colors.text }]}>Description *</Text>
            <TextInput 
              placeholder="Enter event description"
              placeholderTextColor={theme.colors.textSecondary}
              value={createForm.description} 
              onChangeText={v => handleFormChange('description', v)} 
              style={[styles.formInput, styles.textArea, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }]} 
              multiline 
              numberOfLines={3} 
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>Event Date *</Text>
              <NativeDatePicker
                value={createForm.date || undefined}
                onChange={(date) => handleFormChange('date', date)}
                placeholder="Select event date"
                mode="date"
                minimumDate={new Date()}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }}
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>Time (Optional)</Text>
              <NativeDatePicker
                value={createForm.time || undefined}
                onChange={(time) => handleFormChange('time', time)}
                placeholder="Select time"
                mode="time"
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.colors.text }]}>Deadline Date (Optional)</Text>
            <NativeDatePicker
              value={createForm.deadlineDate || undefined}
              onChange={(date) => handleFormChange('deadlineDate', date)}
              placeholder="Select deadline date"
              mode="date"
              minimumDate={new Date()}
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              }}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.colors.text }]}>Venue *</Text>
            <TextInput 
              placeholder="Enter event venue"
              placeholderTextColor={theme.colors.textSecondary}
              value={createForm.venue} 
              onChangeText={v => handleFormChange('venue', v)} 
              style={[styles.formInput, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }]} 
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>Points Reward *</Text>
              <TextInput 
                placeholder="100"
                placeholderTextColor={theme.colors.textSecondary}
                value={createForm.points} 
                onChangeText={v => handleFormChange('points', v)} 
                style={[styles.formInput, { 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }]} 
                keyboardType="numeric" 
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>Berries Reward (Optional)</Text>
              <TextInput 
                placeholder="50"
                placeholderTextColor={theme.colors.textSecondary}
                value={createForm.berries} 
                onChangeText={v => handleFormChange('berries', v)} 
                style={[styles.formInput, { 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }]} 
                keyboardType="numeric" 
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.colors.text }]}>Capacity *</Text>
            <TextInput 
              placeholder="50"
              placeholderTextColor={theme.colors.textSecondary}
              value={createForm.capacity} 
              onChangeText={v => handleFormChange('capacity', v)} 
              style={[styles.formInput, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }]} 
              keyboardType="numeric" 
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.colors.text }]}>Event Type</Text>
            <View style={styles.typeButtons}>
              {['event', 'competition', 'workshop', 'seminar'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor: createForm.type === type 
                        ? theme.colors.primary 
                        : theme.colors.surface,
                      borderColor: theme.colors.border,
                    }
                  ]}
                  onPress={() => handleFormChange('type', type)}
                >
                  <Text style={[
                    styles.typeButtonText,
                    { 
                      color: createForm.type === type 
                        ? '#FFFFFF' 
                        : theme.colors.textSecondary 
                    }
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.colors.text }]}>Event Image (Optional)</Text>
            <DocumentPicker
              onFileSelected={(file) => handleFormChange('image', file)}
              acceptedTypes={['png', 'jpg', 'jpeg', 'gif']}
              maxSizeBytes={5 * 1024 * 1024} // 5MB
              placeholder="Select event image"
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              }}
            />
          </View>

          {createError ? (
            <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{createError}</Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={[styles.actionsContainer, { 
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          paddingBottom: Math.max(insets.bottom + 16, 32)
        }]}>
          <TouchableOpacity 
            onPress={handleCancel} 
            style={[styles.actionButton, styles.cancelButton, { 
              backgroundColor: theme.colors.surface, 
              borderColor: theme.colors.border 
            }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionButtonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleSubmit} 
            style={[styles.actionButton, styles.submitButton, { backgroundColor: theme.colors.primary }]} 
            disabled={createLoading}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
              {createLoading ? 'Creating...' : 'Create Event'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    width: '100%',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    minHeight: 44,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  typeButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  errorContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButton: {},
  submitButton: {},
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});