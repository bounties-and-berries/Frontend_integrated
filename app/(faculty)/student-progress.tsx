import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { mockUsers, mockTransactions } from '@/data/mockData';
import { Student } from '@/types';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Search, TrendingUp, Award, Calendar, Users, Filter, Star, Target, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const departmentFilters = ['All', 'Computer Science', 'Engineering', 'Business', 'Arts'];
const yearFilters = ['All', '1', '2', '3', '4'];

export default function StudentProgress() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  
  const students = mockUsers.filter(user => user.role === 'student') as Student[];
  
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || student.department === selectedDepartment;
    const matchesYear = selectedYear === 'All' || student.year.toString() === selectedYear;
    
    return matchesSearch && matchesDepartment && matchesYear;
  });

  const getStudentProgress = (studentId: string) => {
    const studentTransactions = mockTransactions.filter(t => t.studentId === studentId && t.type === 'earned');
    const thisMonth = studentTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      const now = new Date();
      return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
    });
    
    return {
      totalEarned: studentTransactions.reduce((sum, t) => sum + t.points, 0),
      thisMonth: thisMonth.reduce((sum, t) => sum + t.points, 0),
      activitiesCount: studentTransactions.length,
    };
  };

  const getPerformanceLevel = (points: number) => {
    if (points >= 2000) return { level: 'Elite', color: '#FFD700', gradient: ['#FFD700', '#FFA500'] };
    if (points >= 1500) return { level: 'Excellent', color: '#4CAF50', gradient: ['#4CAF50', '#45A049'] };
    if (points >= 1000) return { level: 'Good', color: '#2196F3', gradient: ['#2196F3', '#1976D2'] };
    if (points >= 500) return { level: 'Average', color: '#FF9800', gradient: ['#FF9800', '#F57C00'] };
    return { level: 'Beginner', color: '#9E9E9E', gradient: ['#9E9E9E', '#757575'] };
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Student Progress"
        subtitle="Track individual performance & achievements"
      />

      {/* Modern Search and Filter Section */}
      <View style={styles.filtersSection}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search students by name..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Modern Filter Pills */}
        <View style={styles.filterPillsContainer}>
          <View style={styles.filterRow}>
            <View style={styles.filterLabelContainer}>
              <Text style={[styles.filterLabel, { color: theme.colors.textSecondary }]}>
                Department
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
              <View style={styles.pillsContainer}>
                {departmentFilters.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    style={[
                      styles.filterPill,
                      {
                        backgroundColor: selectedDepartment === dept 
                          ? theme.colors.primary 
                          : 'transparent',
                        borderColor: selectedDepartment === dept 
                          ? theme.colors.primary 
                          : theme.colors.border,
                      }
                    ]}
                    onPress={() => setSelectedDepartment(dept)}
                  >
                    <Text style={[
                      styles.filterPillText,
                      { 
                        color: selectedDepartment === dept 
                          ? '#FFFFFF' 
                          : theme.colors.textSecondary 
                      }
                    ]}>
                      {dept}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterRow}>
            <View style={styles.filterLabelContainer}>
              <Text style={[styles.filterLabel, { color: theme.colors.textSecondary }]}>
                Year
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
              <View style={styles.pillsContainer}>
                {yearFilters.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.filterPill,
                      {
                        backgroundColor: selectedYear === year 
                          ? theme.colors.secondary 
                          : 'transparent',
                        borderColor: selectedYear === year 
                          ? theme.colors.secondary 
                          : theme.colors.border,
                      }
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text style={[
                      styles.filterPillText,
                      { 
                        color: selectedYear === year 
                          ? '#FFFFFF' 
                          : theme.colors.textSecondary 
                      }
                    ]}>
                      {year === 'All' ? 'All Years' : `Year ${year}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Students List */}
      <ScrollView 
        style={styles.studentsList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.studentsContainer}>
          {filteredStudents.length === 0 ? (
            <AnimatedCard style={styles.emptyCard}>
              <LinearGradient
                colors={['rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 0.05)']}
                style={styles.emptyGradient}
              >
                <View style={styles.emptyContent}>
                  <View style={[styles.emptyIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                    <Users size={32} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                    No Students Found
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                    Try adjusting your search criteria or filters
                  </Text>
                </View>
              </LinearGradient>
            </AnimatedCard>
          ) : (
            filteredStudents.map((student, index) => {
              const progress = getStudentProgress(student.id);
              const performance = getPerformanceLevel(student.totalPoints);
              
              return (
                <AnimatedCard key={student.id} style={styles.studentCard}>
                  <LinearGradient
                    colors={performance.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                  >
                    <View style={styles.cardContent}>
                      {/* Header Section */}
                      <View style={styles.studentHeader}>
                        <View style={styles.profileSection}>
                          <View style={styles.imageContainer}>
                            <Image
                              source={{ uri: student.profileImage }}
                              style={styles.studentImage}
                            />
                            <View style={[styles.statusBadge, { backgroundColor: performance.color }]}>
                              <Star size={8} color="#FFFFFF" />
                            </View>
                          </View>
                          <View style={styles.studentInfo}>
                            <Text style={styles.studentName}>
                              {student.name}
                            </Text>
                            <Text style={styles.studentDetails}>
                              {student.department} • Year {student.year}
                            </Text>
                            <View style={styles.performanceBadge}>
                              <Text style={styles.performanceText}>
                                {performance.level}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.pointsSection}>
                          <Text style={styles.totalPointsValue}>
                            {student.totalPoints.toLocaleString()}
                          </Text>
                          <Text style={styles.totalPointsLabel}>
                            Total Berries
                          </Text>
                        </View>
                      </View>

                      {/* Stats Grid */}
                      <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                          <View style={[styles.statIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                            <Zap size={16} color="#FFFFFF" />
                          </View>
                          <Text style={styles.statValue}>{progress.thisMonth}</Text>
                          <Text style={styles.statLabel}>This Month</Text>
                        </View>

                        <View style={styles.statCard}>
                          <View style={[styles.statIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                            <Award size={16} color="#FFFFFF" />
                          </View>
                          <Text style={styles.statValue}>{progress.activitiesCount}</Text>
                          <Text style={styles.statLabel}>Activities</Text>
                        </View>

                        <View style={styles.statCard}>
                          <View style={[styles.statIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                            <Target size={16} color="#FFFFFF" />
                          </View>
                          <Text style={styles.statValue}>{Math.floor(Math.random() * 30) + 70}%</Text>
                          <Text style={styles.statLabel}>Attendance</Text>
                        </View>
                      </View>

                      {/* Progress Bar */}
                      <View style={styles.progressSection}>
                        <View style={styles.progressHeader}>
                          <Text style={styles.progressLabel}>Monthly Goal Progress</Text>
                          <Text style={styles.progressPercentage}>
                            {Math.round((progress.thisMonth / 500) * 100)}%
                          </Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                          <View style={styles.progressBar}>
                            <View 
                              style={[
                                styles.progressFill, 
                                { 
                                  width: `${Math.min((progress.thisMonth / 500) * 100, 100)}%`,
                                }
                              ]} 
                            />
                          </View>
                          <Text style={styles.progressTarget}>Target: 500 berries</Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </AnimatedCard>
              );
            })
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
  filtersSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterPillsContainer: {
    gap: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterLabelContainer: {
    minWidth: 80,
  },
  filterLabel: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillsScroll: {
    flex: 1,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 20,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterPillText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  studentsList: {
    flex: 1,
  },
  studentsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  emptyCard: {
    marginBottom: 0,
  },
  emptyGradient: {
    borderRadius: 16,
    padding: 40,
  },
  emptyContent: {
    alignItems: 'center',
    gap: 16,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    opacity: 0.8,
  },
  studentCard: {
    marginBottom: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 20,
  },
  cardContent: {
    padding: 20,
    gap: 20,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  studentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  studentInfo: {
    flex: 1,
    gap: 4,
  },
  studentName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  studentDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  performanceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  performanceText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  pointsSection: {
    alignItems: 'flex-end',
  },
  totalPointsValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  totalPointsLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  progressBarContainer: {
    gap: 6,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressTarget: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
});