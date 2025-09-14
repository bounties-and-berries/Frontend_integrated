import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Faculty } from '@/types';
import { mockAchievements, mockEvents, mockUsers } from '@/data/mockData';
import GradientCard from '@/components/GradientCard';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { FileText, Calendar, Users, TrendingUp, Clock, CircleCheck as CheckCircle, CircleAlert as AlertTriangle, ChartBar as BarChart3, Bell, Menu, Sun, Moon, Trophy, Star, Cherry, CheckCircle2, XCircle } from 'lucide-react-native';
import { getAllEventsAdmin, listParticipations, getMyParticipations } from '@/utils/api';

const { width, height } = Dimensions.get('window');
const scale = width / 375; // Base scale for iPhone 11

// Responsive font scaling
const normalize = (size: number) => {
  const newSize = size * scale;
  if (PixelRatio.get() >= 3 && newSize > 18) {
    return newSize - 2; // Slightly smaller for very high DPI screens
  }
  if (PixelRatio.get() < 2 && newSize < 14) {
    return newSize + 1; // Slightly larger for low DPI screens
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export default function FacultyHome() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const faculty = user as Faculty;
  const insets = useSafeAreaInsets();

  // Animated values for scroll handling
  const scrollY = useSharedValue(0);

  const [facultyStats, setFacultyStats] = useState({
    totalBounties: 0,
    pointsAllocated: 0,
    berriesAllocated: 0
  });
  
  // Update the approvalStats state to include rejected count
  const [approvalStats, setApprovalStats] = useState({
    pendingApprovals: 0,
    totalApproved: 0,
    totalRejected: 0
  });

  // Fetch faculty statistics
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all events created by faculty
        const events = await getAllEventsAdmin();
        
        // Calculate faculty statistics
        const totalBounties = events.length;
        const pointsAllocated = events.reduce((sum: number, event: any) => sum + (parseInt(event.alloted_points) || 0), 0);
        const berriesAllocated = events.reduce((sum: number, event: any) => sum + (parseInt(event.alloted_berries) || 0), 0);
        
        setFacultyStats({
          totalBounties,
          pointsAllocated,
          berriesAllocated
        });
        
        try {
          // Fetch participations to calculate approval stats
          const participations = await listParticipations();
          
          // Calculate approval statistics
          const pendingApprovals = participations.filter((p: any) => p.status === 'pending').length;
          const totalApproved = participations.filter((p: any) => p.status === 'approved').length;
          const totalRejected = participations.filter((p: any) => p.status === 'rejected').length;
          
          setApprovalStats({
            pendingApprovals,
            totalApproved,
            totalRejected
          });
        } catch (participationError) {
          console.error('Failed to fetch participation data:', participationError);
          // Fallback to mock data for approval stats
          setApprovalStats({
            pendingApprovals: mockAchievements.filter(a => a.status === 'pending').length,
            totalApproved: mockAchievements.filter(a => a.status === 'approved').length,
            totalRejected: mockAchievements.filter(a => a.status === 'rejected').length
          });
        }
      } catch (error) {
        console.error('Failed to fetch faculty statistics:', error);
        // Fallback to mock data
        setFacultyStats({
          totalBounties: 12,
          pointsAllocated: 1250,
          berriesAllocated: 240
        });
        
        setApprovalStats({
          pendingApprovals: mockAchievements.filter(a => a.status === 'pending').length,
          totalApproved: mockAchievements.filter(a => a.status === 'approved').length,
          totalRejected: mockAchievements.filter(a => a.status === 'rejected').length
        });
      }
    };

    fetchAllData();
  }, []);

  // Restore the scrollHandler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  // Restore upcomingEvents
  const upcomingEvents = mockEvents.slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, flex: 1 }]}>
      {/* Top Menu Bar with Theme Toggle */}
      <TopMenuBar 
        title="Welcome Back"
        subtitle={`Welcome back, ${faculty?.name}`}
        showNotifications={true}
        showBackButton={false}
      />
      
      {/* Theme Toggle Button - Positioned over the TopMenuBar */}
      <View style={{
        position: 'absolute',
        top: insets.top + (Platform.OS === 'ios' ? 10 : 20), // Match TopMenuBar's paddingTop
        right: 132, // Increased spacing to prevent overlap with notification bell
        zIndex: 1001,
      }}>
        <TouchableOpacity
          style={[styles.themeToggleButton, { backgroundColor: theme.colors.card }]}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          {isDark ? (
            <Sun size={20} color={theme.colors.text} />
          ) : (
            <Moon size={20} color={theme.colors.text} />
          )}
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 20 } // Reduced padding since TopMenuBar handles spacing
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Overview Card */}
        <View style={styles.section}>
          <GradientCard gradientColors={theme.colors.gradient.primary}>
            <View style={styles.overviewCard}>
              <View style={styles.overviewHeader}>
                <View>
                  <Text style={styles.overviewTitle}>Faculty Dashboard</Text>
                  <Text style={styles.overviewSubtitle}>
                    {faculty?.department} {faculty?.subject}
                  </Text>
                </View>
                <View style={styles.overviewIcon}>
                  <BarChart3 size={32} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.overviewStats}>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{facultyStats.totalBounties}</Text>
                  <Text style={styles.overviewStatLabel}>Total Bounties</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{facultyStats.pointsAllocated}</Text>
                  <Text style={styles.overviewStatLabel}>Points Allocated</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{facultyStats.berriesAllocated}</Text>
                  <Text style={styles.overviewStatLabel}>Berries Allocated</Text>
                </View>
              </View>
            </View>
          </GradientCard>
        </View>

        {/* Approval Summary Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Approval Summary
          </Text>
          <View style={styles.statsRow}>
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                  <Clock size={20} color={theme.colors.warning} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {approvalStats.pendingApprovals}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Pending Approvals
                </Text>
              </View>
            </AnimatedCard>
            
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
                  <CheckCircle2 size={20} color={theme.colors.success} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {approvalStats.totalApproved}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Total Approved
                </Text>
              </View>
            </AnimatedCard>
            
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.error + '20' }]}>
                  <XCircle size={20} color={theme.colors.error} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {approvalStats.totalRejected}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Total Rejected
                </Text>
              </View>
            </AnimatedCard>
          </View>
        </View>

        {/* Quick Actions - Removed as per request */}

        {/* Pending Approvals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Approval Requests
            </Text>
            <TouchableOpacity onPress={() => router.push('/(faculty)/(tabs)/approvals')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.approvalsList}>
            {mockAchievements.filter(a => a.status === 'pending').slice(0, 3).map((achievement, index) => (
              <AnimatedCard key={achievement.id} style={styles.approvalCard}>
                <View style={styles.approvalContent}>
                  <View style={[styles.approvalIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                    <AlertTriangle size={20} color={theme.colors.warning} />
                  </View>
                  <View style={styles.approvalInfo}>
                    <Text style={[styles.approvalTitle, { color: theme.colors.text }]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.approvalDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                      {achievement.description}
                    </Text>
                    <Text style={[styles.approvalDate, { color: theme.colors.textSecondary }]}>
                      {new Date(achievement.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.approvalPoints}>
                    <Text style={[styles.approvalPointsText, { color: theme.colors.primary }]}>
                      +{achievement.points}
                    </Text>
                  </View>
                </View>
              </AnimatedCard>
            ))}
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Upcoming Events
            </Text>
            <TouchableOpacity onPress={() => router.push('/(faculty)/(tabs)/events')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                Manage
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalList}>
              {upcomingEvents.map((event, index) => (
                <AnimatedCard key={event.id} style={styles.eventCard}>
                  <Image source={{ uri: event.image }} style={styles.eventImage} />
                  <View style={styles.eventContent}>
                    <Text style={[styles.eventTitle, { color: theme.colors.text }]} numberOfLines={2}>
                      {event.title}
                    </Text>
                    <Text style={[styles.eventDate, { color: theme.colors.textSecondary }]}>
                      {new Date(event.date).toLocaleDateString()}
                    </Text>
                    <Text style={[styles.eventLocation, { color: theme.colors.textSecondary }]}>
                      {event.location}
                    </Text>
                    <View style={styles.eventParticipants}>
                      <Users size={14} color={theme.colors.primary} />
                      <Text style={[styles.eventParticipantsText, { color: theme.colors.primary }]}>
                        {event.currentParticipants}/{event.maxParticipants}
                      </Text>
                    </View>
                  </View>
                </AnimatedCard>
              ))}
            </View>
          </ScrollView>
        </View>

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  overviewCard: {
    gap: 20,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  overviewSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
    marginTop: 4,
  },
  overviewIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewStat: {
    alignItems: 'center',
    gap: 4,
  },
  overviewStatValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  overviewStatLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  approvalsList: {
    gap: 12,
  },
  approvalCard: {
    marginBottom: 0,
  },
  approvalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  approvalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approvalInfo: {
    flex: 1,
    gap: 2,
  },
  approvalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  approvalDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  approvalDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  approvalPoints: {
    alignItems: 'center',
  },
  approvalPointsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  horizontalList: {
    flexDirection: 'row',
    gap: 16,
  },
  eventCard: {
    width: 200,
  },
  eventImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
  },
  eventContent: {
    gap: 6,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  eventDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  eventLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  eventParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  eventParticipantsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
  },
  actionButtonGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});