import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { mockAchievements } from '@/data/mockData';
import AnimatedCard from '@/components/AnimatedCard';
import { CircleCheck as CheckCircle, Circle as XCircle, Clock, FileText, Calendar } from 'lucide-react-native';

const filterOptions = ['All', 'Pending', 'Approved', 'Rejected'];

export default function FacultyApprovals() {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('Pending');
  const [achievements, setAchievements] = useState(mockAchievements);
  
  const filteredAchievements = achievements.filter(achievement => {
    if (selectedFilter === 'All') return true;
    return achievement.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleApprove = (achievementId: string) => {
    Alert.alert(
      'Approve Achievement',
      'Are you sure you want to approve this achievement?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: () => {
            setAchievements(prev =>
              prev.map(achievement =>
                achievement.id === achievementId
                  ? { ...achievement, status: 'approved' as const, approvedBy: '2' }
                  : achievement
              )
            );
            Alert.alert('Success', 'Achievement approved successfully!');
          }
        }
      ]
    );
  };

  const handleReject = (achievementId: string) => {
    Alert.alert(
      'Reject Achievement',
      'Are you sure you want to reject this achievement?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => {
            setAchievements(prev =>
              prev.map(achievement =>
                achievement.id === achievementId
                  ? { ...achievement, status: 'rejected' as const }
                  : achievement
              )
            );
            Alert.alert('Success', 'Achievement rejected.');
          }
        }
      ]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} color={theme.colors.success} />;
      case 'rejected':
        return <XCircle size={20} color={theme.colors.error} />;
      default:
        return <Clock size={20} color={theme.colors.warning} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return theme.colors.success;
      case 'rejected':
        return theme.colors.error;
      default:
        return theme.colors.warning;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Point Approvals
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Review and approve student achievements
        </Text>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
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

      {/* Achievements List */}
      <ScrollView 
        style={styles.achievementsList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.achievementsContainer}>
          {filteredAchievements.length === 0 ? (
            <AnimatedCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <FileText size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                  No {selectedFilter.toLowerCase()} achievements
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                  Check back later for new submissions.
                </Text>
              </View>
            </AnimatedCard>
          ) : (
            filteredAchievements.map((achievement) => (
              <AnimatedCard key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementContent}>
                  <View style={styles.achievementHeader}>
                    <View style={[
                      styles.statusIcon,
                      { backgroundColor: getStatusColor(achievement.status) + '20' }
                    ]}>
                      {getStatusIcon(achievement.status)}
                    </View>
                    <View style={styles.achievementInfo}>
                      <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
                        {achievement.title}
                      </Text>
                      <Text style={[styles.achievementCategory, { color: theme.colors.textSecondary }]}>
                        {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                      </Text>
                    </View>
                    <View style={styles.pointsBadge}>
                      <Text style={[styles.pointsText, { color: theme.colors.primary }]}>
                        +{achievement.points}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]}>
                    {achievement.description}
                  </Text>
                  
                  <View style={styles.achievementMeta}>
                    <Calendar size={14} color={theme.colors.textSecondary} />
                    <Text style={[styles.achievementDate, { color: theme.colors.textSecondary }]}>
                      {new Date(achievement.date).toLocaleDateString()}
                    </Text>
                    {achievement.proofUrl && (
                      <>
                        <Text style={[styles.separator, { color: theme.colors.textSecondary }]}>•</Text>
                        <Text style={[styles.proofText, { color: theme.colors.primary }]}>
                          Proof attached
                        </Text>
                      </>
                    )}
                  </View>
                  
                  {achievement.status === 'pending' && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
                        onPress={() => handleReject(achievement.id)}
                      >
                        <XCircle size={16} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Reject</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                        onPress={() => handleApprove(achievement.id)}
                      >
                        <CheckCircle size={16} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </AnimatedCard>
            ))
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
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  achievementsList: {
    flex: 1,
  },
  achievementsContainer: {
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
  achievementCard: {
    marginBottom: 0,
  },
  achievementContent: {
    gap: 12,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
    gap: 2,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  achievementCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textTransform: 'capitalize',
  },
  pointsBadge: {
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  achievementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  achievementDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  separator: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  proofText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});