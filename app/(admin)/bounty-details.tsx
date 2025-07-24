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
import { mockEvents } from '@/data/mockData';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Calendar, MapPin, Users, Star, CreditCard as Edit, Trash2, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function BountyDetails() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const bounty = mockEvents.find(event => event.id === id);

  if (!bounty) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TopMenuBar title="Bounty Not Found" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Bounty not found
          </Text>
        </View>
      </View>
    );
  }

  const handleEdit = () => {
    Alert.alert('Edit Bounty', 'Edit functionality will be available soon.');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Bounty',
      'Are you sure you want to delete this bounty?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Bounty deleted successfully!');
            router.back();
          }
        }
      ]
    );
  };

  const handleToggleStatus = () => {
    const isActive = new Date(bounty.registrationDeadline) > new Date();
    const action = isActive ? 'close' : 'reopen';
    
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Registration`,
      `Are you sure you want to ${action} registration for this bounty?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action.charAt(0).toUpperCase() + action.slice(1), 
          onPress: () => {
            Alert.alert('Success', `Registration ${action}ed successfully!`);
          }
        }
      ]
    );
  };

  const isRegistrationOpen = new Date(bounty.registrationDeadline) > new Date();
  const participationRate = (bounty.currentParticipants / bounty.maxParticipants) * 100;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Bounty Details"
        subtitle="Manage bounty information"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bounty Image */}
        <View style={styles.imageSection}>
          <Image source={{ uri: bounty.image }} style={styles.bountyImage} />
          <View style={[
            styles.statusBadge,
            { backgroundColor: isRegistrationOpen ? theme.colors.success : theme.colors.error }
          ]}>
            <Text style={styles.statusText}>
              {isRegistrationOpen ? 'Active' : 'Closed'}
            </Text>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <AnimatedCard style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={[
                styles.categoryTag,
                { backgroundColor: theme.colors.primary + '20' }
              ]}>
                <Text style={[styles.categoryText, { color: theme.colors.primary }]}>
                  {bounty.category.toUpperCase()}
                </Text>
              </View>
              <View style={styles.berriesContainer}>
                <Star size={16} color={theme.colors.accent} />
                <Text style={[styles.berriesText, { color: theme.colors.accent }]}>
                  {bounty.points} berries
                </Text>
              </View>
            </View>

            <Text style={[styles.bountyTitle, { color: theme.colors.text }]}>
              {bounty.title}
            </Text>
            
            <Text style={[styles.bountyDescription, { color: theme.colors.textSecondary }]}>
              {bounty.description}
            </Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Calendar size={20} color={theme.colors.textSecondary} />
                <View>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Date
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                    {new Date(bounty.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <MapPin size={20} color={theme.colors.textSecondary} />
                <View>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Location
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                    {bounty.location}
                  </Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Users size={20} color={theme.colors.textSecondary} />
                <View>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Participants
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                    {bounty.currentParticipants}/{bounty.maxParticipants}
                  </Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <CheckCircle size={20} color={theme.colors.textSecondary} />
                <View>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Registration Deadline
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                    {new Date(bounty.registrationDeadline).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Participation Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Participation Statistics
          </Text>
          
          <AnimatedCard style={styles.statsCard}>
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                  {bounty.currentParticipants}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Registered
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.secondary }]}>
                  {bounty.maxParticipants - bounty.currentParticipants}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Available
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.accent }]}>
                  {Math.round(participationRate)}%
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Filled
                </Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${participationRate}%`,
                      backgroundColor: theme.colors.primary 
                    }
                  ]} 
                />
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
              onPress={handleEdit}
            >
              <Edit size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Edit Bounty</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { 
                backgroundColor: isRegistrationOpen ? theme.colors.warning : theme.colors.success 
              }]}
              onPress={handleToggleStatus}
            >
              <CheckCircle size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {isRegistrationOpen ? 'Close Registration' : 'Reopen Registration'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Delete Bounty</Text>
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
  imageSection: {
    position: 'relative',
    marginBottom: 20,
  },
  bountyImage: {
    width: '100%',
    height: 200,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
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
  infoCard: {
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  berriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  berriesText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  bountyTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  bountyDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  statsCard: {
    marginBottom: 0,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
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