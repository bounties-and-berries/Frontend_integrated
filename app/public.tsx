import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { mockUsers, mockAchievements, mockBadges } from '@/data/mockData';
import { Student } from '@/types';
import AnimatedCard from '@/components/AnimatedCard';
import { 
  Search, 
  Trophy, 
  Star, 
  Award, 
  ArrowLeft,
  Medal,
  TrendingUp
} from 'lucide-react-native';

export default function PublicDashboard() {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const students = mockUsers.filter(user => user.role === 'student') as Student[];
  const sortedStudents = students.sort((a, b) => b.totalPoints - a.totalPoints);
  
  const filteredStudents = sortedStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStudentRank = (studentId: string) => {
    return sortedStudents.findIndex(s => s.id === studentId) + 1;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={20} color="#FFD700" />;
      case 2:
        return <Medal size={20} color="#C0C0C0" />;
      case 3:
        return <Award size={20} color="#CD7F32" />;
      default:
        return <Star size={20} color={theme.colors.textSecondary} />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={theme.colors.gradient.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Public Leaderboard</Text>
            <Text style={styles.headerSubtitle}>
              Student Achievement Rankings
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchSection}>
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
      </View>

      {/* Top 3 Students */}
      <View style={styles.topStudentsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Top Performers
        </Text>
        <View style={styles.podium}>
          {sortedStudents.slice(0, 3).map((student, index) => {
            const rank = index + 1;
            return (
              <AnimatedCard key={student.id} style={[styles.podiumCard, { flex: rank === 1 ? 1.2 : 1 }]}>
                <View style={styles.podiumContent}>
                  <View style={[
                    styles.rankBadge,
                    { backgroundColor: getRankColor(rank) + '20' }
                  ]}>
                    {getRankIcon(rank)}
                  </View>
                  <Image
                    source={{ uri: student.profileImage }}
                    style={[
                      styles.podiumImage,
                      rank === 1 && styles.firstPlaceImage
                    ]}
                  />
                  <Text style={[styles.podiumName, { color: theme.colors.text }]} numberOfLines={1}>
                    {student.name}
                  </Text>
                  <Text style={[styles.podiumDepartment, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {student.department}
                  </Text>
                  <View style={styles.podiumPoints}>
                    <Text style={[styles.podiumPointsText, { color: theme.colors.primary }]}>
                      {student.totalPoints}
                    </Text>
                    <Text style={[styles.podiumPointsLabel, { color: theme.colors.textSecondary }]}>
                      points
                    </Text>
                  </View>
                </View>
              </AnimatedCard>
            );
          })}
        </View>
      </View>

      {/* All Students List */}
      <View style={styles.studentsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          All Students
        </Text>
        
        <ScrollView 
          style={styles.studentsList}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.studentsContainer}>
            {filteredStudents.map((student) => {
              const rank = getStudentRank(student.id);
              const approvedAchievements = mockAchievements.filter(a => a.status === 'approved').length;
              
              return (
                <AnimatedCard key={student.id} style={styles.studentCard}>
                  <View style={styles.studentContent}>
                    <View style={styles.studentLeft}>
                      <View style={[
                        styles.rankContainer,
                        { backgroundColor: getRankColor(rank) + '20' }
                      ]}>
                        <Text style={[
                          styles.rankText,
                          { color: getRankColor(rank) }
                        ]}>
                          #{rank}
                        </Text>
                      </View>
                      <Image
                        source={{ uri: student.profileImage }}
                        style={styles.studentImage}
                      />
                      <View style={styles.studentInfo}>
                        <Text style={[styles.studentName, { color: theme.colors.text }]}>
                          {student.name}
                        </Text>
                        <Text style={[styles.studentDepartment, { color: theme.colors.textSecondary }]}>
                          {student.department} • Year {student.year}
                        </Text>
                        <View style={styles.studentStats}>
                          <View style={styles.statItem}>
                            <Star size={12} color={theme.colors.accent} />
                            <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                              {approvedAchievements} achievements
                            </Text>
                          </View>
                          <View style={styles.statItem}>
                            <Award size={12} color={theme.colors.secondary} />
                            <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                              {mockBadges.length} badges
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.studentRight}>
                      <View style={styles.pointsContainer}>
                        <Text style={[styles.pointsValue, { color: theme.colors.primary }]}>
                          {student.totalPoints}
                        </Text>
                        <Text style={[styles.pointsLabel, { color: theme.colors.textSecondary }]}>
                          points
                        </Text>
                      </View>
                      <View style={styles.trendContainer}>
                        <TrendingUp size={16} color={theme.colors.success} />
                        <Text style={[styles.trendText, { color: theme.colors.success }]}>
                          +12%
                        </Text>
                      </View>
                    </View>
                  </View>
                </AnimatedCard>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
    marginTop: 4,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  topStudentsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  podium: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  podiumCard: {
    marginBottom: 0,
  },
  podiumContent: {
    alignItems: 'center',
    gap: 8,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  firstPlaceImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  podiumName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  podiumDepartment: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  podiumPoints: {
    alignItems: 'center',
    marginTop: 4,
  },
  podiumPointsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  podiumPointsLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  studentsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  studentsList: {
    flex: 1,
  },
  studentsContainer: {
    paddingBottom: 20,
    gap: 12,
  },
  studentCard: {
    marginBottom: 0,
  },
  studentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  studentInfo: {
    flex: 1,
    gap: 2,
  },
  studentName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  studentDepartment: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  studentStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  studentRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  pointsLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
});