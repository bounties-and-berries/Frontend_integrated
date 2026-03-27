import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Calendar, Eye, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Participant {
  id: string;
  name: string;
  teamName?: string;
  proofUrl?: string;
  points: number;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ReviewEvent() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Event data from navigation params
  const eventId = params.bountyId ? parseInt(params.bountyId as string) : 0;
  const eventName = params.bountyName as string || 'Unknown Event';
  const eventDescription = params.bountyDescription as string || '';
  const eventDate = params.bountyDate as string || '';
  const eventVenue = params.bountyVenue as string || '';
  const eventPoints = params.bountyPoints ? parseInt(params.bountyPoints as string) : 0;
  const eventCapacity = params.bountyCapacity ? parseInt(params.bountyCapacity as string) : 0;
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantSelections, setParticipantSelections] = useState<Record<string, '1st' | '2nd' | null>>({});
  
  // Fetch participants when component mounts
  useEffect(() => {
    // In a real app, this would fetch actual participants based on eventId
    // For now, we'll use mock data
    const mockParticipants: Participant[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        proofUrl: 'https://example.com/proof1.pdf',
        points: eventPoints,
        status: 'pending'
      },
      {
        id: '2',
        name: 'Bob Smith',
        proofUrl: 'https://example.com/proof2.pdf',
        points: eventPoints,
        status: 'pending'
      },
      {
        id: '3',
        name: 'Charlie Brown',
        proofUrl: 'https://example.com/proof3.pdf',
        points: eventPoints,
        status: 'pending'
      },
      {
        id: '4',
        name: 'Diana Prince',
        proofUrl: 'https://example.com/proof4.pdf',
        points: eventPoints,
        status: 'pending'
      },
      {
        id: '5',
        name: 'Edward Norton',
        proofUrl: 'https://example.com/proof5.pdf',
        points: eventPoints,
        status: 'pending'
      }
    ];
    setParticipants(mockParticipants);
    
    // Initialize selections
    const initialSelections: Record<string, null> = {};
    mockParticipants.forEach(participant => {
      initialSelections[participant.id] = null;
    });
    setParticipantSelections(initialSelections);
  }, []);
  
  // Handle participant selection
  const handleParticipantSelection = (participantId: string, selection: '1st' | '2nd' | null) => {
    setParticipantSelections(prev => ({
      ...prev,
      [participantId]: selection
    }));
  };

  // Submit review
  const handleSubmitReview = () => {
    const selectedCount = Object.values(participantSelections).filter(selection => selection !== null).length;
    
    if (selectedCount === 0) {
      Alert.alert('Validation Error', 'Please select at least one participant for points allocation.');
      return;
    }

    const firstPrizeCount = Object.values(participantSelections).filter(selection => selection === '1st').length;
    const secondPrizeCount = Object.values(participantSelections).filter(selection => selection === '2nd').length;

    // In a real app, this would submit the review to the backend
    Alert.alert(
      'Review Submitted',
      `Successfully submitted review for ${eventName}.\n\n` +
      `1st Prize: ${firstPrizeCount}\n` +
      `2nd Prize: ${secondPrizeCount}\n` +
      `No Points: ${participants.length - firstPrizeCount - secondPrizeCount}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Go back to approvals page
            router.back();
          }
        }
      ]
    );
  };

  // View proof
  const handleViewProof = (proofUrl: string | undefined) => {
    if (proofUrl) {
      Alert.alert('View Proof', `In a real app, this would open: ${proofUrl}`, [
        { text: 'OK' }
      ]);
    } else {
      Alert.alert('No Proof', 'No proof attached for this participant.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Review Event"
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <ScrollView style={styles.content}>
        {/* Event Details */}
        <AnimatedCard style={styles.eventDetailsCard}>
          <Text style={[styles.eventTitle, { color: theme.colors.text }]}>
            {eventName}
          </Text>
          <Text style={[styles.eventDescription, { color: theme.colors.textSecondary }]}>
            {eventDescription}
          </Text>
          
          <View style={styles.eventMeta}>
            <View style={styles.metaItem}>
              <Calendar size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                {new Date(eventDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                {eventVenue}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaText, { color: theme.colors.accent }]}>
                {eventPoints} Points
              </Text>
            </View>
          </View>
        </AnimatedCard>

        {/* Participants Section */}
        <View style={styles.participantsSection}>
          <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>
            All Participants
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary, marginBottom: 12 }]}>
            Select participants for 1st and 2nd prize points
          </Text>
          
          {participants.map(participant => (
            <AnimatedCard key={participant.id} style={styles.participantCard}>
              <View style={styles.participantHeader}>
                <View style={styles.participantInfo}>
                  <Users size={20} color={theme.colors.textSecondary} />
                  <Text style={[styles.participantName, { color: theme.colors.text }]}>
                    {participant.name}
                  </Text>
                </View>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.checkboxSmall,
                      participantSelections[participant.id] === '1st' 
                        ? { backgroundColor: theme.colors.success } 
                        : { backgroundColor: theme.colors.surface }
                    ]}
                    onPress={() => handleParticipantSelection(participant.id, 
                      participantSelections[participant.id] === '1st' ? null : '1st')}
                  >
                    {participantSelections[participant.id] === '1st' && (
                      <View style={styles.checkmark} />
                    )}
                  </TouchableOpacity>
                  <Text style={[styles.checkboxLabel, { color: theme.colors.textSecondary }]}>
                    1st
                  </Text>
                  
                  <TouchableOpacity 
                    style={[
                      styles.checkboxSmall,
                      participantSelections[participant.id] === '2nd' 
                        ? { backgroundColor: theme.colors.warning } 
                        : { backgroundColor: theme.colors.surface }
                    ]}
                    onPress={() => handleParticipantSelection(participant.id, 
                      participantSelections[participant.id] === '2nd' ? null : '2nd')}
                  >
                    {participantSelections[participant.id] === '2nd' && (
                      <View style={styles.checkmark} />
                    )}
                  </TouchableOpacity>
                  <Text style={[styles.checkboxLabel, { color: theme.colors.textSecondary }]}>
                    2nd
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.viewProofButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => handleViewProof(participant.proofUrl)}
              >
                <Eye size={16} color={theme.colors.primary} />
                <Text style={[styles.viewProofText, { color: theme.colors.primary }]}>
                  View Proof
                </Text>
              </TouchableOpacity>
            </AnimatedCard>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSubmitReview}
        >
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  eventDetailsCard: {
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  participantsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 20,
  },
  participantCard: {
    marginBottom: 12,
  },
  participantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  participantName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  checkboxLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  viewProofButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  viewProofText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});