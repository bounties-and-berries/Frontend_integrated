import { Image } from 'expo-image';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { getStudentsProgress } from '@/utils/api';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { 
  Search, 
  TrendingUp, 
  Award, 
  Calendar, 
  Users, 
  Filter, 
  ChevronRight, 
  Zap, 
  Target,
  Activity,
  Layers,
  BarChart3,
  Flame,
  Star
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsive } from '@/hooks/useResponsive';

const departmentFilters = ['All', 'Computer Science', 'Engineering', 'Business', 'Arts'];

export default function StudentAnalysis() {
  const { theme } = useTheme();
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const { data: progressData, isLoading } = useQuery({
    queryKey: ['students-progress'],
    queryFn: getStudentsProgress,
  });

  const students = useMemo(() => {
    if (Array.isArray(progressData)) return progressData;
    if (progressData && Array.isArray(progressData.data)) return progressData.data;
    if (progressData && Array.isArray(progressData.results)) return progressData.results;
    return [];
  }, [progressData]);

  const filteredStudents = useMemo(() => {
    return students.filter((student: any) => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = selectedDepartment === 'All' || student.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [students, searchQuery, selectedDepartment]);

  const stats = useMemo(() => {
    if (!students || students.length === 0) return { total: 0, avgPoints: 0, activeRate: 0 };
    const total = students.length;
    const avgPoints = Math.round(students.reduce((sum: number, s: any) => sum + (Number(s.totalPoints) || 0), 0) / total);
    const activeOnes = students.filter((s: any) => (Number(s.thisMonth) || 0) > 100).length;
    const activeRate = Math.round((activeOnes / total) * 100);
    return { total, avgPoints, activeRate };
  }, [students]);

  const isWide = !isMobile;
  const cardWidth = isWide ? (width - 60) / 2 : width - 40;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar
        title="Faculty Hub"
        subtitle="Insights & Intelligence"
        showBackButton={false}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Creative Recap Header */}
        <View style={styles.recapContainer}>
          <LinearGradient
            colors={theme.colors.gradient.primary as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.recapCard}
          >
            <View style={styles.recapContent}>
              <View style={styles.recapTextSection}>
                <View style={styles.momentumBadge}>
                  <Flame size={12} color="#FFF" />
                  <Text style={styles.recapLabel}>COHORT MOMENTUM</Text>
                </View>
                <Text style={styles.recapValue}>{stats.activeRate}%</Text>
                <Text style={styles.recapSubtext}>Active engagement this month</Text>
              </View>
              <View style={styles.recapCircle}>
                <BarChart3 size={32} color="#FFF" />
              </View>
            </View>
            
            <View style={styles.recapFooter}>
              <View style={styles.miniStat}>
                <Users size={14} color="#FFF" />
                <Text style={styles.miniStatText}>{stats.total} Total Students</Text>
              </View>
              <View style={[styles.miniStat, { marginLeft: 20 }]}>
                <Star size={14} color="#FFF" />
                <Text style={styles.miniStatText}>{stats.avgPoints} Avg XP</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Intelligent Filters */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Search size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search by student name..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
            {departmentFilters.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.filterPill,
                  { 
                    backgroundColor: selectedDepartment === dept ? theme.colors.primary : 'transparent',
                    borderColor: selectedDepartment === dept ? theme.colors.primary : theme.colors.border
                  }
                ]}
                onPress={() => setSelectedDepartment(dept)}
              >
                <Text style={[
                  styles.filterText, 
                  { color: selectedDepartment === dept ? '#FFF' : theme.colors.textSecondary }
                ]}>
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Dynamic Analysis Grid */}
        <View style={styles.analysisGrid}>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
          ) : filteredStudents.length === 0 ? (
            <View style={styles.emptyState}>
              <Activity size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Frequency Detected</Text>
              <Text style={[styles.emptyBody, { color: theme.colors.textSecondary }]}>Adjust filters to find students in the system.</Text>
            </View>
          ) : (
            <View style={styles.gridWrapper}>
              {filteredStudents.map((student: any) => (
                <AnimatedCard key={student.id} style={[styles.hubCard, { width: cardWidth }]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.avatarRow}>
                      <View style={styles.avatarContainer}>
                        <Image
                          source={student.profileImage ? { uri: student.profileImage } : require('@/assets/images/default-avatar.png')}
                          style={styles.mainAvatar}
                        />
                        <View style={[styles.activeIndicator, { backgroundColor: (Number(student.thisMonth) || 0) > 50 ? theme.colors.success : theme.colors.warning }]} />
                      </View>
                      
                      <View style={styles.nameStack}>
                        <Text style={[styles.studentName, { color: theme.colors.text }]} numberOfLines={1}>
                          {student.name}
                        </Text>
                        <View style={styles.metaRow}>
                          <Layers size={10} color={theme.colors.textSecondary} />
                          <Text style={[styles.studentMeta, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                            {student.department}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.pointHub, { backgroundColor: theme.colors.primary + '10' }]}>
                      <Text style={[styles.pointValue, { color: theme.colors.primary }]}>{student.totalPoints}</Text>
                      <Text style={[styles.pointLabel, { color: theme.colors.textSecondary }]}>XP</Text>
                    </View>
                  </View>

                  {/* Progressive Metric Visualization */}
                  <View style={styles.metricVisualizer}>
                    <View style={styles.radialProgress}>
                       <View style={styles.radialLabels}>
                         <Text style={[styles.radLabel, { color: theme.colors.textSecondary }]}>Momentum</Text>
                         <Text style={[styles.radValue, { color: theme.colors.text }]}>+{student.thisMonth}</Text>
                       </View>
                       <View style={[styles.radialBar, { backgroundColor: theme.colors.border }]}>
                          <View style={[
                            styles.radialFill, 
                            { 
                              width: `${Math.min(100, (Number(student.thisMonth) / 500) * 100)}%`,
                              backgroundColor: theme.colors.primary 
                            }
                          ]} />
                       </View>
                    </View>

                    <View style={styles.statsStrip}>
                      <View style={styles.stripItem}>
                        <Activity size={12} color={theme.colors.accent} />
                        <Text style={[styles.stripValue, { color: theme.colors.text }]}>{student.activitiesCount}</Text>
                        <Text style={styles.stripLabel}>TASKS</Text>
                      </View>
                      <View style={styles.stripDivider} />
                      <View style={styles.stripItem}>
                        <Target size={12} color={theme.colors.success} />
                        <Text style={[styles.stripValue, { color: theme.colors.text }]}>{student.attendance || 90}%</Text>
                        <Text style={styles.stripLabel}>ATTENDANCE</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={[styles.viewProfileBtn, { backgroundColor: theme.colors.surface }]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.viewProfileText, { color: theme.colors.primary }]}>Analyze Individual</Text>
                    <ChevronRight size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                </AnimatedCard>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollPadding: { paddingBottom: 140 }, // Space for floating bottom panel
  
  recapContainer: { paddingHorizontal: 20, paddingTop: 16 },
  recapCard: { borderRadius: 32, padding: 24, overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  recapContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recapTextSection: { gap: 4, flex: 1 },
  momentumBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 4 },
  recapLabel: { color: '#FFF', fontSize: 10, fontFamily: 'Poppins-Bold', letterSpacing: 1 },
  recapValue: { color: '#FFF', fontSize: 42, fontFamily: 'Poppins-Bold' },
  recapSubtext: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: 'Inter-Regular' },
  recapCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  recapFooter: { flexDirection: 'row', marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  miniStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniStatText: { color: '#FFF', fontSize: 13, fontFamily: 'Inter-Medium' },

  searchSection: { paddingHorizontal: 20, marginTop: 24, gap: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56, borderRadius: 20, borderWidth: 1, gap: 12 },
  searchInput: { flex: 1, fontSize: 16, fontFamily: 'Inter-Medium' },
  
  filterBar: { flexDirection: 'row', marginTop: 4 },
  filterPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, marginRight: 10 },
  filterText: { fontSize: 13, fontFamily: 'Poppins-SemiBold' },

  analysisGrid: { paddingHorizontal: 20, marginTop: 24 },
  gridWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  hubCard: { padding: 20, borderRadius: 28, gap: 20, borderWeight: 1, borderColor: 'rgba(0,0,0,0.05)' },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatarContainer: { position: 'relative' },
  mainAvatar: { width: 50, height: 50, borderRadius: 20 },
  activeIndicator: { position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#FFF' },
  
  nameStack: { flex: 1, gap: 1 },
  studentName: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  studentMeta: { fontSize: 12, fontFamily: 'Inter-Medium' },
  
  pointHub: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, minWidth: 60 },
  pointValue: { fontSize: 18, fontFamily: 'Poppins-Bold' },
  pointLabel: { fontSize: 10, fontFamily: 'Poppins-ExtraBold', marginTop: -4 },

  metricVisualizer: { gap: 16 },
  radialProgress: { gap: 10 },
  radialBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  radialFill: { height: '100%', borderRadius: 4 },
  radialLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  radLabel: { fontSize: 13, fontFamily: 'Inter-Medium' },
  radValue: { fontSize: 13, fontFamily: 'Poppins-Bold' },

  statsStrip: { flexDirection: 'row', padding: 14, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.02)', justifyContent: 'space-around', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  stripItem: { alignItems: 'center', gap: 4 },
  stripValue: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  stripLabel: { fontSize: 9, fontFamily: 'Inter-Bold', opacity: 0.5, letterSpacing: 0.5 },
  stripDivider: { width: 1, height: '70%', backgroundColor: 'rgba(0,0,0,0.1)', alignSelf: 'center' },

  viewProfileBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 18, gap: 8 },
  viewProfileText: { fontSize: 14, fontFamily: 'Poppins-SemiBold' },

  loader: { marginTop: 40 },
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: 12, width: '100%' },
  emptyTitle: { fontSize: 20, fontFamily: 'Poppins-Bold' },
  emptyBody: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center' }
});