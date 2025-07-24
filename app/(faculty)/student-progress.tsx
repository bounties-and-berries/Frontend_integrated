import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { mockUsers, mockTransactions } from '@/data/mockData';
import { Student } from '@/types';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Search, TrendingUp, Award, Calendar, Users, Filter } from 'lucide-react-native';

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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Student Progress"
        subtitle="Monitor individual student performance"
      />

      {/* Search and Filters */}
      <View style={styles.filtersSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search students..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterButtons}>
            <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Department:</Text>
            {departmentFilters.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selectedDepartment === dept 
                      ? theme.colors.primary 
                      : theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => setSelectedDepartment(dept)}
              >
                <Text style={[
                  styles.filterButtonText,
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterButtons}>
            <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Year:</Text>
            {yearFilters.map((year) => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selectedYear === year 
                      ? theme.colors.secondary 
                      : theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => setSelectedYear(year)}
              >
                <Text style={[
                  styles.filterButtonText,
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

      {/* Students List */}
      <ScrollView 
        style={styles.studentsList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.studentsContainer}>
          {filteredStudents.length === 0 ? (
            <AnimatedCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Users size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                  No Students Found
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                  Try adjusting your search or filters.
                </Text>
              </View>
            </AnimatedCard>
          ) : (
            filteredStudents.map((student) => {
              const progress = getStudentProgress(student.id);
              
              return (
                <AnimatedCard key={student.id} style={styles.studentCard}>
                  <View style={styles.studentContent}>
                    <View style={styles.studentHeader}>
                      <Image
                        source={{ uri: student.profileImage }}
                        style={styles.studentImage}
                      />
                      <View style={styles.studentInfo}>
                        <Text style={[styles.studentName, { color: theme.colors.text }]}>
                          {student.name}
                        </Text>
                        <Text style={[styles.studentDetails, { color: theme.colors.textSecondary }]}>
                          {student.department} • Year {student.year}
                        </Text>
                        <Text style={[styles.studentEmail, { color: theme.colors.textSecondary }]}>
                          {student.email}
                        </Text>
                      </View>
                      <View style={styles.totalPoints}>
                        <Text style={[styles.totalPointsValue, { color: theme.colors.primary }]}>
                          {student.totalPoints}
                        </Text>
                        <Text style={[styles.totalPointsLabel, { color: theme.colors.textSecondary }]}>
                          total berries
                        </Text>
                      </View>
                    </View>

                    <View style={styles.progressStats}>
                      <View style={styles.statItem}>
                        <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
                          <TrendingUp size={16} color={theme.colors.success} />
                        </View>
                        <View>
                          <Text style={[styles.statValue, { color: theme.colors.text }]}>
                            {progress.thisMonth}
                          </Text>
                          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                            This Month
                          </Text>
                        </View>
                      </View>

                      <View style={styles.statItem}>
                        <View style={[styles.statIcon, { backgroundColor: theme.colors.accent + '20' }]}>
                          <Award size={16} color={theme.colors.accent} />
                        </View>
                        <View>
                          <Text style={[styles.statValue, { color: theme.colors.text }]}>
                            {progress.activitiesCount}
                          </Text>
                          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                            Activities
                          </Text>
                        </View>
                      </View>

                      <View style={styles.statItem}>
                        <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                          <Calendar size={16} color={theme.colors.primary} />
                        </View>
                        <View>
                          <Text style={[styles.statValue, { color: theme.colors.text }]}>
                            {Math.floor(Math.random() * 30) + 70}%
                          </Text>
                          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                            Attendance
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarHeader}>
                        <Text style={[styles.progressBarLabel, { color: theme.colors.textSecondary }]}>
                          Monthly Progress
                        </Text>
                        <Text style={[styles.progressBarValue, { color: theme.colors.primary }]}>
                          {Math.round((progress.thisMonth / 500) * 100)}%
                        </Text>
                      </View>
                      <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { 
                              width: `${Math.min((progress.thisMonth / 500) * 100, 100)}%`,
                              backgroundColor: theme.colors.primary 
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>
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
    gap: 12,
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
  filterButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
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
  studentCard: {
    marginBottom: 0,
  },
  studentContent: {
    gap: 16,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  studentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  studentInfo: {
    flex: 1,
    gap: 2,
  },
  studentName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  studentDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  studentEmail: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  totalPoints: {
    alignItems: 'flex-end',
  },
  totalPointsValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  totalPointsLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  progressBarValue: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});