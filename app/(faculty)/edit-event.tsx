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
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { getEventById, updateEvent } from '@/utils/api';
import TopMenuBar from '@/components/TopMenuBar';
import NativeDatePicker from '@/components/NativeDatePicker';
import DocumentPicker from '@/components/DocumentPicker';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function EditEvent() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEventById(id as string);
        const event = response.data;
        
        const scheduledDate = event.scheduled_date ? new Date(event.scheduled_date) : null;
        
        setForm({
          title: event.name || '',
          description: event.description || '',
          date: scheduledDate,
          time: scheduledDate,
          deadlineDate: event.deadline_date ? new Date(event.deadline_date) : null,
          venue: event.venue || '',
          points: event.alloted_points?.toString() || '',
          berries: event.alloted_berries?.toString() || '0',
          capacity: event.capacity?.toString() || '',
          type: event.type || 'event',
          image: null,
        });
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  const handleFormChange = (key: string, value: string | Date | null) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!form.title.trim()) { setError('Title is required'); return false; }
    if (!form.description.trim()) { setError('Description is required'); return false; }
    if (!form.date) { setError('Date is required'); return false; }
    if (!form.venue.trim()) { setError('Venue is required'); return false; }
    if (!form.points || parseInt(form.points) <= 0) { setError('Valid points required'); return false; }
    if (!form.capacity || parseInt(form.capacity) <= 0) { setError('Valid capacity required'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    if (!validateForm()) return;

    setSaving(true);
    try {
      let dateTime: string;
      if (form.time && form.date) {
        const combinedDate = new Date(form.date);
        combinedDate.setHours(form.time.getHours(), form.time.getMinutes());
        dateTime = combinedDate.toISOString();
      } else if (form.date) {
        dateTime = form.date.toISOString();
      } else {
        dateTime = new Date().toISOString();
      }

      const eventData: Record<string, any> = {
        name: form.title.trim(),
        description: form.description.trim(),
        scheduled_date: dateTime,
        venue: form.venue.trim(),
        alloted_points: form.points,
        alloted_berries: form.berries || '0',
        capacity: form.capacity,
        type: form.type,
      };

      await updateEvent(id as string, eventData, form.image as any);

      Alert.alert('Success', 'Event updated successfully!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err: any) {
      console.error('Update event error:', err);
      setError(err.message || 'Failed to update event');
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
      <TopMenuBar title="Edit Event" subtitle="Modify existing college event" showBackButton={true} />
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 100, 120) }}>
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.colors.text }]}>Event Title *</Text>
            <TextInput value={form.title} onChangeText={v => handleFormChange('title', v)} style={[styles.formInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]} />
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.colors.text }]}>Description *</Text>
            <TextInput value={form.description} onChangeText={v => handleFormChange('description', v)} style={[styles.formInput, styles.textArea, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]} multiline numberOfLines={3} />
          </View>
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>Event Date *</Text>
              <NativeDatePicker value={form.date || undefined} onChange={(date) => handleFormChange('date', date)} mode="date" />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>Time</Text>
              <NativeDatePicker value={form.time || undefined} onChange={(time) => handleFormChange('time', time)} mode="time" />
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.colors.text }]}>Venue *</Text>
            <TextInput value={form.venue} onChangeText={v => handleFormChange('venue', v)} style={[styles.formInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]} />
          </View>
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>Points Reward *</Text>
              <TextInput value={form.points} onChangeText={v => handleFormChange('points', v)} style={[styles.formInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]} keyboardType="numeric" />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>Berries Reward</Text>
              <TextInput value={form.berries} onChangeText={v => handleFormChange('berries', v)} style={[styles.formInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]} keyboardType="numeric" />
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.colors.text }]}>Capacity *</Text>
            <TextInput value={form.capacity} onChangeText={v => handleFormChange('capacity', v)} style={[styles.formInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]} keyboardType="numeric" />
          </View>
          {error ? <Text style={{ color: theme.colors.error, marginBottom: 16 }}>{error}</Text> : null}
        </ScrollView>
        <View style={[styles.actionsContainer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border, paddingBottom: Math.max(insets.bottom + 16, 32) }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.actionButton}>
            <Text style={{ color: theme.colors.textSecondary }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={{ color: '#FFFFFF' }}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  keyboardContainer: { flex: 1 },
  formContainer: { flex: 1, paddingHorizontal: 20 },
  formGroup: { marginBottom: 16 },
  formRow: { flexDirection: 'row', gap: 12 },
  formLabel: { fontSize: 14, fontFamily: 'Inter-SemiBold', marginBottom: 6 },
  formInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, minHeight: 44 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  actionsContainer: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1 },
  actionButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ccc' },
});
