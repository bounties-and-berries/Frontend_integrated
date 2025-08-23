import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Faculty } from '@/types';
import GradientCard from '@/components/GradientCard';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { 
  Settings, 
  Edit3, 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  TrendingUp, 
  Star,
  BookOpen,
  GraduationCap,
  Briefcase,
  Clock
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function FacultyProfile() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const faculty = user as Faculty;

  const [selectedTab, setSelectedTab] = useState('overview');

  const stats = [
    { label: 'Students Taught', value: '156', icon: Users, color: '#3B82F6' },
    { label: 'Events Created', value: '23', icon: Calendar, color: '#10B981' },
    { label: 'Total Points', value: '2,450', icon: Award, color: '#F59E0B' },
    { label: 'Rating', value: '4.8', icon: Star, color: '#EF4444' },
  ];

  const recentActivities = [
    { id: '1', title: 'Hackathon 2024', type: 'Event Created', date: '2 days ago', points: 500 },
    { id: '2', title: 'Cultural Fest', type: 'Event Managed', date: '1 week ago', points: 300 },
    { id: '3', title: 'Cleanup Drive', type: 'Event Completed', date: '2 weeks ago', points: 200 },
  ];

  const achievements = [
    { id: '1', title: 'Top Faculty', description: 'Highest student engagement', icon: Award, color: '#FFD700' },
    { id: '2', title: 'Event Master', description: 'Created 20+ successful events', icon: Star, color: '#C0C0C0' },
    { id: '3', title: 'Student Favorite', description: '4.8+ rating from students', icon: TrendingUp, color: '#CD7F32' },
  ];

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <AnimatedCard key={stat.label} style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
          </AnimatedCard>
        ))}
      </View>

      {/* Recent Activities */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Recent Activities
        </Text>
        {recentActivities.map((activity) => (
          <AnimatedCard key={activity.id} style={styles.activityCard}>
            <View style={styles.activityContent}>
              <View style={styles.activityInfo}>
                <Text style={[styles.activityTitle, { color: theme.colors.text }]}>
                  {activity.title}
                </Text>
                <Text style={[styles.activityType, { color: theme.colors.textSecondary }]}>
                  {activity.type}
                </Text>
                <Text style={[styles.activityDate, { color: theme.colors.textSecondary }]}>
                  {activity.date}
                </Text>
              </View>
              <View style={styles.activityPoints}>
                <Text style={[styles.pointsText, { color: theme.colors.primary }]}>
                  +{activity.points}
                </Text>
                <Text style={[styles.pointsLabel, { color: theme.colors.textSecondary }]}>
                  points
                </Text>
              </View>
            </View>
          </AnimatedCard>
        ))}
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.tabContent}>
      <View style={styles.achievementsGrid}>
        {achievements.map((achievement) => (
          <AnimatedCard key={achievement.id} style={styles.achievementCard}>
            <View style={styles.achievementContent}>
              <View style={[styles.achievementIcon, { backgroundColor: achievement.color + '20' }]}>
                <achievement.icon size={32} color={achievement.color} />
              </View>
              <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
                {achievement.title}
              </Text>
              <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]}>
                {achievement.description}
              </Text>
            </View>
          </AnimatedCard>
        ))}
      </View>
    </View>
  );

  const renderSchedule = () => (
    <View style={styles.tabContent}>
      <View style={styles.scheduleContainer}>
        <AnimatedCard style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <Clock size={24} color={theme.colors.primary} />
            <Text style={[styles.scheduleTitle, { color: theme.colors.text }]}>
              Today's Schedule
            </Text>
          </View>
          <View style={styles.scheduleItem}>
            <View style={styles.timeSlot}>
              <Text style={[styles.timeText, { color: theme.colors.primary }]}>09:00 AM</Text>
              <Text style={[styles.durationText, { color: theme.colors.textSecondary }]}>2 hours</Text>
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={[styles.classTitle, { color: theme.colors.text }]}>
                Data Structures
              </Text>
              <Text style={[styles.classLocation, { color: theme.colors.textSecondary }]}>
                Room 301 • Computer Science
              </Text>
            </View>
          </View>
          <View style={styles.scheduleItem}>
            <View style={styles.timeSlot}>
              <Text style={[styles.timeText, { color: theme.colors.primary }]}>02:00 PM</Text>
              <Text style={[styles.durationText, { color: theme.colors.textSecondary }]}>1 hour</Text>
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={[styles.classTitle, { color: theme.colors.text }]}>
                Office Hours
              </Text>
              <Text style={[styles.classLocation, { color: theme.colors.textSecondary }]}>
                Faculty Office • Building A
              </Text>
            </View>
          </View>
        </AnimatedCard>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="Faculty Profile"
        subtitle={`Welcome back, ${faculty?.name}`}
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.section}>
          <GradientCard gradientColors={theme.colors.gradient.primary}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: faculty?.profileImage }}
                  style={styles.profileImage}
                />
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => router.push('/(faculty)/profile-photo')}
                >
                  <Edit3 size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{faculty?.name}</Text>
                <Text style={styles.profileRole}>{faculty?.role}</Text>
                <View style={styles.profileDetails}>
                  <View style={styles.detailItem}>
                    <GraduationCap size={16} color="#FFFFFF" />
                    <Text style={styles.detailText}>{faculty?.department}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <BookOpen size={16} color="#FFFFFF" />
                    <Text style={styles.detailText}>{faculty?.subject}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.settingsButton}
                onPress={() => router.push('/(faculty)/settings')}
              >
                <Settings size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </GradientCard>
        </View>

        {/* Tab Navigation */}
        <View style={styles.section}>
          <View style={styles.tabContainer}>
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  selectedTab === tab.id && { backgroundColor: theme.colors.primary }
                ]}
                onPress={() => setSelectedTab(tab.id)}
              >
                <tab.icon 
                  size={20} 
                  color={selectedTab === tab.id ? '#FFFFFF' : theme.colors.textSecondary} 
                />
                <Text style={[
                  styles.tabLabel,
                  { color: selectedTab === tab.id ? '#FFFFFF' : theme.colors.textSecondary }
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tab Content */}
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'achievements' && renderAchievements()}
        {selectedTab === 'schedule' && renderSchedule()}
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
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 6,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  profileRole: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    textTransform: 'capitalize',
  },
  profileDetails: {
    gap: 8,
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  settingsButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 52) / 2,
    marginBottom: 0,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  activityCard: {
    marginBottom: 12,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  activityInfo: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  activityType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  activityDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  activityPoints: {
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  pointsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  achievementsGrid: {
    gap: 16,
  },
  achievementCard: {
    marginBottom: 0,
  },
  achievementContent: {
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    opacity: 0.8,
  },
  scheduleContainer: {
    gap: 16,
  },
  scheduleCard: {
    marginBottom: 0,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  scheduleTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  scheduleItem: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  timeSlot: {
    alignItems: 'center',
    minWidth: 80,
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  scheduleInfo: {
    flex: 1,
    gap: 4,
  },
  classTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  classLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});
