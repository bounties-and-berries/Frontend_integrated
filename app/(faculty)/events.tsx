import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { searchEvents, createEvent } from '@/utils/api';
import { Bounty } from '@/types';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Plus, Search, Calendar, MapPin, Users, CreditCard as Edit, Trash2, Award } from 'lucide-react-native';

// DateInput component that handles web/mobile differences
const DateInput = ({ 
  value, 
  onChange, 
  placeholder, 
  theme 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder: string;
  theme: any;
}) => {
  if (Platform.OS === 'web') {
    return (
      <input 
        type="date" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="date-input"
        title={placeholder}
        aria-label={placeholder}
      />
    );
  }
  
  return (
    <TextInput 
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textSecondary}
      value={value} 
      onChangeText={onChange} 
      style={[styles.formInput, { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        color: theme.colors.text
      }]} 
    />
  );
};

export default function FacultyEvents() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    deadlineDate: '',
    venue: '',
    points: '',
    berries: '',
    capacity: '',
    type: 'event',
    image: null as File | null,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // Add CSS styles for web date inputs
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        .date-input {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 14px;
          font-family: 'Inter-Regular', sans-serif;
          width: 100%;
          background-color: #f8f9fa;
          color: #333;
        }
        .date-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
      `;
      document.head.appendChild(style);
      
      // Cleanup function to remove the style when component unmounts
      return () => {
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      };
    }
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    const filters: any = {
      filters: {
        status: 'upcoming',
        name: searchQuery || undefined,
      },
      sortBy: 'scheduled_date',
      sortOrder: 'asc',
      pageNumber: 1,
      pageSize: 50,
    };
    try {
      const res = await searchEvents(filters);
      setEvents(res.results || []);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);
  
  const filteredEvents = events;

  const handleCreateEvent = () => {
    setShowCreateModal(true);
  };

  const handleEditEvent = (eventId: string) => {
    Alert.alert('Edit Event', `Edit event ${eventId} - Feature coming soon.`);
  };

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setEvents(prev => prev.filter(event => event.id !== eventId));
            Alert.alert('Success', 'Event deleted successfully!');
          }
        }
      ]
    );
  };

  // --- Event Creation Form Handlers ---
  const handleCreateFormChange = (name: string, value: any) => {
    setCreateForm({ ...createForm, [name]: value });
  };

  const handleCreateFileChange = (e: any) => {
    const file = Platform.OS === 'web' ? e.target.files[0] : e;
    setCreateForm({ ...createForm, image: file });
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

  const handleCreateSubmit = async () => {
    setCreateError('');
    
    if (!validateForm()) {
      return;
    }

    setCreateLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', createForm.title.trim());
      formData.append('description', createForm.description.trim());
      
      // Combine date and time
      const dateTime = createForm.time 
        ? `${createForm.date}T${createForm.time}:00Z`
        : `${createForm.date}T00:00:00Z`;
      formData.append('date', dateTime);
      
      formData.append('venue', createForm.venue.trim());
      formData.append('points', createForm.points);
      formData.append('berries', createForm.berries || '0');
      formData.append('capacity', createForm.capacity);
      formData.append('type', createForm.type);
      
      if (createForm.image) formData.append('image', createForm.image);
      
      console.log('Submitting form data:', {
        title: createForm.title,
        description: createForm.description,
        date: dateTime,
        venue: createForm.venue,
        points: createForm.points,
        berries: createForm.berries,
        capacity: createForm.capacity,
        type: createForm.type
      });
      
      const result = await createEvent(formData);
      console.log('Create event result:', result);
      
      setShowCreateModal(false);
      setCreateForm({ 
        title: '', 
        description: '', 
        date: '', 
        time: '',
        deadlineDate: '',
        venue: '', 
        points: '', 
        berries: '',
        capacity: '',
        type: 'event',
        image: null 
      });
      fetchEvents();
      Alert.alert('Success', 'Event created successfully!');
    } catch (err: any) {
      console.error('Create event error:', err);
      setCreateError(err.message || 'Failed to create event');
    } finally {
      setCreateLoading(false);
    }
  };

  const resetForm = () => {
    setCreateForm({ 
      title: '', 
      description: '', 
      date: '', 
      time: '',
      deadlineDate: '',
      venue: '', 
      points: '', 
      berries: '',
      capacity: '',
      type: 'event',
      image: null 
    });
    setCreateError('');
  };



  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="Event Management"
        subtitle="Create and manage college events"
      />

      {/* Create Button */}
      <View style={styles.createButtonContainer}>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleCreateEvent}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create Event</Text>
        </TouchableOpacity>
      </View>

      {/* Create Event Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Create New Event</Text>
            
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.colors.text }]}>Event Title *</Text>
                <TextInput 
                  placeholder="Enter event title"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={createForm.title} 
                  onChangeText={v => handleCreateFormChange('title', v)} 
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
                  onChangeText={v => handleCreateFormChange('description', v)} 
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
                  <DateInput 
                    value={createForm.date} 
                    onChange={v => handleCreateFormChange('date', v)} 
                    placeholder="YYYY-MM-DD"
                    theme={theme}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: theme.colors.text }]}>Time (Optional)</Text>
                  <TextInput 
                    placeholder="HH:MM"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={createForm.time} 
                    onChangeText={v => handleCreateFormChange('time', v)} 
                    style={[styles.formInput, { 
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }]} 
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.colors.text }]}>Deadline Date (Optional)</Text>
                <DateInput 
                  value={createForm.deadlineDate} 
                  onChange={v => handleCreateFormChange('deadlineDate', v)} 
                  placeholder="YYYY-MM-DD"
                  theme={theme}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.colors.text }]}>Venue *</Text>
                <TextInput 
                  placeholder="Enter event venue"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={createForm.venue} 
                  onChangeText={v => handleCreateFormChange('venue', v)} 
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
                    onChangeText={v => handleCreateFormChange('points', v)} 
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
                    onChangeText={v => handleCreateFormChange('berries', v)} 
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
                  onChangeText={v => handleCreateFormChange('capacity', v)} 
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
                      onPress={() => handleCreateFormChange('type', type)}
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

              {Platform.OS === 'web' ? (
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.colors.text }]}>Event Image (Optional)</Text>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleCreateFileChange} 
                    style={styles.fileInput}
                    title="Select event image"
                    aria-label="Select event image"
                  />
                </View>
              ) : (
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.colors.text }]}>Event Image (Optional)</Text>
                  <TouchableOpacity 
                    onPress={() => {/* Use image picker for mobile */}} 
                    style={[styles.imagePickerButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                  >
                    <Text style={[styles.imagePickerText, { color: theme.colors.textSecondary }]}>Select Image</Text>
                  </TouchableOpacity>
                </View>
              )}

              {createError ? (
                <View style={styles.errorContainer}>
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>{createError}</Text>
                </View>
              ) : null}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                onPress={() => {
                  setShowCreateModal(false);
                  resetForm();
                }} 
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleCreateSubmit} 
                style={[styles.modalButton, styles.submitButton, { backgroundColor: theme.colors.primary }]} 
                disabled={createLoading}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  {createLoading ? 'Creating...' : 'Create Event'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search events..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Events List */}
      <ScrollView 
        style={styles.eventsList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.eventsContainer}>
          {loading ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>Loading events...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: theme.colors.error }]}>{error}</Text>
            </View>
          ) : filteredEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>No events found.</Text>
            </View>
          ) : (
            filteredEvents.map((event: Bounty) => (
              <AnimatedCard key={event.id} style={styles.eventCard}>
                <View style={styles.eventContent}>
                  {event.img_url && (
                    <Image source={{ uri: event.img_url }} style={styles.eventImage} />
                  )}
                  <View style={styles.eventInfo}>
                    <View style={styles.eventHeader}>
                      <View style={[
                        styles.categoryTag,
                        { backgroundColor: theme.colors.primary + '20' }
                      ]}>
                        <Text style={[styles.categoryTagText, { color: theme.colors.primary }]}> 
                          {event.type} 
                        </Text>
                      </View>
                      <View style={styles.eventActions}>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.colors.secondary + '20' }]}
                          onPress={() => handleEditEvent(event.id.toString())}
                        >
                          <Edit size={16} color={theme.colors.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.colors.error + '20' }]}
                          onPress={() => handleDeleteEvent(event.id.toString())}
                        >
                          <Trash2 size={16} color={theme.colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={[styles.eventTitle, { color: theme.colors.text }]}>{event.name}</Text>
                    <Text style={[styles.eventDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                      {event.description}
                    </Text>
                    <View style={styles.eventDetails}>
                      <View style={styles.eventDetail}>
                        <Calendar size={16} color={theme.colors.textSecondary} />
                        <Text style={[styles.eventDetailText, { color: theme.colors.textSecondary }]}>
                          {event.scheduled_date ? new Date(event.scheduled_date).toLocaleDateString() : ''}
                        </Text>
                      </View>
                      <View style={styles.eventDetail}>
                        <MapPin size={16} color={theme.colors.textSecondary} />
                        <Text style={[styles.eventDetailText, { color: theme.colors.textSecondary }]}>
                          {event.venue}
                        </Text>
                      </View>
                      <View style={styles.eventDetail}>
                        <Users size={16} color={theme.colors.textSecondary} />
                        <Text style={[styles.eventDetailText, { color: theme.colors.textSecondary }]}>
                          {event.current_participants || 0}/{event.capacity || 0}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.eventFooter}>
                      <View style={styles.pointsContainer}>
                        <View style={styles.pointsBadge}>
                          <Award size={12} color={theme.colors.accent} />
                          <Text style={[styles.pointsText, { color: theme.colors.accent }]}>
                            {event.alloted_points} pts
                          </Text>
                        </View>
                        {event.alloted_berries > 0 && (
                          <View style={styles.berriesBadge}>
                            <Text style={[styles.berriesText, { color: theme.colors.success }]}>
                              {event.alloted_berries} berries
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.registrationStatus}>
                        <Text style={[
                          styles.registrationText,
                          { 
                            color: event.scheduled_date && new Date(event.scheduled_date) > new Date() 
                              ? theme.colors.success 
                              : theme.colors.error 
                          }
                        ]}>
                          {event.scheduled_date && new Date(event.scheduled_date) > new Date() 
                            ? 'Registration Open' 
                            : 'Registration Closed'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </AnimatedCard>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  eventsList: {
    flex: 1,
  },
  eventsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  eventCard: {
    marginBottom: 0,
  },
  eventContent: {
    gap: 12,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  eventInfo: {
    gap: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  eventDetails: {
    gap: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pointsBadge: {
    backgroundColor: '#F59E0B20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  berriesBadge: {
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  berriesText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  registrationStatus: {},
  registrationText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 24,
    borderRadius: 12,
    width: 400,
    maxWidth: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    maxHeight: 400,
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
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
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
  fileInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
  },
  imagePickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  imagePickerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButton: {},
  submitButton: {},
  modalButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});