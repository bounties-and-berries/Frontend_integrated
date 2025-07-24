import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { 
  Upload, 
  Calendar, 
  FileText, 
  Award, 
  Camera,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react-native';

const categories = [
  { id: 'academic', label: 'Academic Achievement', points: '50-200' },
  { id: 'cultural', label: 'Cultural Activity', points: '30-150' },
  { id: 'volunteer', label: 'Volunteer Work', points: '40-300' },
  { id: 'sports', label: 'Sports Achievement', points: '50-250' },
  { id: 'leadership', label: 'Leadership Role', points: '100-400' },
  { id: 'other', label: 'Other Activity', points: '20-100' },
];

// Mock previous requests
const mockRequests = [
  {
    id: '1',
    title: 'Volunteer at Animal Shelter',
    category: 'volunteer',
    description: 'Volunteered for 8 hours at local animal shelter',
    pointsRequested: 120,
    status: 'approved',
    submittedDate: '2024-02-20',
    reviewedDate: '2024-02-22',
    reviewedBy: 'Dr. Smith',
  },
  {
    id: '2',
    title: 'Won Chess Tournament',
    category: 'sports',
    description: 'First place in inter-college chess championship',
    pointsRequested: 200,
    status: 'pending',
    submittedDate: '2024-02-25',
  },
  {
    id: '3',
    title: 'Organized Blood Drive',
    category: 'leadership',
    description: 'Led organization of campus blood donation drive',
    pointsRequested: 300,
    status: 'rejected',
    submittedDate: '2024-02-18',
    reviewedDate: '2024-02-20',
    reviewedBy: 'Dr. Johnson',
    rejectionReason: 'Insufficient documentation provided',
  },
];

export default function RequestPoints() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('new');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    pointsRequested: '',
    activityDate: '',
    proofDescription: '',
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.description || !formData.pointsRequested) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Submit Request',
      'Are you sure you want to submit this point request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Submit', 
          onPress: () => {
            Alert.alert('Success', 'Your point request has been submitted for review!');
            setFormData({
              title: '',
              category: '',
              description: '',
              pointsRequested: '',
              activityDate: '',
              proofDescription: '',
            });
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
      <TopMenuBar 
        title="Request Points"
        subtitle="Submit external activities for point approval"
      />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'new' ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => setActiveTab('new')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'new' ? '#FFFFFF' : theme.colors.textSecondary }
          ]}>
            New Request
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'history' ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'history' ? '#FFFFFF' : theme.colors.textSecondary }
          ]}>
            Request History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'new' ? (
          <View style={styles.formContainer}>
            {/* Guidelines Card */}
            <AnimatedCard style={styles.guidelinesCard}>
              <View style={styles.guidelinesContent}>
                <Award size={24} color={theme.colors.primary} />
                <View style={styles.guidelinesText}>
                  <Text style={[styles.guidelinesTitle, { color: theme.colors.text }]}>
                    Point Request Guidelines
                  </Text>
                  <Text style={[styles.guidelinesSubtitle, { color: theme.colors.textSecondary }]}>
                    Submit activities done outside college for point consideration
                  </Text>
                </View>
              </View>
            </AnimatedCard>

            {/* Activity Title */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Activity Title *
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="Enter activity title"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
              />
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Category *
              </Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor: formData.category === category.id 
                          ? theme.colors.primary + '20' 
                          : theme.colors.card,
                        borderColor: formData.category === category.id 
                          ? theme.colors.primary 
                          : theme.colors.border,
                      }
                    ]}
                    onPress={() => setFormData({...formData, category: category.id})}
                  >
                    <Text style={[
                      styles.categoryLabel,
                      { 
                        color: formData.category === category.id 
                          ? theme.colors.primary 
                          : theme.colors.text 
                      }
                    ]}>
                      {category.label}
                    </Text>
                    <Text style={[styles.categoryPoints, { color: theme.colors.textSecondary }]}>
                      {category.points} pts
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Description *
              </Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="Describe your activity in detail..."
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
              />
            </View>

            {/* Points Requested */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Points Requested *
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="Enter points you think you deserve"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
                value={formData.pointsRequested}
                onChangeText={(text) => setFormData({...formData, pointsRequested: text})}
              />
            </View>

            {/* Activity Date */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Activity Date
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="When did you do this activity?"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.activityDate}
                onChangeText={(text) => setFormData({...formData, activityDate: text})}
              />
            </View>

            {/* Proof Upload */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Proof/Evidence
              </Text>
              <TouchableOpacity 
                style={[styles.uploadButton, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border 
                }]}
                onPress={() => Alert.alert('Upload', 'File upload functionality will be available soon.')}
              >
                <Upload size={20} color={theme.colors.primary} />
                <Text style={[styles.uploadText, { color: theme.colors.primary }]}>
                  Upload Photos/Documents
                </Text>
              </TouchableOpacity>
              
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  marginTop: 8,
                }]}
                placeholder="Describe your proof/evidence..."
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                numberOfLines={3}
                value={formData.proofDescription}
                onChangeText={(text) => setFormData({...formData, proofDescription: text})}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.historyContainer}>
            {mockRequests.map((request) => (
              <AnimatedCard key={request.id} style={styles.requestCard}>
                <View style={styles.requestContent}>
                  <View style={styles.requestHeader}>
                    <View style={styles.requestInfo}>
                      <Text style={[styles.requestTitle, { color: theme.colors.text }]}>
                        {request.title}
                      </Text>
                      <Text style={[styles.requestCategory, { color: theme.colors.textSecondary }]}>
                        {categories.find(c => c.id === request.category)?.label}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(request.status) + '20' }
                    ]}>
                      {getStatusIcon(request.status)}
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(request.status) }
                      ]}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.requestDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                    {request.description}
                  </Text>
                  
                  <View style={styles.requestMeta}>
                    <View style={styles.requestDetail}>
                      <Award size={14} color={theme.colors.primary} />
                      <Text style={[styles.requestDetailText, { color: theme.colors.primary }]}>
                        {request.pointsRequested} points requested
                      </Text>
                    </View>
                    
                    <View style={styles.requestDetail}>
                      <Calendar size={14} color={theme.colors.textSecondary} />
                      <Text style={[styles.requestDetailText, { color: theme.colors.textSecondary }]}>
                        Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                      </Text>
                    </View>
                    
                    {request.reviewedDate && (
                      <View style={styles.requestDetail}>
                        <CheckCircle size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.requestDetailText, { color: theme.colors.textSecondary }]}>
                          Reviewed: {new Date(request.reviewedDate).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {request.rejectionReason && (
                    <View style={[styles.rejectionReason, { backgroundColor: theme.colors.error + '10' }]}>
                      <Text style={[styles.rejectionText, { color: theme.colors.error }]}>
                        Reason: {request.rejectionReason}
                      </Text>
                    </View>
                  )}
                </View>
              </AnimatedCard>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
  },
  guidelinesCard: {
    marginBottom: 0,
  },
  guidelinesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guidelinesText: {
    flex: 1,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  guidelinesSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  categoryPoints: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  historyContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  requestCard: {
    marginBottom: 0,
  },
  requestContent: {
    gap: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  requestInfo: {
    flex: 1,
    marginRight: 12,
  },
  requestTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  requestCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  requestDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  requestMeta: {
    gap: 6,
  },
  requestDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requestDetailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  rejectionReason: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  rejectionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});