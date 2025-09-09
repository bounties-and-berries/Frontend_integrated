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
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { searchEvents, createEvent, updateEvent } from '@/utils/api';
import { Bounty } from '@/types';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Plus, Search, Calendar, MapPin, Users, CreditCard as Edit, Trash2, Award, Clock } from 'lucide-react-native';

// Enhanced DateInput component with calendar icon
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(value ? new Date(value) : new Date());

  const handleDateChange = (selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDate(selectedDate);
      onChange(formattedDate);
    }
  };

  const displayDate = value ? new Date(value).toLocaleDateString('en-US') : '';

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.dateInputContainer, { borderColor: theme.colors.border }]}>
        <Calendar size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
        <input 
          type="date" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="date-input"
          title={placeholder}
          aria-label={placeholder}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: theme.colors.text,
            fontSize: '14px',
            fontFamily: 'Inter-Regular'
          }}
        />
      </View>
    );
  }
  
  return (
    <View>
      <TouchableOpacity 
        style={[styles.dateInputContainer, { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border 
        }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Calendar size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
        <Text style={[styles.dateInputText, { 
          color: displayDate ? theme.colors.text : theme.colors.textSecondary 
        }]}>
          {displayDate || placeholder}
        </Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <View style={styles.datePickerOverlay}>
          <View style={styles.datePickerBackdrop} />
          <TouchableOpacity 
            style={styles.datePickerModalTouch}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          >
            <View
              style={[styles.datePickerContainer, { backgroundColor: theme.colors.card }]}
              onStartShouldSetResponder={() => true}
            >
              <Text style={[styles.datePickerTitle, { color: theme.colors.text }]}>Select Date</Text>
              
              <View style={styles.calendarContainer}>
                <View style={styles.calendarHeader}>
                  <TouchableOpacity 
                    style={styles.calendarNavButton}
                    onPress={() => {
                      const newDate = new Date(date);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setDate(newDate);
                    }}
                  >
                    <Text style={[styles.calendarNavText, { color: theme.colors.primary }]}>‹</Text>
                  </TouchableOpacity>
                  
                  <Text style={[styles.calendarHeaderText, { color: theme.colors.text }]}>
                    {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Text>
                  
                  <TouchableOpacity 
                    style={styles.calendarNavButton}
                    onPress={() => {
                      const newDate = new Date(date);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setDate(newDate);
                    }}
                  >
                    <Text style={[styles.calendarNavText, { color: theme.colors.primary }]}>›</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.calendarGrid}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <Text key={index} style={[styles.calendarDayHeader, { color: theme.colors.textSecondary }]}>
                      {day}
                    </Text>
                  ))}
                  
                  {(() => {
                    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    const startDate = new Date(firstDay);
                    startDate.setDate(startDate.getDate() - firstDay.getDay());
                    
                    const days = [];
                    for (let i = 0; i < 42; i++) {
                      const currentDate = new Date(startDate);
                      currentDate.setDate(startDate.getDate() + i);
                      const isCurrentMonth = currentDate.getMonth() === date.getMonth();
                      const isSelected = value && new Date(value).toDateString() === currentDate.toDateString();
                      
                      days.push(
                        <TouchableOpacity
                          key={i}
                          style={[
                            styles.calendarDay,
                            isSelected && { backgroundColor: theme.colors.primary },
                            !isCurrentMonth && styles.calendarDayInactive
                          ]}
                          onPress={() => {
                            if (isCurrentMonth) {
                              setDate(currentDate);
                              handleDateChange(currentDate);
                            }
                          }}
                        >
                          <Text style={[
                            styles.calendarDayText,
                            { color: isCurrentMonth ? theme.colors.text : theme.colors.textSecondary },
                            isSelected && { color: '#FFFFFF' },
                            !isCurrentMonth && { opacity: 0.3 }
                          ]}>
                            {currentDate.getDate()}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                    return days;
                  })()}
                </View>
              </View>
              
              <View style={styles.datePickerButtons}>
                <TouchableOpacity 
                  style={[styles.datePickerButton, { backgroundColor: theme.colors.surface }]}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={[styles.datePickerButtonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.datePickerButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => handleDateChange(date)}
                >
                  <Text style={[styles.datePickerButtonText, { color: '#FFFFFF' }]}>Select</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Enhanced TimeInput component with clock icon and AM/PM selector
const TimeInput = ({ 
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
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmpm] = useState('AM');

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      const hour24 = parseInt(h);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const period = hour24 >= 12 ? 'PM' : 'AM';
      
      setHour(hour12.toString().padStart(2, '0'));
      setMinute(m);
      setAmpm(period);
    }
  }, [value]);

  const handleTimeChange = () => {
    const hour24 = ampm === 'AM' 
      ? (hour === '12' ? 0 : parseInt(hour))
      : (hour === '12' ? 12 : parseInt(hour) + 12);
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${minute}`;
    onChange(timeString);
    setShowTimePicker(false);
  };

  const displayTime = value ? (() => {
    const [h, m] = value.split(':');
    const hour24 = parseInt(h);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${m} ${period}`;
  })() : '';

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.timeInputContainer, { borderColor: theme.colors.border }]}>
        <Clock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
        <input 
          type="time" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="time-input"
          title={placeholder}
          aria-label={placeholder}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: theme.colors.text,
            fontSize: '14px',
            fontFamily: 'Inter-Regular'
          }}
        />
      </View>
    );
  }
  
  return (
    <View>
      <TouchableOpacity 
        style={[styles.timeInputContainer, { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border 
        }]}
        onPress={() => setShowTimePicker(true)}
      >
        <Clock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
        <Text style={[styles.timeInputText, { 
          color: displayTime ? theme.colors.text : theme.colors.textSecondary 
        }]}>
          {displayTime || placeholder}
        </Text>
      </TouchableOpacity>
      
      {showTimePicker && (
        <View style={styles.timePickerOverlay}>
          <View style={styles.timePickerBackdrop} />
          <TouchableOpacity 
            style={styles.timePickerModalTouch}
            activeOpacity={1}
            onPress={() => setShowTimePicker(false)}
          >
            <View
              style={[styles.timePickerContainer, { backgroundColor: theme.colors.card }]}
              onStartShouldSetResponder={() => true}
            >
              <Text style={[styles.timePickerTitle, { color: theme.colors.text }]}>Select Time</Text>
              
              <View style={styles.timePickerContent}>
                <View style={styles.timePickerSection}>
                  <Text style={[styles.timePickerLabel, { color: theme.colors.text }]}>Hour</Text>
                  <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({length: 12}, (_, i) => i + 1).map((h) => (
                      <TouchableOpacity
                        key={h}
                        style={[styles.timePickerOption, {
                          backgroundColor: hour === h.toString().padStart(2, '0') ? theme.colors.primary : 'transparent'
                        }]}
                        onPress={() => setHour(h.toString().padStart(2, '0'))}
                      >
                        <Text style={[styles.timePickerOptionText, {
                          color: hour === h.toString().padStart(2, '0') ? '#FFFFFF' : theme.colors.text
                        }]}>
                          {h.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={styles.timePickerSection}>
                  <Text style={[styles.timePickerLabel, { color: theme.colors.text }]}>Minute</Text>
                  <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({length: 60}, (_, i) => i).filter(m => m % 5 === 0).map((m) => (
                      <TouchableOpacity
                        key={m}
                        style={[styles.timePickerOption, {
                          backgroundColor: minute === m.toString().padStart(2, '0') ? theme.colors.primary : 'transparent'
                        }]}
                        onPress={() => setMinute(m.toString().padStart(2, '0'))}
                      >
                        <Text style={[styles.timePickerOptionText, {
                          color: minute === m.toString().padStart(2, '0') ? '#FFFFFF' : theme.colors.text
                        }]}>
                          {m.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={styles.timePickerSection}>
                  <Text style={[styles.timePickerLabel, { color: theme.colors.text }]}>Period</Text>
                  <View style={styles.ampmContainer}>
                    {['AM', 'PM'].map((period) => (
                      <TouchableOpacity
                        key={period}
                        style={[styles.ampmButton, {
                          backgroundColor: ampm === period ? theme.colors.primary : theme.colors.surface
                        }]}
                        onPress={() => setAmpm(period)}
                      >
                        <Text style={[styles.ampmButtonText, {
                          color: ampm === period ? '#FFFFFF' : theme.colors.text
                        }]}>
                          {period}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              
              <View style={styles.timePickerButtons}>
                <TouchableOpacity 
                  style={[styles.timePickerButton, { backgroundColor: theme.colors.surface }]}
                  onPress={() => setShowTimePicker(false)}
                >
                  <Text style={[styles.timePickerButtonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.timePickerButton, { backgroundColor: theme.colors.primary }]}
                  onPress={handleTimeChange}
                >
                  <Text style={[styles.timePickerButtonText, { color: '#FFFFFF' }]}>Select</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function FacultyEvents() {
  const { theme } = useTheme();
  const screenHeight = Dimensions.get('window').height;
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Bounty | null>(null);
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
  const [editForm, setEditForm] = useState({
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
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Add CSS styles for web date and time inputs
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        .date-input, .time-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          font-family: 'Inter-Regular', sans-serif;
          width: 100%;
          color: inherit;
        }
        .date-input:focus, .time-input:focus {
          outline: none;
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

  const handleEditEvent = (eventId: number) => {
    const eventToEdit = events.find(event => event.id === eventId);
    if (eventToEdit) {
      setEditingEvent(eventToEdit);
      
      // Parse the scheduled_date to extract date and time
      const scheduledDate = new Date(eventToEdit.scheduled_date);
      const dateStr = scheduledDate.toISOString().split('T')[0];
      const timeStr = scheduledDate.toTimeString().split(' ')[0].substring(0, 5);
      
      setEditForm({
        title: eventToEdit.name,
        description: eventToEdit.description,
        date: dateStr,
        time: timeStr,
        deadlineDate: '',
        venue: eventToEdit.venue,
        points: eventToEdit.alloted_points.toString(),
        berries: eventToEdit.alloted_berries.toString(),
        capacity: eventToEdit.capacity.toString(),
        type: eventToEdit.type,
        image: null,
      });
      setShowEditModal(true);
    }
  };

  const handleDeleteEvent = (eventId: number) => {
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

  // --- Event Edit Form Handlers ---
  const handleEditFormChange = (name: string, value: any) => {
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditFileChange = (e: any) => {
    const file = Platform.OS === 'web' ? e.target.files[0] : e;
    setEditForm({ ...editForm, image: file });
  };

  const validateEditForm = () => {
    if (!editForm.title.trim()) {
      setEditError('Event title is required');
      return false;
    }
    if (!editForm.description.trim()) {
      setEditError('Event description is required');
      return false;
    }
    if (!editForm.date) {
      setEditError('Event date is required');
      return false;
    }
    if (!editForm.venue.trim()) {
      setEditError('Event venue is required');
      return false;
    }
    if (!editForm.points || parseInt(editForm.points) <= 0) {
      setEditError('Valid points value is required');
      return false;
    }
    if (!editForm.capacity || parseInt(editForm.capacity) <= 0) {
      setEditError('Valid capacity value is required');
      return false;
    }
    return true;
  };

  const handleEditSubmit = async () => {
    if (!editingEvent) return;
    
    setEditError('');
    
    if (!validateEditForm()) {
      return;
    }

    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', editForm.title.trim());
      formData.append('description', editForm.description.trim());
      
      // Combine date and time
      const dateTime = editForm.time 
        ? `${editForm.date}T${editForm.time}:00Z`
        : `${editForm.date}T00:00:00Z`;
      formData.append('date', dateTime);
      
      formData.append('venue', editForm.venue.trim());
      formData.append('points', editForm.points);
      formData.append('berries', editForm.berries || '0');
      formData.append('capacity', editForm.capacity);
      formData.append('type', editForm.type);
      
      if (editForm.image) formData.append('image', editForm.image);
      
      console.log('Updating event with data:', {
        id: editingEvent.id,
        title: editForm.title,
        description: editForm.description,
        date: dateTime,
        venue: editForm.venue,
        points: editForm.points,
        berries: editForm.berries,
        capacity: editForm.capacity,
        type: editForm.type
      });
      
      const result = await updateEvent(editingEvent.id.toString(), formData);
      console.log('Update event result:', result);
      
      setShowEditModal(false);
      setEditingEvent(null);
      resetEditForm();
      fetchEvents();
      Alert.alert('Success', 'Event updated successfully!');
    } catch (err: any) {
      console.error('Update event error:', err);
      setEditError(err.message || 'Failed to update event');
    } finally {
      setEditLoading(false);
    }
  };

  const resetEditForm = () => {
    setEditForm({ 
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
    setEditError('');
    setEditingEvent(null);
  };
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

      {/* Create Event Modal - Custom Overlay for Android Compatibility */}
      {showCreateModal && (
        <View style={[styles.customModalOverlay, { backgroundColor: theme.colors.background }]}>
          <KeyboardAvoidingView 
            style={[styles.customModalContainer, { paddingTop: Platform.OS === 'android' ? statusBarHeight + 40 : 40 }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <TouchableOpacity 
              style={styles.customModalBackdrop}
              activeOpacity={1}
              onPress={() => {
                setShowCreateModal(false);
                resetForm();
              }}
            >
              <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.customModalContentWrapper}>
                <View style={[styles.customModalContent, { backgroundColor: theme.colors.card }]}>
                  <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Create New Event</Text>
                  
                  <ScrollView 
                    style={styles.formContainer} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
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
                  <TimeInput 
                    value={createForm.time} 
                    onChange={v => handleCreateFormChange('time', v)} 
                    placeholder="Select time"
                    theme={theme}
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
              </TouchableOpacity>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      )}

      {/* Edit Event Modal - Custom Overlay for Android Compatibility */}
      {showEditModal && editingEvent && (
        <View style={[styles.customModalOverlay, { backgroundColor: theme.colors.background }]}>
          <KeyboardAvoidingView 
            style={[styles.customModalContainer, { paddingTop: Platform.OS === 'android' ? statusBarHeight + 40 : 40 }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <TouchableOpacity 
              style={styles.customModalBackdrop}
              activeOpacity={1}
              onPress={() => {
                setShowEditModal(false);
                resetEditForm();
              }}
            >
              <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.customModalContentWrapper}>
                <View style={[styles.customModalContent, { backgroundColor: theme.colors.card }]}>
                  <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Edit Event</Text>
                  
                  <ScrollView 
                    style={styles.formContainer} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    <View style={styles.formGroup}>
                      <Text style={[styles.formLabel, { color: theme.colors.text }]}>Event Title *</Text>
                      <TextInput 
                        placeholder="Enter event title"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={editForm.title} 
                        onChangeText={v => handleEditFormChange('title', v)} 
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
                        value={editForm.description} 
                        onChangeText={v => handleEditFormChange('description', v)} 
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
                          value={editForm.date} 
                          onChange={v => handleEditFormChange('date', v)} 
                          placeholder="YYYY-MM-DD"
                          theme={theme}
                        />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={[styles.formLabel, { color: theme.colors.text }]}>Time (Optional)</Text>
                        <TimeInput 
                          value={editForm.time} 
                          onChange={v => handleEditFormChange('time', v)} 
                          placeholder="Select time"
                          theme={theme}
                        />
                      </View>
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={[styles.formLabel, { color: theme.colors.text }]}>Deadline Date (Optional)</Text>
                      <DateInput 
                        value={editForm.deadlineDate} 
                        onChange={v => handleEditFormChange('deadlineDate', v)} 
                        placeholder="YYYY-MM-DD"
                        theme={theme}
                      />
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={[styles.formLabel, { color: theme.colors.text }]}>Venue *</Text>
                      <TextInput 
                        placeholder="Enter event venue"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={editForm.venue} 
                        onChangeText={v => handleEditFormChange('venue', v)} 
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
                          value={editForm.points} 
                          onChangeText={v => handleEditFormChange('points', v)} 
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
                          value={editForm.berries} 
                          onChangeText={v => handleEditFormChange('berries', v)} 
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
                        value={editForm.capacity} 
                        onChangeText={v => handleEditFormChange('capacity', v)} 
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
                                backgroundColor: editForm.type === type 
                                  ? theme.colors.primary 
                                  : theme.colors.surface,
                                borderColor: theme.colors.border,
                              }
                            ]}
                            onPress={() => handleEditFormChange('type', type)}
                          >
                            <Text style={[
                              styles.typeButtonText,
                              { 
                                color: editForm.type === type 
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
                          onChange={handleEditFileChange} 
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

                    {editError ? (
                      <View style={styles.errorContainer}>
                        <Text style={[styles.errorText, { color: theme.colors.error }]}>{editError}</Text>
                      </View>
                    ) : null}
                  </ScrollView>

                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      onPress={() => {
                        setShowEditModal(false);
                        resetEditForm();
                      }} 
                      style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    >
                      <Text style={[styles.modalButtonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={handleEditSubmit} 
                      style={[styles.modalButton, styles.submitButton, { backgroundColor: theme.colors.primary }]} 
                      disabled={editLoading}
                    >
                      <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                        {editLoading ? 'Updating...' : 'Update Event'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      )}

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
                          onPress={() => handleEditEvent(event.id)}
                        >
                          <Edit size={16} color={theme.colors.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.colors.error + '20' }]}
                          onPress={() => handleDeleteEvent(event.id)}
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
  // Custom Modal Styles for Android Compatibility
  customModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  customModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'android' ? 60 : 40,
  },
  customModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customModalContentWrapper: {
    width: '100%',
    maxHeight: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customModalContent: {
    padding: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: Platform.OS === 'android' ? 340 : 400,
    maxHeight: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    maxHeight: Platform.OS === 'android' ? 320 : 380,
    paddingBottom: 10,
    marginBottom: 10,
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
    paddingTop: Platform.OS === 'android' ? 10 : 0,
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
  // Date and Time Picker Styles
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  inputIcon: {
    marginRight: 4,
  },
  dateInputText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  timeInputText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  // Date Picker Overlay Styles
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
  },
  datePickerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  datePickerModalTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  // Time Picker Overlay Styles
  timePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
  },
  timePickerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  timePickerModalTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  datePickerContainer: {
    padding: Platform.OS === 'android' ? 16 : 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: Platform.OS === 'android' ? 320 : 350,
    minHeight: Platform.OS === 'android' ? 380 : 420,
    elevation: Platform.OS === 'android' ? 8 : 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Platform.OS === 'android' ? 4 : 2 },
    shadowOpacity: Platform.OS === 'android' ? 0.3 : 0.25,
    shadowRadius: Platform.OS === 'android' ? 4.65 : 3.84,
  },
  datePickerTitle: {
    fontSize: Platform.OS === 'android' ? 16 : 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: Platform.OS === 'android' ? 16 : 20,
  },
  datePickerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  datePickerButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  // Calendar Styles
  calendarContainer: {
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  calendarNavButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  calendarNavText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calendarHeaderText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calendarDayHeader: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    paddingVertical: 8,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginVertical: 1,
  },
  calendarDayInactive: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  // Time Picker Modal Styles
  timePickerContainer: {
    padding: Platform.OS === 'android' ? 16 : 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: Platform.OS === 'android' ? 320 : 350,
    maxHeight: Platform.OS === 'android' ? '80%' : '70%',
    elevation: Platform.OS === 'android' ? 8 : 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Platform.OS === 'android' ? 4 : 2 },
    shadowOpacity: Platform.OS === 'android' ? 0.3 : 0.25,
    shadowRadius: Platform.OS === 'android' ? 4.65 : 3.84,
  },
  timePickerTitle: {
    fontSize: Platform.OS === 'android' ? 16 : 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: Platform.OS === 'android' ? 16 : 20,
  },
  timePickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Platform.OS === 'android' ? 12 : 16,
    marginBottom: Platform.OS === 'android' ? 16 : 20,
  },
  timePickerSection: {
    flex: 1,
    alignItems: 'center',
  },
  timePickerLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  timePickerScroll: {
    maxHeight: Platform.OS === 'android' ? 100 : 120,
    width: '100%',
  },
  timePickerOption: {
    paddingVertical: Platform.OS === 'android' ? 10 : 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 2,
    alignItems: 'center',
    minHeight: Platform.OS === 'android' ? 36 : 32,
  },
  timePickerOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  ampmContainer: {
    gap: 8,
  },
  ampmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  ampmButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  timePickerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  timePickerButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  timePickerButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});