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
import { CircleCheck as CheckCircle, Circle as XCircle, Clock, FileText, Calendar, Users, MapPin, Star, Cherry, Eye } from 'lucide-react-native';
import { getAllEventsAdmin } from '@/utils/api';

const { width } = Dimensions.get('window');

const filterOptions = ['All', 'Pending', 'Approved', 'Rejected'];

interface Bounty {
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
  const [activeSection, setActiveSection] = useState('bounties'); // 'bounties' or 'requests'
  const [bounties, setBounties] = useState<Bounty[]>([]);
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
    status: achievement.status
  })));
  
  // Only show back button when navigating from top menu
  const shouldShowBackButton = params.fromMenu === 'true';
  
  // Fetch bounties data
  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const events = await getAllEventsAdmin();
        // Convert events to bounties format with status
        const bountiesWithStatus = events.map((event: any) => ({
          ...event,
          status: 'pending' // Default status, in real app this would come from API
        }));
        setBounties(bountiesWithStatus);
      } catch (error) {
        console.error('Failed to fetch bounties:', error);
        // Fallback to mock data
        setBounties(mockEvents.map(event => ({
          id: parseInt(event.id),
          name: event.title,
          description: event.description,
          type: event.category,
          alloted_points: event.points,
          alloted_berries: 0,
          scheduled_date: event.date,
          venue: event.location,
          capacity: event.maxParticipants,
          is_active: true,
          status: 'pending'
        })));
      }
    };

    fetchBounties();
  }, []);
  
  const filteredBounties = bounties.filter(bounty => {
    if (selectedFilter === 'All') return true;
    return bounty.status.toLowerCase() === selectedFilter.toLowerCase();
  });
  
  const filteredStudentRequests = studentRequests.filter(request => {
    if (selectedFilter === 'All') return true;
    return request.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleApproveBounty = (bountyId: number) => {
    Alert.alert(
      'Approve Bounty',
      'Are you sure you want to approve this bounty?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: () => {
            setBounties(prev =>
              prev.map(bounty =>
                bounty.id === bountyId
                  ? { ...bounty, status: 'approved' }
                  : bounty
              )
            );
            Alert.alert('Success', 'Bounty approved successfully!');
          }
        }
      ]
    );
  };

  const handleRejectBounty = (bountyId: number) => {
    Alert.alert(
      'Reject Bounty',
      'Are you sure you want to reject this bounty?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => {
            setBounties(prev =>
              prev.map(bounty =>
                bounty.id === bountyId
                  ? { ...bounty, status: 'rejected' }
                  : bounty
              )
            );
            Alert.alert('Success', 'Bounty rejected.');
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
  const pendingBountiesCount = bounties.filter(b => b.status === 'pending').length;
  const pendingRequestsCount = studentRequests.filter(r => r.status === 'pending').length;

  // Handle review button click - navigate to full screen review page
  const handleReviewBounty = (bounty: Bounty) => {
    router.push({
      pathname: '/(faculty)/review-bounty',
      params: { 
        bountyId: bounty.id.toString(),
        bountyName: bounty.name,
        bountyDescription: bounty.description,
        bountyDate: bounty.scheduled_date,
        bountyVenue: bounty.venue,
        bountyPoints: bounty.alloted_points.toString(),
        bountyCapacity: bounty.capacity.toString()
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, flex: 1 }]}>
      <TopMenuBar 
        title="Approvals"
        subtitle="Review and approve bounties and student requests"
        showBackButton={shouldShowBackButton}
      />

      {/* Section Navigation with Notification Badges */}
      <View style={styles.sectionNavigation}>
        <TouchableOpacity
          style={[
            styles.sectionButton,
            activeSection === 'bounties' && { backgroundColor: theme.colors.primary }
          ]}
          onPress={() => setActiveSection('bounties')}
        >
          <Text style={[
            styles.sectionButtonText,
            { color: activeSection === 'bounties' ? '#FFFFFF' : theme.colors.text }
          ]}>
            Bounties Approval
          </Text>
          {pendingBountiesCount > 0 && (
            <View style={[styles.badge, { backgroundColor: '#FF6B35' }]}>
              <Text style={styles.badgeText}>{pendingBountiesCount}</Text>
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
          {activeSection === 'bounties' ? (
            <>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Bounties Approval
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                Review and approve faculty-submitted bounties/events
              </Text>
              
              {filteredBounties.length === 0 ? (
                <AnimatedCard style={styles.emptyCard}>
                  <View style={styles.emptyContent}>
                    <FileText size={48} color={theme.colors.textSecondary} />
                    <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                      No {selectedFilter.toLowerCase()} bounties
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                      Check back later for new submissions.
                    </Text>
                  </View>
                </AnimatedCard>
              ) : (
                filteredBounties.map((bounty) => (
                  <AnimatedCard key={bounty.id} style={styles.contentCard}>
                    <View style={styles.contentHeader}>
                      <View style={[
                        styles.statusIcon,
                        { backgroundColor: getStatusColor(bounty.status) + '20' }
                      ]}>
                        {getStatusIcon(bounty.status)}
                      </View>
                      <View style={styles.contentInfo}>
                        <Text style={[styles.contentTitle, { color: theme.colors.text }]}>
                          {bounty.name}
                        </Text>
                        <Text style={[styles.contentType, { color: theme.colors.textSecondary }]}>
                          {bounty.type.charAt(0).toUpperCase() + bounty.type.slice(1)}
                        </Text>
                      </View>
                      <View style={styles.pointsContainer}>
                        <View style={styles.pointsBadge}>
                          <Star size={14} color={theme.colors.accent} />
                          <Text style={[styles.pointsText, { color: theme.colors.accent }]}>
                            {bounty.alloted_points}
                          </Text>
                        </View>
                        {bounty.alloted_berries > 0 && (
                          <View style={styles.pointsBadge}>
                            <Cherry size={14} color={theme.colors.success} />
                            <Text style={[styles.pointsText, { color: theme.colors.success }]}>
                              {bounty.alloted_berries}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <Text style={[styles.contentDescription, { color: theme.colors.textSecondary }]}>
                      {bounty.description}
                    </Text>
                    
                    <View style={styles.contentMeta}>
                      <View style={styles.metaItem}>
                        <Calendar size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                          {new Date(bounty.scheduled_date).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <MapPin size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                          {bounty.venue}
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Users size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                          Capacity: {bounty.capacity}
                        </Text>
                      </View>
                    </View>
                    
                    {bounty.status === 'pending' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                          onPress={() => handleReviewBounty(bounty)}
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