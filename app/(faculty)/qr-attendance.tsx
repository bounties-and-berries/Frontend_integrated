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
import { useAuth } from '@/contexts/AuthContext';
import { Faculty } from '@/types';
import TopMenuBar from '@/components/TopMenuBar';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import AnimatedCard from '@/components/AnimatedCard';
import { QrCode, Users, Clock, Calendar, RefreshCw } from 'lucide-react-native';

export default function QRAttendance() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const faculty = user as Faculty;
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [attendanceCount, setAttendanceCount] = useState(0);

  const generateSession = () => {
    const newSessionId = `${faculty?.qrCode}_${Date.now()}`;
    setSessionId(newSessionId);
    setIsActive(true);
    setAttendanceCount(0);
    
    Alert.alert(
      'Attendance Session Started',
      'Students can now scan the QR code to mark their attendance.',
      [{ text: 'OK' }]
    );
  };

  const endSession = () => {
    Alert.alert(
      'End Session',
      `End attendance session? ${attendanceCount} students have marked attendance.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Session', 
          onPress: () => {
            setIsActive(false);
            setSessionId('');
            Alert.alert('Session Ended', `Final attendance count: ${attendanceCount} students`);
          }
        }
      ]
    );
  };

  const refreshSession = () => {
    if (isActive) {
      generateSession();
      Alert.alert('Session Refreshed', 'New QR code generated for security.');
    }
  };

  // Mock attendance data
  const mockAttendanceData = [
    { id: '1', name: 'Alice Johnson', time: '09:15 AM', status: 'present' },
    { id: '2', name: 'Bob Smith', time: '09:16 AM', status: 'present' },
    { id: '3', name: 'Carol Davis', time: '09:18 AM', status: 'present' },
  ];

  React.useEffect(() => {
    if (isActive) {
      // Simulate students marking attendance
      const interval = setInterval(() => {
        setAttendanceCount(prev => prev + Math.floor(Math.random() * 2));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="QR Attendance"
        subtitle="Generate QR codes for student attendance"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Session Controls */}
        <View style={styles.section}>
          <AnimatedCard style={styles.controlsCard}>
            <View style={styles.controlsContent}>
              <View style={styles.controlsHeader}>
                <QrCode size={32} color={theme.colors.primary} />
                <View style={styles.controlsInfo}>
                  <Text style={[styles.controlsTitle, { color: theme.colors.text }]}>
                    Attendance Session
                  </Text>
                  <Text style={[styles.controlsSubtitle, { color: theme.colors.textSecondary }]}>
                    {isActive ? 'Session is active' : 'No active session'}
                  </Text>
                </View>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: isActive ? theme.colors.success : theme.colors.error }
                ]} />
              </View>

              <View style={styles.controlsActions}>
                {!isActive ? (
                  <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                    onPress={generateSession}
                  >
                    <Text style={styles.primaryButtonText}>Start Attendance Session</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.activeControls}>
                    <TouchableOpacity
                      style={[styles.secondaryButton, { backgroundColor: theme.colors.secondary }]}
                      onPress={refreshSession}
                    >
                      <RefreshCw size={16} color="#FFFFFF" />
                      <Text style={styles.secondaryButtonText}>Refresh QR</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.dangerButton, { backgroundColor: theme.colors.error }]}
                      onPress={endSession}
                    >
                      <Text style={styles.dangerButtonText}>End Session</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* QR Code Display */}
        {isActive && sessionId && (
          <View style={styles.section}>
            <QRCodeGenerator
              data={sessionId}
              title="Scan for Attendance"
              subtitle="Students should scan this QR code to mark attendance"
              size={250}
            />
          </View>
        )}

        {/* Live Attendance Stats */}
        {isActive && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Live Attendance
            </Text>
            
            <View style={styles.statsGrid}>
              <AnimatedCard style={styles.statCard}>
                <View style={styles.statContent}>
                  <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
                    <Users size={24} color={theme.colors.success} />
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>
                    {attendanceCount}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Present
                  </Text>
                </View>
              </AnimatedCard>
              
              <AnimatedCard style={styles.statCard}>
                <View style={styles.statContent}>
                  <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                    <Clock size={24} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>
                    {Math.floor((Date.now() - parseInt(sessionId.split('_')[1])) / 60000)}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Minutes
                  </Text>
                </View>
              </AnimatedCard>
              
              <AnimatedCard style={styles.statCard}>
                <View style={styles.statContent}>
                  <View style={[styles.statIcon, { backgroundColor: theme.colors.accent + '20' }]}>
                    <Calendar size={24} color={theme.colors.accent} />
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>
                    {Math.round((attendanceCount / 50) * 100)}%
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Rate
                  </Text>
                </View>
              </AnimatedCard>
            </View>
          </View>
        )}

        {/* Recent Attendance */}
        {isActive && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Check-ins
            </Text>
            
            <View style={styles.attendanceList}>
              {mockAttendanceData.map((student) => (
                <AnimatedCard key={student.id} style={styles.attendanceCard}>
                  <View style={styles.attendanceContent}>
                    <View style={styles.attendanceInfo}>
                      <Text style={[styles.studentName, { color: theme.colors.text }]}>
                        {student.name}
                      </Text>
                      <Text style={[styles.attendanceTime, { color: theme.colors.textSecondary }]}>
                        Marked at {student.time}
                      </Text>
                    </View>
                    <View style={[
                      styles.attendanceStatus,
                      { backgroundColor: theme.colors.success + '20' }
                    ]}>
                      <Text style={[styles.attendanceStatusText, { color: theme.colors.success }]}>
                        Present
                      </Text>
                    </View>
                  </View>
                </AnimatedCard>
              ))}
            </View>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.section}>
          <AnimatedCard style={styles.instructionsCard}>
            <View style={styles.instructionsContent}>
              <Text style={[styles.instructionsTitle, { color: theme.colors.text }]}>
                How to Use QR Attendance
              </Text>
              <View style={styles.instructionsList}>
                <Text style={[styles.instructionItem, { color: theme.colors.textSecondary }]}>
                  1. Start an attendance session to generate a unique QR code
                </Text>
                <Text style={[styles.instructionItem, { color: theme.colors.textSecondary }]}>
                  2. Display the QR code to students in your class
                </Text>
                <Text style={[styles.instructionItem, { color: theme.colors.textSecondary }]}>
                  3. Students scan the code with their app to mark attendance
                </Text>
                <Text style={[styles.instructionItem, { color: theme.colors.textSecondary }]}>
                  4. Monitor live attendance and end session when complete
                </Text>
              </View>
            </View>
          </AnimatedCard>
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  controlsCard: {
    marginBottom: 0,
  },
  controlsContent: {
    gap: 16,
  },
  controlsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlsInfo: {
    flex: 1,
  },
  controlsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  controlsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  controlsActions: {
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  activeControls: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  dangerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  attendanceList: {
    gap: 12,
  },
  attendanceCard: {
    marginBottom: 0,
  },
  attendanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendanceInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  attendanceTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  attendanceStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  attendanceStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  instructionsCard: {
    marginBottom: 0,
  },
  instructionsContent: {
    gap: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  instructionsList: {
    gap: 8,
  },
  instructionItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});