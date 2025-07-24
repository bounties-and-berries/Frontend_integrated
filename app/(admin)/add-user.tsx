import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { UserPlus, Upload, User, GraduationCap, Users } from 'lucide-react-native';

const userTypes = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'faculty', label: 'Faculty', icon: User },
];

const departments = [
  'Computer Science',
  'Engineering',
  'Business',
  'Arts',
  'Science',
  'Mathematics',
];

export default function AddUser() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('single');
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    year: '',
    subject: '',
    employeeId: '',
  });

  const handleSingleUserSubmit = () => {
    if (!formData.name || !formData.email || !formData.department) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (userType === 'student' && !formData.year) {
      Alert.alert('Error', 'Please select year for student');
      return;
    }

    if (userType === 'faculty' && (!formData.subject || !formData.employeeId)) {
      Alert.alert('Error', 'Please fill in subject and employee ID for faculty');
      return;
    }

    Alert.alert(
      'Create User',
      `Create ${userType} account for ${formData.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create', 
          onPress: () => {
            Alert.alert('Success', `${userType.charAt(0).toUpperCase() + userType.slice(1)} account created successfully!`);
            setFormData({
              name: '',
              email: '',
              department: '',
              year: '',
              subject: '',
              employeeId: '',
            });
          }
        }
      ]
    );
  };

  const handleExcelUpload = () => {
    Alert.alert(
      'Upload Excel File',
      'Excel upload functionality will extract user details and create accounts automatically. This feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Add User"
        subtitle="Create new student or faculty accounts"
      />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'single' ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => setActiveTab('single')}
        >
          <UserPlus size={18} color={activeTab === 'single' ? '#FFFFFF' : theme.colors.textSecondary} />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'single' ? '#FFFFFF' : theme.colors.textSecondary }
          ]}>
            Single User
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'bulk' ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => setActiveTab('bulk')}
        >
          <Upload size={18} color={activeTab === 'bulk' ? '#FFFFFF' : theme.colors.textSecondary} />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'bulk' ? '#FFFFFF' : theme.colors.textSecondary }
          ]}>
            Bulk Upload
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'single' ? (
          <View style={styles.formContainer}>
            {/* User Type Selection */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                User Type
              </Text>
              <View style={styles.userTypeContainer}>
                {userTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.userTypeCard,
                        {
                          backgroundColor: userType === type.id 
                            ? theme.colors.primary + '20' 
                            : theme.colors.card,
                          borderColor: userType === type.id 
                            ? theme.colors.primary 
                            : theme.colors.border,
                        }
                      ]}
                      onPress={() => setUserType(type.id)}
                    >
                      <IconComponent 
                        size={24} 
                        color={userType === type.id ? theme.colors.primary : theme.colors.textSecondary} 
                      />
                      <Text style={[
                        styles.userTypeLabel,
                        { 
                          color: userType === type.id 
                            ? theme.colors.primary 
                            : theme.colors.text 
                        }
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Basic Information
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Full Name *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }]}
                  placeholder="Enter full name"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Email Address *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }]}
                  placeholder="Enter email address"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Department *
                </Text>
                <View style={styles.departmentGrid}>
                  {departments.map((dept) => (
                    <TouchableOpacity
                      key={dept}
                      style={[
                        styles.departmentCard,
                        {
                          backgroundColor: formData.department === dept 
                            ? theme.colors.secondary + '20' 
                            : theme.colors.card,
                          borderColor: formData.department === dept 
                            ? theme.colors.secondary 
                            : theme.colors.border,
                        }
                      ]}
                      onPress={() => setFormData({...formData, department: dept})}
                    >
                      <Text style={[
                        styles.departmentLabel,
                        { 
                          color: formData.department === dept 
                            ? theme.colors.secondary 
                            : theme.colors.text 
                        }
                      ]}>
                        {dept}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Role-specific Information */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {userType === 'student' ? 'Student' : 'Faculty'} Information
              </Text>

              {userType === 'student' ? (
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>
                    Year *
                  </Text>
                  <View style={styles.yearContainer}>
                    {[1, 2, 3, 4].map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.yearCard,
                          {
                            backgroundColor: formData.year === year.toString() 
                              ? theme.colors.accent + '20' 
                              : theme.colors.card,
                            borderColor: formData.year === year.toString() 
                              ? theme.colors.accent 
                              : theme.colors.border,
                          }
                        ]}
                        onPress={() => setFormData({...formData, year: year.toString()})}
                      >
                        <Text style={[
                          styles.yearLabel,
                          { 
                            color: formData.year === year.toString() 
                              ? theme.colors.accent 
                              : theme.colors.text 
                          }
                        ]}>
                          Year {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                      Subject/Course *
                    </Text>
                    <TextInput
                      style={[styles.input, { 
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.border,
                        color: theme.colors.text 
                      }]}
                      placeholder="Enter subject or course taught"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={formData.subject}
                      onChangeText={(text) => setFormData({...formData, subject: text})}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                      Employee ID *
                    </Text>
                    <TextInput
                      style={[styles.input, { 
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.border,
                        color: theme.colors.text 
                      }]}
                      placeholder="Enter employee ID"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={formData.employeeId}
                      onChangeText={(text) => setFormData({...formData, employeeId: text})}
                    />
                  </View>
                </>
              )}
            </View>

            {/* Submit Button */}
            <View style={styles.section}>
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleSingleUserSubmit}
              >
                <UserPlus size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>
                  Create {userType.charAt(0).toUpperCase() + userType.slice(1)} Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.bulkContainer}>
            {/* Instructions */}
            <View style={styles.section}>
              <AnimatedCard style={styles.instructionsCard}>
                <View style={styles.instructionsContent}>
                  <Users size={32} color={theme.colors.primary} />
                  <View style={styles.instructionsText}>
                    <Text style={[styles.instructionsTitle, { color: theme.colors.text }]}>
                      Bulk User Upload
                    </Text>
                    <Text style={[styles.instructionsSubtitle, { color: theme.colors.textSecondary }]}>
                      Upload an Excel file to create multiple user accounts at once
                    </Text>
                  </View>
                </View>
              </AnimatedCard>
            </View>

            {/* Excel Format Requirements */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Excel File Requirements
              </Text>
              
              <AnimatedCard style={styles.requirementsCard}>
                <View style={styles.requirementsContent}>
                  <Text style={[styles.requirementsTitle, { color: theme.colors.text }]}>
                    Required Columns:
                  </Text>
                  <View style={styles.requirementsList}>
                    <Text style={[styles.requirementItem, { color: theme.colors.textSecondary }]}>
                      • Name (Full name of user)
                    </Text>
                    <Text style={[styles.requirementItem, { color: theme.colors.textSecondary }]}>
                      • Email (Valid email address)
                    </Text>
                    <Text style={[styles.requirementItem, { color: theme.colors.textSecondary }]}>
                      • Role (student or faculty)
                    </Text>
                    <Text style={[styles.requirementItem, { color: theme.colors.textSecondary }]}>
                      • Department (Department name)
                    </Text>
                    <Text style={[styles.requirementItem, { color: theme.colors.textSecondary }]}>
                      • Year (For students: 1-4)
                    </Text>
                    <Text style={[styles.requirementItem, { color: theme.colors.textSecondary }]}>
                      • Subject (For faculty only)
                    </Text>
                    <Text style={[styles.requirementItem, { color: theme.colors.textSecondary }]}>
                      • Employee_ID (For faculty only)
                    </Text>
                  </View>
                </View>
              </AnimatedCard>
            </View>

            {/* Upload Section */}
            <View style={styles.section}>
              <TouchableOpacity 
                style={[styles.uploadButton, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.primary 
                }]}
                onPress={handleExcelUpload}
              >
                <Upload size={32} color={theme.colors.primary} />
                <Text style={[styles.uploadTitle, { color: theme.colors.primary }]}>
                  Upload Excel File
                </Text>
                <Text style={[styles.uploadSubtitle, { color: theme.colors.textSecondary }]}>
                  Click to select your Excel file with user data
                </Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    paddingBottom: 20,
  },
  bulkContainer: {
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  userTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  userTypeLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  departmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  departmentCard: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  departmentLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  yearContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  yearCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  yearLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  instructionsCard: {
    marginBottom: 0,
  },
  instructionsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  instructionsText: {
    flex: 1,
  },
  instructionsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  instructionsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  requirementsCard: {
    marginBottom: 0,
  },
  requirementsContent: {
    gap: 12,
  },
  requirementsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  requirementsList: {
    gap: 6,
  },
  requirementItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: 12,
  },
  uploadTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  uploadSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});