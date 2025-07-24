import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import TopMenuBar from '@/components/TopMenuBar';
import AnimatedCard from '@/components/AnimatedCard';
import { FileText, Shield, Users, Award } from 'lucide-react-native';

export default function TermsAndConditions() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Terms & Conditions"
        subtitle="App usage guidelines and policies"
        showBackButton={true}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={styles.section}>
          <AnimatedCard style={styles.introCard}>
            <View style={styles.introContent}>
              <FileText size={32} color={theme.colors.primary} />
              <View style={styles.introText}>
                <Text style={[styles.introTitle, { color: theme.colors.text }]}>
                  Welcome to Bounties & Berries
                </Text>
                <Text style={[styles.introSubtitle, { color: theme.colors.textSecondary }]}>
                  Your student engagement and reward platform
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* App Purpose */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            About the App
          </Text>
          <AnimatedCard style={styles.contentCard}>
            <View style={styles.cardContent}>
              <Award size={24} color={theme.colors.accent} />
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                  Purpose
                </Text>
                <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
                  Bounties & Berries is designed to encourage student participation in college activities beyond academics. Students earn "berries" (points) for participating in various activities and can redeem them for rewards.
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            How It Works
          </Text>
          
          <AnimatedCard style={styles.contentCard}>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                For Students:
              </Text>
              <View style={styles.stepsList}>
                <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                  • Participate in college events, cultural activities, volunteer work, and maintain good attendance
                </Text>
                <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                  • Earn berries (points) for your participation and achievements
                </Text>
                <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                  • Submit external activities for point consideration
                </Text>
                <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                  • Redeem berries for rewards like food coupons, merchandise, and fee discounts
                </Text>
                <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                  • Track your progress and compete with peers on the leaderboard
                </Text>
              </View>
            </View>
          </AnimatedCard>

          <AnimatedCard style={styles.contentCard}>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                For Faculty:
              </Text>
              <View style={styles.stepsList}>
                <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                  • Create and manage college events and activities
                </Text>
                <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                  • Review and approve student point requests
                </Text>
                <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                  • Monitor student progress and engagement
                </Text>
                <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                  • Generate QR codes for attendance tracking
                </Text>
              </View>
            </View>
          </AnimatedCard>

          <AnimatedCard style={styles.contentCard}>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                For Administrators:
              </Text>
              <View style={styles.stepsList}>
                <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                  • Manage user accounts and permissions
                </Text>
                <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                  • Set up point allocation rules and reward systems
                </Text>
                <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                  • Purchase berries for distribution
                </Text>
                <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                  • Monitor overall system analytics and performance
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* User Responsibilities */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            User Responsibilities
          </Text>
          <AnimatedCard style={styles.contentCard}>
            <View style={styles.cardContent}>
              <Users size={24} color={theme.colors.secondary} />
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                  Expected Behavior
                </Text>
                <View style={styles.stepsList}>
                  <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                    • Use the app honestly and provide accurate information
                  </Text>
                  <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                    • Respect other users and maintain a positive environment
                  </Text>
                  <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                    • Submit genuine proof for external activities
                  </Text>
                  <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                    • Follow college guidelines and policies
                  </Text>
                  <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                    • Report any issues or bugs to the support team
                  </Text>
                </View>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Privacy and Data */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Privacy & Data Protection
          </Text>
          <AnimatedCard style={styles.contentCard}>
            <View style={styles.cardContent}>
              <Shield size={24} color={theme.colors.success} />
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                  Your Data is Safe
                </Text>
                <View style={styles.stepsList}>
                  <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                    • We collect only necessary information for app functionality
                  </Text>
                  <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                    • Your personal data is encrypted and securely stored
                  </Text>
                  <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                    • We do not share your data with third parties without consent
                  </Text>
                  <Text style={[styles.stepItem, { color: theme.colors.textSecondary }]}>
                    • You can request data deletion by contacting support
                  </Text>
                </View>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Support & Contact
          </Text>
          <AnimatedCard style={styles.contentCard}>
            <View style={styles.cardContent}>
              <Text style={[styles.supportText, { color: theme.colors.textSecondary }]}>
                For any questions, issues, or feedback regarding the app, please contact your college administration or use the "Raise Query" option in the app menu.
              </Text>
            </View>
          </AnimatedCard>
        </View>

        {/* Last Updated */}
        <View style={styles.section}>
          <Text style={[styles.lastUpdated, { color: theme.colors.textSecondary }]}>
            Last updated: March 2024
          </Text>
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
  introCard: {
    marginBottom: 0,
  },
  introContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  introText: {
    flex: 1,
  },
  introTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  introSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  contentCard: {
    marginBottom: 16,
  },
  cardContent: {
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  cardText: {
    flex: 1,
  },
  stepContent: {
    gap: 12,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  stepsList: {
    gap: 8,
  },
  stepItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  supportText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});