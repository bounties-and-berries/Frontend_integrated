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
import { mockUsers, mockTransactions, mockEvents } from '@/data/mockData';
import { Student } from '@/types';
import GradientCard from '@/components/GradientCard';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { TrendingUp, Users, Award, ChartBar as BarChart3, Calendar, Activity, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const departmentFilters = ['All', 'Computer Science', 'Engineering', 'Business', 'Arts'];
const categoryFilters = ['All', 'Academic', 'Cultural', 'Volunteer', 'Attendance'];

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const students = mockUsers.filter(user => user.role === 'student') as Student[];
  const faculty = mockUsers.filter(user => user.role === 'faculty');
  
  const totalPoints = mockTransactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.points, 0);
  
  const avgPointsPerStudent = Math.round(totalPoints / students.length);
  const activeEvents = mockEvents.length;
  const completedEvents = 12; // Mock data

  const departmentStats = [
    { name: 'Computer Science', students: 45, points: 12500 },
    { name: 'Engineering', students: 38, points: 9800 },
    { name: 'Business', students: 32, points: 8200 },
    { name: 'Arts', students: 25, points: 6100 },
  ];

  // Filter transactions based on selected category
  const filteredTransactions = selectedCategory === 'All' 
    ? mockTransactions.filter(t => t.type === 'earned')
    : mockTransactions.filter(t => t.type === 'earned' && t.category === selectedCategory.toLowerCase());

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="Analytics Dashboard"
        subtitle="College-wide performance insights"
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Cards */}
        <View style={styles.section}>
          <GradientCard gradientColors={theme.colors.gradient.primary}>
            <View style={styles.overviewCard}>
              <View style={styles.overviewHeader}>
                <Text style={styles.overviewTitle}>System Overview</Text>
                <BarChart3 size={24} color="#FFFFFF" />
              </View>
              <View style={styles.overviewGrid}>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{students.length}</Text>
                  <Text style={styles.overviewStatLabel}>Total Students</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{faculty.length}</Text>
                  <Text style={styles.overviewStatLabel}>Faculty Members</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{totalPoints.toLocaleString()}</Text>
                  <Text style={styles.overviewStatLabel}>Total Berries</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{avgPointsPerStudent}</Text>
                  <Text style={styles.overviewStatLabel}>Avg per Student</Text>
                </View>
              </View>
            </View>
          </GradientCard>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <View style={styles.metricsGrid}>
            <AnimatedCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={[styles.metricIcon, { backgroundColor: theme.colors.success + '20' }]}>
                  <TrendingUp size={20} color={theme.colors.success} />
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  1250
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                  Berries Redeemed
                </Text>
              </View>
            </AnimatedCard>
            
            <AnimatedCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={[styles.metricIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Activity size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  89%
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                  Active Users
                </Text>
              </View>
            </AnimatedCard>
            
            <AnimatedCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={[styles.metricIcon, { backgroundColor: theme.colors.accent + '20' }]}>
                  <Calendar size={20} color={theme.colors.accent} />
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  {activeEvents}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                  Active Bounties
                </Text>
              </View>
            </AnimatedCard>
            
            <AnimatedCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={[styles.metricIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
                  <Target size={20} color={theme.colors.secondary} />
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  {completedEvents}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                  Completed
                </Text>
              </View>
            </AnimatedCard>
          </View>
        </View>

        {/* Department Filter */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Department Analysis
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterButtons}>
              {departmentFilters.map((department) => (
                <TouchableOpacity
                  key={department}
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor: selectedDepartment === department 
                        ? theme.colors.primary 
                        : theme.colors.surface,
                      borderColor: theme.colors.border,
                    }
                  ]}
                  onPress={() => setSelectedDepartment(department)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    { 
                      color: selectedDepartment === department 
                        ? '#FFFFFF' 
                        : theme.colors.textSecondary 
                    }
                  ]}>
                    {department}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Department Stats */}
        <View style={styles.section}>
          <View style={styles.departmentList}>
            {departmentStats.map((dept) => (
              <AnimatedCard key={dept.name} style={styles.departmentCard}>
                <View style={styles.departmentContent}>
                  <View style={styles.departmentInfo}>
                    <Text style={[styles.departmentName, { color: theme.colors.text }]}>
                      {dept.name}
                    </Text>
                    <Text style={[styles.departmentStudents, { color: theme.colors.textSecondary }]}>
                      {dept.students} students
                    </Text>
                  </View>
                  <View style={styles.departmentStats}>
                    <Text style={[styles.departmentPoints, { color: theme.colors.primary }]}>
                      {dept.points.toLocaleString()}
                    </Text>
                    <Text style={[styles.departmentPointsLabel, { color: theme.colors.textSecondary }]}>
                      total berries
                    </Text>
                  </View>
                  <View style={styles.departmentProgress}>
                    <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${(dept.points / 15000) * 100}%`,
                            backgroundColor: theme.colors.primary 
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
              </AnimatedCard>
            ))}
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Berry Distribution by Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterButtons}>
              {categoryFilters.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor: selectedCategory === category 
                        ? theme.colors.primary 
                        : theme.colors.surface,
                      borderColor: theme.colors.border,
                    }
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    { 
                      color: selectedCategory === category 
                        ? '#FFFFFF' 
                        : theme.colors.textSecondary 
                    }
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Berry Awards
          </Text>
          
          <View style={styles.transactionsList}>
            {filteredTransactions
              .slice(0, 8)
              .map((transaction) => (
                <AnimatedCard key={transaction.id} style={styles.transactionCard}>
                  <View style={styles.transactionContent}>
                    <View style={[
                      styles.transactionIcon,
                      { backgroundColor: theme.colors.success + '20' }
                    ]}>
                      <Award size={16} color={theme.colors.success} />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={[styles.transactionDescription, { color: theme.colors.text }]}>
                        {transaction.description}
                      </Text>
                      <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
                        {new Date(transaction.date).toLocaleDateString()}
                        {transaction.category && ` • ${transaction.category}`}
                      </Text>
                    </View>
                    <Text style={[styles.transactionPoints, { color: theme.colors.success }]}>
                      +{transaction.points}
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
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  overviewStat: {
    alignItems: 'center',
    gap: 4,
    width: '45%',
  },
  overviewStatValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  overviewStatLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: (width - 64) / 2,
  },
  metricContent: {
    alignItems: 'center',
    gap: 8,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  metricLabel: {
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
  departmentList: {
    gap: 12,
  },
  departmentCard: {
    marginBottom: 0,
  },
  departmentContent: {
    gap: 12,
  },
  departmentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  departmentName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  departmentStudents: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  departmentStats: {
    alignItems: 'center',
  },
  departmentPoints: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  departmentPointsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  departmentProgress: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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
    gap: 2,
  },
  transactionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  transactionPoints: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
});