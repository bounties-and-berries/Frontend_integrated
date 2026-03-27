import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { mockAchievements, mockEvents } from '@/data/mockData';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { CheckCircle, Circle as XCircle, Clock, FileText, Calendar, Users, MapPin, Star, Cherry, Eye } from 'lucide-react-native';
import { getAllEventsAdmin } from '@/utils/api';

const { width } = Dimensions.get('window');

const filterOptions = ['All', 'Pending', 'Approved', 'Rejected'];

interface Event {
  id: number;
  name: string;
  description: string;
  type: string;
  alloted_points: number;
  alloted_berries: number;
  scheduled_date: string;
  venue: string;
  capacity: number;
  is_active: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

interface StudentRequest {
  id: string;
  studentName: string;
  studentId: string;
  title: string;
  description: string;
  points: number;
  berries: number;
  date: string;
  proofUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function FacultyApprovals() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('Pending');
  const [activeSection, setActiveSection] = useState('events'); // 'events' or 'requests'
  const [events, setEvents] = useState<Event[]>([]);
  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>(mockAchievements.map(achievement => ({
    id: achievement.id,
    studentName: 'Alice Johnson',
    studentId: 'STU001',
    title: achievement.title,
    description: achievement.description,
    points: achievement.points,
    berries: 0,
    date: achievement.date,
    proofUrl: achievement.proofUrl,
    status: (achievement.status || 'pending') as 'pending' | 'approved' | 'rejected'
  })));

