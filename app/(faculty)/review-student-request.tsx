import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { CircleCheck as CheckCircle, Circle as XCircle, Calendar, User, Star, Eye, FileText, MapPin, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface StudentRequest {
  id: string;
  studentName: string;
  studentId: string;
  studentClass?: string;
  studentDepartment?: string;
  title: string;
  description: string;
  points: number;
  berries: number;
  date: string;
  proofUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  activityType: string;
}

export default function ReviewStudentRequest() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Student request data from navigation params
  const requestId = params.requestId as string || '0';
  const studentName = params.studentName as string || 'Unknown Student';
  const studentId = params.studentId as string || 'STU000';
  const studentClass = params.studentClass as string || 'Class Not Specified';
  const studentDepartment = params.studentDepartment as string || 'Department Not Specified';
  const title = params.title as string || 'Untitled Request';
  const description = params.description as string || 'No description provided';
  const points = params.points ? parseInt(params.points as string) : 0;
  const berries = params.berries ? parseInt(params.berries as string) : 0;
  const date = params.date as string || '';
  const proofUrl = params.proofUrl as string || '';
  const activityType = params.activityType as string || 'General Activity';
  
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProofModalVisible, setIsProofModalVisible] = useState(false);
  
  // Handle approval
  const handleApprove = () => {
    Alert.alert(
      'Approve Request',
      `Are you sure you want to approve "${title}" and allocate ${points} points to ${studentName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: () => {
            setIsSubmitting(true);
            // In a real app, this would submit to the backend
            setTimeout(() => {
              setIsSubmitting(false);
              Alert.alert(
                'Request Approved',
                `Successfully approved request and allocated ${points} points to ${studentName}.`,
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
            }, 1000);
          }
        }
      ]
    );
  };

  // Handle rejection
  const handleReject = () => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => {
            setIsSubmitting(true);
            // In a real app, this would submit to the backend
            setTimeout(() => {
              setIsSubmitting(false);
              Alert.alert(
                'Request Rejected',
                `Successfully rejected request${rejectionReason ? ` with reason: "${rejectionReason}"` : ''}.`,
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
            }, 1000);
          }
        }
      ]
    );
  };

  // View proof
  const handleViewProof = () => {
    if (proofUrl) {
      setIsProofModalVisible(true);
    } else {
      Alert.alert('No Proof', 'No proof attached for this request.');
    }
  };

  // Close proof modal
  const closeProofModal = () => {
    setIsProofModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Review Request"
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Request Details */}
        <AnimatedCard style={styles.requestDetailsCard}>
          <Text style={[styles.requestTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.requestDescription, { color: theme.colors.textSecondary }]}>
            {description}
          </Text>
          
          <View style={styles.requestMeta}>
            <View style={styles.metaItem}>
              <Calendar size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                {new Date(date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Star size={16} color={theme.colors.accent} />
              <Text style={[styles.metaText, { color: theme.colors.accent }]}>
                {points} Points
              </Text>
            </View>
            {berries > 0 && (
              <View style={styles.metaItem}>
                <MapPin size={16} color={theme.colors.success} />
                <Text style={[styles.metaText, { color: theme.colors.success }]}>
                  {berries} Berries
                </Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <FileText size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                {activityType}
              </Text>
            </View>
          </View>
        </AnimatedCard>

        {/* Student Details */}
        <AnimatedCard style={styles.studentDetailsCard}>
          <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>
            Student Information
          </Text>
          
          <View style={styles.studentInfo}>
            <View style={styles.studentInfoRow}>
              <User size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.studentInfoText, { color: theme.colors.text }]}>
                {studentName}
              </Text>
            </View>
            <View style={styles.studentInfoRow}>
              <Text style={[styles.studentInfoLabel, { color: theme.colors.textSecondary }]}>
                Student ID:
              </Text>
              <Text style={[styles.studentInfoText, { color: theme.colors.text }]}>
                {studentId}
              </Text>
            </View>
            <View style={styles.studentInfoRow}>
              <Text style={[styles.studentInfoLabel, { color: theme.colors.textSecondary }]}>
                Class:
              </Text>
              <Text style={[styles.studentInfoText, { color: theme.colors.text }]}>
                {studentClass}
              </Text>
            </View>
            <View style={styles.studentInfoRow}>
              <Text style={[styles.studentInfoLabel, { color: theme.colors.textSecondary }]}>
                Department:
              </Text>
              <Text style={[styles.studentInfoText, { color: theme.colors.text }]}>
                {studentDepartment}
              </Text>
            </View>
          </View>
        </AnimatedCard>

        {/* Proof Section */}
        <AnimatedCard style={styles.proofCard}>
          <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>
            Supporting Documents
          </Text>
          
          {proofUrl ? (
            <TouchableOpacity 
              style={[styles.viewProofButton, { backgroundColor: theme.colors.surface }]}
              onPress={handleViewProof}
            >
              <Eye size={16} color={theme.colors.primary} />
              <Text style={[styles.viewProofText, { color: theme.colors.primary }]}>
                View Proof
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.noProofText, { color: theme.colors.textSecondary }]}>
              No proof attached
            </Text>
          )}
        </AnimatedCard>

        {/* Rejection Reason Input */}
        <AnimatedCard style={styles.rejectionCard}>
          <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>
            Rejection Reason (Optional)
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
            Provide a reason for rejection to help the student understand
          </Text>
          
          <TextInput
            style={[
              styles.rejectionInput,
              { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              }
            ]}
            placeholder="Enter reason for rejection (optional)"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={3}
            value={rejectionReason}
            onChangeText={setRejectionReason}
          />
        </AnimatedCard>
      </ScrollView>

      {/* Action Buttons - Sticky at bottom */}
      <View style={[styles.actionButtonsContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.rejectButton, { backgroundColor: theme.colors.error }]}
            onPress={handleReject}
            disabled={isSubmitting}
          >
            <XCircle size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.approveButton, { backgroundColor: theme.colors.success }]}
            onPress={handleApprove}
            disabled={isSubmitting}
          >
            <CheckCircle size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Proof Modal */}
      <Modal
        visible={isProofModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeProofModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Proof Document
              </Text>
              <TouchableOpacity onPress={closeProofModal} style={styles.closeButton}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.proofContainer}>
              {proofUrl ? (
                proofUrl.endsWith('.pdf') ? (
                  <View style={styles.proofPlaceholder}>
                    <FileText size={64} color={theme.colors.textSecondary} />
                    <Text style={[styles.proofPlaceholderText, { color: theme.colors.textSecondary }]}>
                      PDF Document Preview
                    </Text>
                    <Text style={[styles.proofUrl, { color: theme.colors.primary }]}>
                      {proofUrl}
                    </Text>
                  </View>
                ) : (
                  <Image 
                    source={{ uri: proofUrl }} 
                    style={styles.proofImage}
                    resizeMode="contain"
                  />
                )
              ) : (
                <Text style={[styles.noProofText, { color: theme.colors.textSecondary }]}>
                  No proof available
                </Text>
              )}
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={closeProofModal}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Space for sticky buttons
  },
  requestDetailsCard: {
    marginBottom: 20,
  },
  requestTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  requestDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  requestMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  studentDetailsCard: {
    marginBottom: 20,
  },
  proofCard: {
    marginBottom: 20,
  },
  rejectionCard: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  studentInfo: {
    gap: 8,
  },
  studentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  studentInfoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  studentInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  viewProofButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  viewProofText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  noProofText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    paddingVertical: 12,
  },
  rejectionInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
    minHeight: 80,
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
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    padding: 4,
  },
  proofContainer: {
    maxHeight: height * 0.6,
  },
  proofImage: {
    width: '100%',
    height: height * 0.5,
  },
  proofPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  proofPlaceholderText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  proofUrl: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  modalActions: {
    padding: 16,
    borderTopWidth: 1,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});