import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { mockUsers } from '@/data/mockData';
import { Student, Faculty } from '@/types';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { User, Mail, Calendar, GraduationCap, BookOpen, CreditCard as Edit, Trash2, Award, Trophy } from 'lucide-react-native';

export default function UserDetails() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const user = mockUsers.find(u => u.id === id);

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TopMenuBar title="User Not Found" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            User not found
          </Text>
        </View>
      </View>
    );
  }

  const handleEdit = () => {
    Alert.alert('Edit User', 'Edit functionality will be available soon.');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'User deleted successfully!');
            router.back();
          }
        }
      ]
    );
  };

  const handleResetPassword = () => {
    Alert.alert(
      'Reset Password',
      `Send password reset email to ${user.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: () => {
            Alert.alert('Success', 'Password reset email sent!');
          }
        }
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return theme.colors.primary;
      case 'faculty':
        return theme.colors.secondary;
      case 'admin':
        return theme.colors.accent;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return GraduationCap;
      case 'faculty':
        return BookOpen;
      case 'admin':
        return User;
      default:
        return User;
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="User Details"
        subtitle="Manage user information"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile */}
        <View style={styles.section}>
          <AnimatedCard style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: user.profileImage }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={[styles.userName, { color: theme.colors.text }]}>
                  {user.name}
                </Text>
                <View style={[
                  styles.roleTag,
                  { backgroundColor: getRoleColor(user.role) + '20' }
                ]}>
                  <RoleIcon size={16} color={getRoleColor(user.role)} />
                  <Text style={[
                    styles.roleText,
                    { color: getRoleColor(user.role) }
                  ]}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Basic Information
          </Text>
          
          <AnimatedCard style={styles.infoCard}>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Mail size={20} color={theme.colors.textSecondary} />
                <View>
                  <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                    Email
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                    {user.email}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Calendar size={20} color={theme.colors.textSecondary} />
                <View>
                  <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                    Joined
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {user.role === 'student' && (
                <>
                  <View style={styles.infoItem}>
                    <GraduationCap size={20} color={theme.colors.textSecondary} />
                    <View>
                      <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                        Department
                      </Text>
                      <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                        {(user as Student).department}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <BookOpen size={20} color={theme.colors.textSecondary} />
                    <View>
                      <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                        Year
                      </Text>
                      <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                        Year {(user as Student).year}
                      </Text>
                    </View>
                  </View>
                </>
              )}

              {user.role === 'faculty' && (
                <>
                  <View style={styles.infoItem}>
                    <GraduationCap size={20} color={theme.colors.textSecondary} />
                    <View>
                      <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                        Department
                      </Text>
                      <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                        {(user as Faculty).department}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <BookOpen size={20} color={theme.colors.textSecondary} />
                    <View>
                      <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                        Subject
                      </Text>
                      <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                        {(user as Faculty).subject}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </AnimatedCard>
        </View>

        {/* Student Statistics */}
        {user.role === 'student' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Student Statistics
            </Text>
            
            <AnimatedCard style={styles.statsCard}>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                    <Trophy size={24} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>
                    {(user as Student).totalPoints}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Total Berries
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
                    <Award size={24} color={theme.colors.success} />
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>
                    {(user as Student).achievements.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Achievements
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: theme.colors.accent + '20' }]}>
                    <Award size={24} color={theme.colors.accent} />
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>
                    {(user as Student).badges.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Badges
                  </Text>
                </View>
              </View>
            </AnimatedCard>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.section}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
              onPress={handleEdit}
            >
              <Edit size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Edit User</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.warning }]}
              onPress={handleResetPassword}
            >
              <Mail size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Delete User</Text>
          </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  profileCard: {
    marginBottom: 0,
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
  },
  profileInfo: {
    flex: 1,
    gap: 8,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  infoCard: {
    marginBottom: 0,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  statsCard: {
    marginBottom: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});