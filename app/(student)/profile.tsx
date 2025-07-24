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
import { Student } from '@/types';
import { mockBadges, mockAchievements } from '@/data/mockData';
import GradientCard from '@/components/GradientCard';
import AnimatedCard from '@/components/AnimatedCard';
import { 
  Trophy, 
  Star, 
  Calendar, 
  Award, 
  TrendingUp, 
  Eye, 
  Settings,
  User
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function StudentProfile() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const student = user as Student;

  const approvedAchievements = mockAchievements.filter(a => a.status === 'approved');
  const recentBadges = mockBadges.slice(0, 6);

  const handlePublicView = () => {
    router.push('/public');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/(student)/settings')}
        >
          <Settings size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.section}>
        <GradientCard gradientColors={theme.colors.gradient.primary}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: student?.profileImage }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{student?.name}</Text>
                <Text style={styles.profileDepartment}>
                  {student?.department} • Year {student?.year}
                </Text>
                <Text style={styles.profileEmail}>{student?.email}</Text>
              </View>
            </View>
            
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{student?.totalPoints}</Text>
                <Text style={styles.statLabel}>Total Points</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{approvedAchievements.length}</Text>
                <Text style={styles.statLabel}>Achievements</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{recentBadges.length}</Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
            </View>
          </View>
        </GradientCard>
      </View>

      {/* Progress Analytics */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Progress Analytics
        </Text>
        
        <View style={styles.analyticsGrid}>
          <AnimatedCard style={styles.analyticsCard}>
            <View style={styles.analyticsContent}>
              <View style={styles.analyticsHeader}>
                <TrendingUp size={20} color={theme.colors.success} />
                <Text style={[styles.analyticsValue, { color: theme.colors.text }]}>
                  +15%
                </Text>
              </View>
              <Text style={[styles.analyticsLabel, { color: theme.colors.textSecondary }]}>
                This Month
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '75%', backgroundColor: theme.colors.success }]} />
              </View>
            </View>
          </AnimatedCard>
          
          <AnimatedCard style={styles.analyticsCard}>
            <View style={styles.analyticsContent}>
              <View style={styles.analyticsHeader}>
                <Trophy size={20} color={theme.colors.accent} />
                <Text style={[styles.analyticsValue, { color: theme.colors.text }]}>
                  #12
                </Text>
              </View>
              <Text style={[styles.analyticsLabel, { color: theme.colors.textSecondary }]}>
                Class Rank
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%', backgroundColor: theme.colors.accent }]} />
              </View>
            </View>
          </AnimatedCard>
        </View>
      </View>

      {/* Recent Badges */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Badges
          </Text>
          <Text style={[styles.badgeCount, { color: theme.colors.textSecondary }]}>
            {recentBadges.length} earned
          </Text>
        </View>
        
        <View style={styles.badgesGrid}>
          {recentBadges.map((badge) => (
            <AnimatedCard key={badge.id} style={styles.badgeCard}>
              <View style={styles.badgeContent}>
                <View style={[styles.badgeIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Award size={24} color={theme.colors.primary} />
                </View>
                <Text style={[styles.badgeName, { color: theme.colors.text }]} numberOfLines={1}>
                  {badge.name}
                </Text>
                <Text style={[styles.badgeDate, { color: theme.colors.textSecondary }]}>
                  {new Date(badge.earnedAt).toLocaleDateString()}
                </Text>
              </View>
            </AnimatedCard>
          ))}
        </View>
      </View>

      {/* Achievements Dashboard */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Recent Achievements
        </Text>
        
        <View style={styles.achievementsList}>
          {approvedAchievements.slice(0, 3).map((achievement) => (
            <AnimatedCard key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementContent}>
                <View style={[
                  styles.achievementIcon, 
                  { backgroundColor: theme.colors.success + '20' }
                ]}>
                  <Star size={20} color={theme.colors.success} />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
                    {achievement.title}
                  </Text>
                  <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                    {achievement.description}
                  </Text>
                  <Text style={[styles.achievementDate, { color: theme.colors.textSecondary }]}>
                    {new Date(achievement.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.achievementPoints}>
                  <Text style={[styles.achievementPointsText, { color: theme.colors.primary }]}>
                    +{achievement.points}
                  </Text>
                </View>
              </View>
            </AnimatedCard>
          ))}
        </View>
      </View>

      {/* Public Dashboard Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.publicButton} onPress={handlePublicView}>
          <LinearGradient
            colors={theme.colors.gradient.secondary}
            style={styles.publicButtonGradient}
          >
            <Eye size={20} color="#FFFFFF" />
            <Text style={styles.publicButtonText}>View Public Dashboard</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  settingsButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileCard: {
    gap: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  profileDepartment: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  profileEmail: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  analyticsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  analyticsCard: {
    flex: 1,
  },
  analyticsContent: {
    gap: 8,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analyticsValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  analyticsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: (width - 64) / 3,
  },
  badgeContent: {
    alignItems: 'center',
    gap: 8,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  badgeDate: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    marginBottom: 0,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementIcon: {
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
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  achievementDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  achievementPoints: {
    alignItems: 'center',
  },
  achievementPointsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  publicButton: {
    borderRadius: 16,
  },
  publicButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  publicButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});