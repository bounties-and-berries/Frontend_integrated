import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { searchEvents } from '@/utils/api';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Plus, Search, Calendar, MapPin, Users, CreditCard as Edit, Trash2, Eye } from 'lucide-react-native';

export default function AdminEvents() {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    router.push('/(admin)/create-bounty' as any);
  };

  const handleViewDetails = (eventId: string) => {
    router.push(`/(admin)/bounty-details?id=${eventId}` as any);
  };

  const handleEditEvent = (eventId: string) => {
    Alert.alert('Edit Bounty', `Edit bounty ${eventId} - Feature coming soon.`);
  };

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Delete Bounty',
      'Are you sure you want to delete this bounty?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setEvents(prev => prev.filter(event => event.id !== eventId));
            Alert.alert('Success', 'Bounty deleted successfully!');
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="Bounty Management"
        subtitle="Create and manage college bounties"
      />

      {/* Create Button */}
      <View style={styles.createButtonContainer}>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleCreateEvent}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create Bounty</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search bounties..."
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
            <View style={{ alignItems: 'center', padding: 20 }}>
              <Text style={{ color: theme.colors.textSecondary }}>Loading events...</Text>
            </View>
          ) : error ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <Text style={{ color: theme.colors.error }}>{error}</Text>
            </View>
          ) : filteredEvents.length === 0 ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <Text style={{ color: theme.colors.textSecondary }}>No events found.</Text>
            </View>
          ) : (
            filteredEvents.map((event: any) => (
              <AnimatedCard key={event.id} style={styles.eventCard}>
                <View style={styles.eventContent}>
                  <Image source={{ uri: event.img_url || '' }} style={styles.eventImage} />
                  
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
                          style={[styles.actionButton, { backgroundColor: theme.colors.primary + '20' }]}
                          onPress={() => handleViewDetails(event.id)}
                        >
                          <Eye size={16} color={theme.colors.primary} />
                        </TouchableOpacity>
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
                    
                    <Text style={[styles.eventTitle, { color: theme.colors.text }]}>
                      {event.name}
                    </Text>
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
                      <View style={styles.pointsBadge}>
                        <Text style={[styles.pointsText, { color: theme.colors.accent }]}>
                          {event.alloted_points} berries
                        </Text>
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
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContent: {
    alignItems: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
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
  pointsBadge: {
    backgroundColor: '#F59E0B20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pointsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  registrationStatus: {},
  registrationText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
});