  // Only show back button when navigating from top menu
  const shouldShowBackButton = params.fromMenu === 'true';

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getAllEventsAdmin();
        // Convert events to events format with status
        const eventsWithStatus = events.map((event: any) => ({
          ...event,
          status: 'pending' // Default status, in real app this would come from API
        }));
        setEvents(eventsWithStatus);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Fallback to mock data
        setEvents(mockEvents.map(event => ({
          id: parseInt(event.id),
          name: event.name,
          description: event.description || '',
          type: event.category,
          alloted_points: event.points || 0,
          alloted_berries: 0,
          scheduled_date: event.date || '',
          venue: event.location || '',
          capacity: event.maxParticipants || 0,
          is_active: true,
          status: 'pending'
        })));
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    if (selectedFilter === 'All') return true;
    return event.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  const filteredStudentRequests = studentRequests.filter(request => {
    if (selectedFilter === 'All') return true;
    return request.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleApproveEvent = (eventId: number) => {
    Alert.alert(
      'Approve Event',
      'Are you sure you want to approve this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            setEvents(prev =>
              prev.map(event =>
                event.id === eventId
                  ? { ...event, status: 'approved' }
                  : event
              )
            );
            Alert.alert('Success', 'Event approved successfully!');
          }
        }
      ]
    );
  };

  const handleRejectEvent = (eventId: number) => {
    Alert.alert(
      'Reject Event',
      'Are you sure you want to reject this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setEvents(prev =>
              prev.map(event =>
                event.id === eventId
                  ? { ...event, status: 'rejected' }
                  : event
              )
            );
            Alert.alert('Success', 'Event rejected.');
          }
        }
      ]
    );
  };

  // Handle review button click for student requests
  const handleReviewRequest = (request: StudentRequest) => {
    router.push({
      pathname: '/(faculty)/review-student-request',
      params: {
        requestId: request.id,
        studentName: request.studentName,
        studentId: request.studentId,
        studentClass: 'Class A', // In real app, this would come from API
        studentDepartment: 'Computer Science', // In real app, this would come from API
        title: request.title,
        description: request.description,
        points: request.points.toString(),
        berries: request.berries.toString(),
        date: request.date,
        proofUrl: request.proofUrl,
        activityType: 'Academic Activity' // In real app, this would come from API
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} color={theme.colors.success} />;
      case 'rejected':
        return <XCircle size={20} color={theme.colors.error} />;
      default:
        return <Clock size={20} color={theme.colors.warning} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return theme.colors.success;
      case 'rejected':
        return theme.colors.error;
      default:
        return theme.colors.warning;
    }
  };

  // Notification counts
  const pendingEventsCount = events.filter(e => e.status === 'pending').length;
  const pendingRequestsCount = studentRequests.filter(r => r.status === 'pending').length;

  // Handle review button click - navigate to full screen review page
  const handleReviewEvent = (event: Event) => {
    router.push({
      pathname: '/(faculty)/review-bounty',
      params: {
        bountyId: event.id.toString(),
        bountyName: event.name,
        bountyDescription: event.description,
        bountyDate: event.scheduled_date,
        bountyVenue: event.venue,
        bountyPoints: event.alloted_points.toString(),
        bountyCapacity: event.capacity.toString()
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, flex: 1 }]}>
      <TopMenuBar
        title="Approvals"
        subtitle="Review and approve events and student requests"
        showBackButton={shouldShowBackButton}
      />

      {/* Section Navigation with Notification Badges */}
      <View style={styles.sectionNavigation}>
        <TouchableOpacity
          style={[
            styles.sectionButton,
            activeSection === 'events' && { backgroundColor: theme.colors.primary }
          ]}
          onPress={() => setActiveSection('events')}
        >
          <Text style={[
            styles.sectionButtonText,
            { color: activeSection === 'events' ? '#FFFFFF' : theme.colors.text }
          ]}>
            Events Approval
          </Text>
          {pendingEventsCount > 0 && (
            <View style={[styles.badge, { backgroundColor: '#FF6B35' }]}>
              <Text style={styles.badgeText}>{pendingEventsCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sectionButton,
            activeSection === 'requests' && { backgroundColor: theme.colors.primary }
          ]}
          onPress={() => setActiveSection('requests')}
        >
          <Text style={[
            styles.sectionButtonText,
            { color: activeSection === 'requests' ? '#FFFFFF' : theme.colors.text }
          ]}>
            Student Request Approval
          </Text>
          {pendingRequestsCount > 0 && (
            <View style={[styles.badge, { backgroundColor: '#FF6B35' }]}>
              <Text style={styles.badgeText}>{pendingRequestsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterButtons}>
            {filterOptions.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selectedFilter === filter
                      ? theme.colors.primary
                      : theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterButtonText,
                  {
                    color: selectedFilter === filter
                      ? '#FFFFFF'
                      : theme.colors.textSecondary
                  }
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Content Section */}
      <ScrollView
        style={styles.contentList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {activeSection === 'events' ? (
            <>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Events Approval
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                Review and approve faculty-submitted events
              </Text>

              {filteredEvents.length === 0 ? (
                <AnimatedCard style={styles.emptyCard}>
                  <View style={styles.emptyContent}>
                    <FileText size={48} color={theme.colors.textSecondary} />
                    <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                      No {selectedFilter.toLowerCase()} events
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                      Check back later for new submissions.
                    </Text>
                  </View>
                </AnimatedCard>
              ) : (
                filteredEvents.map((event) => (
                  <AnimatedCard key={event.id} style={styles.contentCard}>
                    <View style={styles.contentHeader}>
                      <View style={[
                        styles.statusIcon,
                        { backgroundColor: getStatusColor(event.status) + '20' }
                      ]}>
                        {getStatusIcon(event.status)}
                      </View>
                      <View style={styles.contentInfo}>
                        <Text style={[styles.contentTitle, { color: theme.colors.text }]}>
                          {event.name}
                        </Text>
                        <Text style={[styles.contentType, { color: theme.colors.textSecondary }]}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Text>
                      </View>
                      <View style={styles.pointsContainer}>
                        <View style={styles.pointsBadge}>
                          <Star size={14} color={theme.colors.accent} />
                          <Text style={[styles.pointsText, { color: theme.colors.accent }]}>
                            {event.alloted_points}
                          </Text>
                        </View>
                        {event.alloted_berries > 0 && (
                          <View style={styles.pointsBadge}>
                            <Cherry size={14} color={theme.colors.success} />
                            <Text style={[styles.pointsText, { color: theme.colors.success }]}>
                              {event.alloted_berries}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <Text style={[styles.contentDescription, { color: theme.colors.textSecondary }]}>
                      {event.description}
                    </Text>

                    <View style={styles.contentMeta}>
                      <View style={styles.metaItem}>
                        <Calendar size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                          {new Date(event.scheduled_date).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <MapPin size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                          {event.venue}
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Users size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                          Capacity: {event.capacity}
                        </Text>
                      </View>
                    </View>

                    {event.status === 'pending' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                          onPress={() => handleReviewEvent(event)}
                        >
                          <Eye size={16} color="#FFFFFF" />
                          <Text style={styles.actionButtonText}>Review</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </AnimatedCard>
                ))
              )}
            </>
          ) : (
            <>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Student Request Approval
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                Review and approve student-submitted requests
              </Text>

              {filteredStudentRequests.length === 0 ? (
                <AnimatedCard style={styles.emptyCard}>
                  <View style={styles.emptyContent}>
                    <FileText size={48} color={theme.colors.textSecondary} />
                    <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                      No {selectedFilter.toLowerCase()} requests
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                      Check back later for new submissions.
                    </Text>
                  </View>
                </AnimatedCard>
              ) : (
                filteredStudentRequests.map((request) => (
                  <AnimatedCard key={request.id} style={styles.contentCard}>
                    <View style={styles.contentHeader}>
                      <View style={[
                        styles.statusIcon,
                        { backgroundColor: getStatusColor(request.status) + '20' }
                      ]}>
                        {getStatusIcon(request.status)}
                      </View>
                      <View style={styles.contentInfo}>
                        <Text style={[styles.contentTitle, { color: theme.colors.text }]}>
                          {request.title}
                        </Text>
                        <Text style={[styles.contentStudent, { color: theme.colors.textSecondary }]}>
                          {request.studentName} • {request.studentId}
                        </Text>
                      </View>
                      <View style={styles.pointsContainer}>
                        <View style={styles.pointsBadge}>
                          <Star size={14} color={theme.colors.accent} />
                          <Text style={[styles.pointsText, { color: theme.colors.accent }]}>
                            {request.points}
                          </Text>
                        </View>
                        {request.berries > 0 && (
                          <View style={styles.pointsBadge}>
                            <Cherry size={14} color={theme.colors.success} />
                            <Text style={[styles.pointsText, { color: theme.colors.success }]}>
                              {request.berries}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <Text style={[styles.contentDescription, { color: theme.colors.textSecondary }]}>
                      {request.description}
                    </Text>

                    <View style={styles.contentMeta}>
                      <View style={styles.metaItem}>
                        <Calendar size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                          {new Date(request.date).toLocaleDateString()}
                        </Text>
                      </View>
                      {request.proofUrl && (
                        <View style={styles.metaItem}>
                          <Text style={[styles.proofText, { color: theme.colors.primary }]}>
                            Proof attached
                          </Text>
                        </View>
                      )}
                    </View>

                    {request.status === 'pending' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                          onPress={() => handleReviewRequest(request)}
                        >
                          <Eye size={16} color="#FFFFFF" />
                          <Text style={styles.actionButtonText}>Review</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </AnimatedCard>
                ))
              )}
            </>
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
  sectionNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
  },
  sectionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    flexDirection: 'row',
    position: 'relative',
  },
  sectionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  filterSection: {
    paddingTop: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 20,
  },
  contentList: {
    flex: 1,
  },
  contentContainer: {
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
  contentCard: {
    marginBottom: 0,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentInfo: {
    flex: 1,
    gap: 2,
  },
  contentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  contentType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textTransform: 'capitalize',
  },
  contentStudent: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  pointsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  contentDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginTop: 8,
  },
  contentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  proofText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});