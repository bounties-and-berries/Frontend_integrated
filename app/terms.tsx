import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import TopMenuBar from '@/components/TopMenuBar';
import AnimatedCard from '@/components/AnimatedCard';

export default function TermsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const getTermsContent = () => {
    switch (user?.role) {
      case 'student':
        return (
          <>
            <Text style={[styles.heading, { color: theme.colors.text }]}>1. Participation & Bounties</Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              As a student, you agree to participate fairly in all campus bounties and events. 
              Any manipulation of points or submitting false proof of participation will lead to 
              immediate disqualification and a ban from the Bounties & Berries program.
            </Text>
            
            <Text style={[styles.heading, { color: theme.colors.text }]}>2. Berries & Rewards</Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              Berries earned through events carry no real-world monetary value and cannot be 
              exchanged for cash. Rewards inventory is subject to availability, and the college
              reserves the right to modify or withdraw rewards at any time without prior notice.
            </Text>

            <Text style={[styles.heading, { color: theme.colors.text }]}>3. Code of Conduct</Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              You must maintain respectful behavior during all events. Faculty members hosting
              events hold the final say in approving your attendance and distributing points.
            </Text>
          </>
        );
      case 'faculty':
        return (
          <>
            <Text style={[styles.heading, { color: theme.colors.text }]}>1. Event Creation & Hosting</Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              As a faculty member, you are responsible for providing accurate details when creating
              events and bounties. You must evaluate student participation fairly and distribute
              points objectively based on the student's contribution.
            </Text>

            <Text style={[styles.heading, { color: theme.colors.text }]}>2. Points Arbitration</Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              You commit to reviewing pending point requests systematically. Approval or rejection
              of points must be done in accordance with the college guidelines. Any arbitrary 
              denial or favoritism is strictly prohibited.
            </Text>

            <Text style={[styles.heading, { color: theme.colors.text }]}>3. Data Privacy</Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              You will have access to student participation records. You agree to treat this data 
              confidentially and use it strictly for academic and administrative purposes related 
              to the Bounties & Berries program.
            </Text>
          </>
        );
      case 'admin':
        return (
          <>
            <Text style={[styles.heading, { color: theme.colors.text }]}>1. System Administration</Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              As an administrator, you possess elevated privileges to manage the entire platform.
              You agree to use these tools solely for maintaining the system, onboarding users safely,
              and ensuring the integrity of the database.
            </Text>

            <Text style={[styles.heading, { color: theme.colors.text }]}>2. Policy Enforcement</Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              You hold the responsibility to enforce the Terms and Conditions for both students and 
              faculty. This includes the right to suspend accounts, intervene in disputes, and audit
              point allocations across the platform.
            </Text>

            <Text style={[styles.heading, { color: theme.colors.text }]}>3. Reward Treasury Management</Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              Administrators are responsible for restocking the rewards inventory and validating 
              redemption codes. You must strictly monitor the transactional integrity of the 
              berries economy.
            </Text>
          </>
        );
      default:
        return (
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Please log in to view the terms applicable to your account.
          </Text>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar
        title="Terms & Conditions"
        subtitle="App policies and guidelines"
        showBackButton
        onBackPress={() => router.back()}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AnimatedCard style={styles.card}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''} Terms of Service
          </Text>
          <Text style={[styles.lastUpdated, { color: theme.colors.textSecondary }]}>
            Last updated: March 10, 2026
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            By accessing or using the Bounties & Berries application, you agree to be bound by these terms. 
            These terms are specifically tailored to your role within the institution.
          </Text>

          {getTermsContent()}

          <View style={[styles.divider, { backgroundColor: theme.colors.border, marginTop: 24 }]} />
          
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Bounties & Berries © 2026. All rights reserved.
          </Text>
        </AnimatedCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  card: { padding: 24, paddingBottom: 32 },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
    opacity: 0.6,
  },
  heading: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 16,
  },
});