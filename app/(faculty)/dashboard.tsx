import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { mockUsers, mockTransactions } from '@/data/mockData';
import { Student } from '@/types';
import GradientCard from '@/components/GradientCard';
import AnimatedCard from '@/components/AnimatedCard';
import { TrendingUp, Users, Award, ChartBar as BarChart3, Filter, Calendar } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const filterOptions = ['All', 'Academic', 'Cultural', 'Volunteer', 'Attendance'];

export default function FacultyDashboard() {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  const students = mockUsers.filter(user => user.role === 'student') as Student[];
  const totalPoints = students.reduce((sum, student) => sum + student.totalPoints, 0);
  const avgPoints = Math.round(totalPoints / students.length);
  
  const recentTransactions = mockTransactions
    .filter(t => t.type === 'earned')
    .slice(0, 10);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Analytics Dashboard
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Student performance insights
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Cards */}
        <View style={styles.section}>
          <GradientCard gradientColors={theme.colors.gradient.primary}>
            <View style={styles.overviewCard}>
              <View style={styles.overviewHeader}>
                <Text style={styles.overviewTitle}>Department Overview</Text>
                <BarChart3 size={24} color="#FFFFFF" />
              </View>
              <View style={styles.overviewStats}>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{students.length}</Text>
                  <Text style={styles.overviewStatLabel}>Total Students</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{totalPoints.toLocaleString()}</Text>
                  <Text style={styles.overviewStatLabel}>Total Points</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{avgPoints}</Text>
                  <Text style={styles.overviewStatLabel}>Avg Points</Text>
                </View>
              </View>
            </View>
          </GradientCard>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <View style={styles.statsGrid}>
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
                  <TrendingUp size={20} color={theme.colors.success} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  +23%
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  This Month
                </Text>
              </View>
            </AnimatedCard>
            
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Users size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  89%
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Active Students
                </Text>
              </View>
            </AnimatedCard>
            
            <AnimatedCard style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.accent + '20' }]}>
                  <Award size={20} color={theme.colors.accent} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  156
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Achievements
                </Text>
              </View>
            </AnimatedCard>
          </View>
        </View>

        {/* Filter Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Point Distribution
          </Text>
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

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Point Awards
          </Text>
          
          <View style={styles.transactionsList}>
            {recentTransactions.map((transaction) => (
              <AnimatedCard key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionContent}>
                  <View style={[
                    styles.transactionIcon,
                    { backgroundColor: theme.colors.success + '20' }
                  ]}>
                    <TrendingUp size={16} color={theme.colors.success} />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionDescription, { color: theme.colors.text }]}>
                      {transaction.description}
                    </Text>
                    <View style={styles.transactionMeta}>
                      <Calendar size={12} color={theme.colors.textSecondary} />
                      <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </Text>
                      {transaction.category && (
                        <>
                          <Text style={[styles.separator, { color: theme.colors.textSecondary }]}>•</Text>
                          <Text style={[styles.transactionCategory, { color: theme.colors.textSecondary }]}>
                            {transaction.category}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                  <Text style={[styles.transactionPoints, { color: theme.colors.success }]}>
                    +{transaction.points}
                  </Text>
                </View>
              </AnimatedCard>
            ))}
          </View>
        </View>

        {/* Top Performers */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Top Performers
          </Text>
          
          <View style={styles.performersList}>
            {students
              .sort((a, b) => b.totalPoints - a.totalPoints)
              .slice(0, 5)
              .map((student, index) => (
                <AnimatedCard key={student.id} style={styles.performerCard}>
                  <View style={styles.performerContent}>
                    <View style={styles.performerRank}>
                      <Text style={[styles.rankText, { color: theme.colors.primary }]}>
                        #{index + 1}
                      </Text>
                    </View>
                    <View style={styles.performerInfo}>
                      <Text style={[styles.performerName, { color: theme.colors.text }]}>
                        {student.name}
                      </Text>
                      <Text style={[styles.performerDepartment, { color: theme.colors.textSecondary }]}>
                        Year {student.year}
                      </Text>
                    </View>
                    <Text style={[styles.performerPoints, { color: theme.colors.primary }]}>
                      {student.totalPoints}
                    </Text>
                  </View>
                </AnimatedCard>
              ))}
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  overviewCard: {
    gap: 16,
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
  statsGrid: {
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
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
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
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    marginBottom: 0,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    gap: 4,
  },
  transactionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  separator: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  transactionCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textTransform: 'capitalize',
  },
  transactionPoints: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  performersList: {
    gap: 12,
  },
  performerCard: {
    marginBottom: 0,
  },
  performerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  performerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  performerInfo: {
    flex: 1,
    gap: 2,
  },
  performerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  performerDepartment: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  performerPoints: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});