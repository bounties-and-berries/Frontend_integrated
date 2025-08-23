import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Faculty } from '@/types';
import { mockAchievements, mockEvents } from '@/data/mockData';
import GradientCard from '@/components/GradientCard';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { FileText, Calendar, Users, TrendingUp, Clock, CircleCheck as CheckCircle, CircleAlert as AlertTriangle, ChartBar as BarChart3 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function FacultyHome() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const faculty = user as Faculty;

  const pendingApprovals = mockAchievements.filter(a => a.status === 'pending').length;
  const approvedToday = mockAchievements.filter(a => 
    a.status === 'approved' && 
    new Date(a.date).toDateString() === new Date().toDateString()
  ).length;
  const upcomingEvents = mockEvents.slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Good Morning"
        subtitle={`Welcome back, ${faculty?.name}`}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Card */}
        <View style={styles.section}>
          <GradientCard gradientColors={theme.colors.gradient.primary}>
            <View style={styles.overviewCard}>
              <View style={styles.overviewHeader}>
                <View>
                  <Text style={styles.overviewTitle}>Faculty Dashboard</Text>
                  <Text style={styles.overviewSubtitle}>
                    {faculty?.department} • {faculty?.subject}
                  </Text>
                </View>
                <View style={styles.overviewIcon}>
                  <BarChart3 size={32} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.overviewStats}>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{pendingApprovals}</Text>
                  <Text style={styles.overviewStatLabel}>Pending</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{approvedToday}</Text>
                  <Text style={styles.overviewStatLabel}>Approved Today</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>156</Text>
                  <Text style={styles.overviewStatLabel}>Total Students</Text>
                </View>
              </View>
            </View>
          </GradientCard>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <View style={styles.statsRow}>
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                  <Clock size={24} color={theme.colors.warning} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {pendingApprovals}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Pending Approvals
                </Text>
              </View>
            </AnimatedCard>
            
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
                  <CheckCircle size={24} color={theme.colors.success} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {approvedToday}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Approved Today
                </Text>
              </View>
            </AnimatedCard>
            
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Users size={24} color={theme.colors.primary} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  156
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Total Students
                </Text>
              </View>
            </AnimatedCard>
          </View>
        </View>

        {/* Pending Approvals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Approval Requests
            </Text>
            <TouchableOpacity onPress={() => router.push('/(faculty)/approvals')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.approvalsList}>
            {mockAchievements.filter(a => a.status === 'pending').slice(0, 3).map((achievement) => (
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
            <TouchableOpacity onPress={() => router.push('/(faculty)/events')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                Manage
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalList}>
              {upcomingEvents.map((event) => (
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

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(faculty)/approvals')}
            >
              <LinearGradient
                colors={theme.colors.gradient.primary}
                style={styles.actionButtonGradient}
              >
                <FileText size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Review Points</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(faculty)/dashboard')}
            >
              <LinearGradient
                colors={theme.colors.gradient.secondary}
                style={styles.actionButtonGradient}
              >
                <BarChart3 size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Dashboard</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(faculty)/student-progress')}
            >
              <LinearGradient
                colors={theme.colors.gradient.accent}
                style={styles.actionButtonGradient}
              >
                <TrendingUp size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Student Progress</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(faculty)/history')}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.actionButtonGradient}
              >
                <TrendingUp size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Points History</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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