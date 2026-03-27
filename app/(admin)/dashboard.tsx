import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { mockUsers, mockTransactions, mockEvents } from '@/data/mockData';
import { Student } from '@/types';
import GradientCard from '@/components/GradientCard';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { PieChart } from 'react-native-svg-charts';
import { TrendingUp, Award, BarChart3, Calendar, Activity, Target, Search } from 'lucide-react-native';
import { useResponsive } from '@/hooks/useResponsive';
import { useAdminDashboard } from '@/hooks/useAdmin';

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { isMobile, select, width } = useResponsive();
  const { data: dashboardData, isLoading, refetch } = useAdminDashboard();

  const styles = getStyles(theme, isMobile, width);

  // Fallback to empty defaults while loading
  const displayData = dashboardData || {
    berriesAvailable: 0,
    categoryBreakdown: [],
    approvedPoints: 0,
    pendingRequests: 0,
    topStudents: []
  };

  const students = mockUsers.filter(user => user.role === 'student') as Student[];
  const faculty = mockUsers.filter(user => user.role === 'faculty');

  const activeStudents = dashboardData?.activeUsers || 0;
  const berriesRedeemed = dashboardData?.berriesRedeemed || 0;
  const completedEventsCount = dashboardData?.completedEvents || 0;
  const activeEventsCount = dashboardData?.activeEvents || 0;
  const departmentStats = dashboardData?.departmentBreakdown || [];

  // Filter transactions based on search query
  const filteredTransactions = mockTransactions
    .filter(t => t.type === 'earned')
    .filter(t => {
      if (!searchQuery) return true;
      return t.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.type?.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // Prepare data for pie chart
  const categoryData = displayData.categoryBreakdown?.length > 0 
    ? displayData.categoryBreakdown.map((item: any, index: number) => ({
        key: index + 1,
        value: Number(item.value) || 0,
        svg: { fill: [ '#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444' ][index % 5] },
        label: item.name
      }))
    : [
        { key: 1, value: 30, svg: { fill: '#6366F1' }, label: 'Academic' },
        { key: 2, value: 25, svg: { fill: '#8B5CF6' }, label: 'Cultural' },
        { key: 3, value: 20, svg: { fill: '#10B981' }, label: 'Volunteer' },
        { key: 4, value: 15, svg: { fill: '#F59E0B' }, label: 'Attendance' },
        { key: 5, value: 10, svg: { fill: '#EF4444' }, label: 'Achievement' },
      ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar
        title="Analytics Dashboard"
        subtitle="College-wide performance insights"
      />

      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search users or categories..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={theme.colors.primary} />
        }
      >
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
                  <Text style={styles.overviewStatLabel}>Students</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{faculty.length}</Text>
                  <Text style={styles.overviewStatLabel}>Faculty</Text>
                </View>
                <View style={styles.overviewStat}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={styles.overviewStatValue}>{berriesRedeemed.toLocaleString()}</Text>
                    <Image
                      /* @ts-ignore-Image path exists */
                      source={require('@/assets/images/berry.png')}
                      style={{ width: 16, height: 16 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.overviewStatLabel}>Berries Redeemed</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatValue}>{activeStudents}</Text>
                  <Text style={styles.overviewStatLabel}>Active Students</Text>
                </View>
              </View>
            </View>
          </GradientCard>
        </View>

        <View style={styles.section}>
          <View style={styles.metricsGrid}>
            <AnimatedCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={[styles.metricIcon, { backgroundColor: theme.colors.success + '20' }]}>
                  <TrendingUp size={20} color={theme.colors.success} />
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  {displayData.approvedPoints.toLocaleString()}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                  Total Points Awarded
                </Text>
              </View>
            </AnimatedCard>

            <AnimatedCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={[styles.metricIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Activity size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  {displayData.pendingRequests}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                  Pending Requests
                </Text>
              </View>
            </AnimatedCard>

            <AnimatedCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={[styles.metricIcon, { backgroundColor: theme.colors.accent + '20' }]}>
                  <Calendar size={20} color={theme.colors.accent} />
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  {activeEventsCount}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                  Active Events
                </Text>
              </View>
            </AnimatedCard>

            <AnimatedCard style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={[styles.metricIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
                  <Target size={20} color={theme.colors.secondary} />
                </View>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  {completedEventsCount}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                  Completed Events
                </Text>
              </View>
            </AnimatedCard>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Department Analysis
          </Text>
          <View style={styles.departmentList}>
            {departmentStats.map((dept: any) => (
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
                      {Number(dept.total_points).toLocaleString()}
                    </Text>
                    <Text style={[styles.departmentPointsLabel, { color: theme.colors.textSecondary }]}>
                      total points
                    </Text>
                  </View>
                  <View style={styles.departmentProgress}>
                    <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min((Number(dept.total_points) / 50000) * 100, 100)}%`,
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

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Berry Distribution by Category
          </Text>

          <AnimatedCard style={styles.chartCard}>
            <View style={styles.chartContainer}>
              <PieChart
                style={styles.chart}
                data={categoryData}
                innerRadius={isMobile ? 40 : 60}
                outerRadius={isMobile ? 70 : 100}
                labelRadius={isMobile ? 80 : 120}
                padAngle={0.02}
              />
              <View style={styles.chartLegend}>
                {categoryData.map((item: any, index: number) => (
                  <View key={item.key} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.svg.fill }]} />
                    <Text style={[styles.legendText, { color: theme.colors.text }]}>
                      {item.label}: {item.value || 0}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </AnimatedCard>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Awards
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
                        {transaction.reason}
                      </Text>
                      <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
                        {new Date(transaction.date).toLocaleDateString()}
                        {transaction.type && ` • ${transaction.type}`}
                      </Text>
                    </View>
                    <Text style={[styles.transactionPoints, { color: theme.colors.success }]}>
                      +{transaction.amount}
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

const getStyles = (theme: any, isMobile: boolean, width: number) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    width: isMobile ? '45%' : '22%',
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
    width: isMobile ? (width - 52) / 2 : (width - 64) / 2,
    minHeight: 44,
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
  chartCard: {
    marginBottom: 0,
  },
  chartContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  chart: {
    height: isMobile ? 150 : 200,
    width: isMobile ? 150 : 200,
  },
  chartLegend: {
    flex: 1,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});