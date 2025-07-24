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
import { Admin } from '@/types';
import { mockUsers, mockTransactions, mockEvents } from '@/data/mockData';
import GradientCard from '@/components/GradientCard';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Users, TrendingUp, Award, Calendar, ChartBar as BarChart3, Shield, Activity, UserPlus, Rss } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AdminHome() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const admin = user as Admin;

  const totalStudents = mockUsers.filter(u => u.role === 'student').length;
  const totalFaculty = mockUsers.filter(u => u.role === 'faculty').length;
  const totalPoints = mockTransactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.points, 0);
  const activeEvents = mockEvents.length;

  // Mock data for new metrics
  const pointsRedeemed = 1250;
  const activeUsers = 89;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Good Morning"
        subtitle={`Welcome back, ${admin?.name}`}
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
                  <Text style={styles.overviewTitle}>College Overview</Text>
                  <Text style={styles.overviewSubtitle}>
                    {admin?.collegeName}
                  </Text>
                </View>
                <View style={styles.overviewIcon}>
                  <BarChart3 size={32} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.overviewStats}>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{totalStudents}</Text>
                  <Text style={styles.overviewStatLabel}>Students</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{totalFaculty}</Text>
                  <Text style={styles.overviewStatLabel}>Faculty</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{totalPoints.toLocaleString()}</Text>
                  <Text style={styles.overviewStatLabel}>Total Points</Text>
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
                <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
                  <TrendingUp size={24} color={theme.colors.success} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {pointsRedeemed}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Points Redeemed
                </Text>
              </View>
            </AnimatedCard>
            
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Activity size={24} color={theme.colors.primary} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {activeUsers}%
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Active Users
                </Text>
              </View>
            </AnimatedCard>
            
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.accent + '20' }]}>
                  <Award size={24} color={theme.colors.accent} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {activeEvents}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Active Events
                </Text>
              </View>
            </AnimatedCard>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => router.push('/(admin)/dashboard')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            {mockTransactions.slice(0, 5).map((transaction) => (
              <AnimatedCard key={transaction.id} style={styles.activityCard}>
                <View style={styles.activityContent}>
                  <View style={[
                    styles.activityIcon,
                    { backgroundColor: theme.colors.success + '20' }
                  ]}>
                    <TrendingUp size={16} color={theme.colors.success} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={[styles.activityDescription, { color: theme.colors.text }]}>
                      {transaction.description}
                    </Text>
                    <Text style={[styles.activityDate, { color: theme.colors.textSecondary }]}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={[styles.activityPoints, { color: theme.colors.success }]}>
                    +{transaction.points}
                  </Text>
                </View>
              </AnimatedCard>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(admin)/users')}
            >
              <LinearGradient
                colors={theme.colors.gradient.primary}
                style={styles.actionButtonGradient}
              >
                <Users size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Manage Users</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(admin)/add-user')}
            >
              <LinearGradient
                colors={theme.colors.gradient.secondary}
                style={styles.actionButtonGradient}
              >
                <UserPlus size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Add User</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(admin)/rules')}
            >
              <LinearGradient
                colors={theme.colors.gradient.accent}
                style={styles.actionButtonGradient}
              >
                <Shield size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Point Rules</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(admin)/feeds')}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.actionButtonGradient}
              >
                <Rss size={24} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Feeds</Text>
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
    fontSize: 20,
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
  activityList: {
    gap: 12,
  },
  activityCard: {
    marginBottom: 0,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
    gap: 2,
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  activityDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  activityPoints: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
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