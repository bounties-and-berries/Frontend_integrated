import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import TopMenuBar from '@/components/TopMenuBar';
import AnimatedCard from '@/components/AnimatedCard';
import { FileText, Shield, UserCheck, Lock, AlertTriangle } from 'lucide-react-native';

export default function TermsConditions() {
  const { theme } = useTheme();

  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: UserCheck,
      content: 'By accessing and using the B & B (Bounties and Berries) application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
    },
    {
      title: 'User Responsibilities',
      icon: Shield,
      content: 'Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. Users must not share their login credentials with others or use the service for any unlawful purpose.',
    },
    {
      title: 'Privacy and Data Protection',
      icon: Lock,
      content: 'We are committed to protecting your privacy. Your personal information will be collected, used, and disclosed in accordance with our Privacy Policy. We implement appropriate security measures to protect your data.',
    },
    {
      title: 'Content and Conduct',
      icon: AlertTriangle,
      content: 'Users must not post, upload, or share any content that is offensive, inappropriate, or violates any applicable laws. The platform reserves the right to remove content and suspend accounts that violate these terms.',
    },
    {
      title: 'Intellectual Property',
      icon: FileText,
      content: 'All content, features, and functionality of the application are owned by the platform and are protected by international copyright, trademark, and other intellectual property laws.',
    },
    {
      title: 'Limitation of Liability',
      icon: AlertTriangle,
      content: 'The platform shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service or any content therein.',
    },
    {
      title: 'Modifications to Terms',
      icon: FileText,
      content: 'We reserve the right to modify these terms at any time. Users will be notified of any changes, and continued use of the service constitutes acceptance of the modified terms.',
    },
    {
      title: 'Termination',
      icon: UserCheck,
      content: 'We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users or the platform.',
    },
    {
      title: 'Governing Law',
      icon: Shield,
      content: 'These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the platform operates, without regard to its conflict of law provisions.',
    },
    {
      title: 'Contact Information',
      icon: UserCheck,
      content: 'If you have any questions about these Terms of Service, please contact us through the support channels provided in the application.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="Terms & Conditions"
        subtitle="Please read our terms carefully"
        showBackButton={true}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.section}>
          <AnimatedCard style={styles.headerCard}>
            <View style={styles.headerContent}>
              <FileText size={48} color={theme.colors.primary} />
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                Terms & Conditions
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                Last updated: {new Date().toLocaleDateString()}
              </Text>
              <Text style={[styles.headerDescription, { color: theme.colors.textSecondary }]}>
                These terms and conditions govern your use of the B & B application. 
                By using our service, you agree to these terms in full.
              </Text>
            </View>
          </AnimatedCard>
        </View>

        {/* Terms Sections */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Terms of Service
          </Text>
          
          {sections.map((section, index) => (
            <AnimatedCard key={index} style={styles.termCard}>
              <View style={styles.termContent}>
                <View style={[styles.termIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <section.icon size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.termText}>
                  <Text style={[styles.termTitle, { color: theme.colors.text }]}>
                    {section.title}
                  </Text>
                  <Text style={[styles.termDescription, { color: theme.colors.textSecondary }]}>
                    {section.content}
                  </Text>
                </View>
              </View>
            </AnimatedCard>
          ))}
        </View>

        {/* Important Notice */}
        <View style={styles.section}>
          <AnimatedCard style={styles.noticeCard}>
            <View style={styles.noticeContent}>
              <AlertTriangle size={24} color={theme.colors.warning || '#F59E0B'} />
              <View style={styles.noticeText}>
                <Text style={[styles.noticeTitle, { color: theme.colors.text }]}>
                  Important Notice
                </Text>
                <Text style={[styles.noticeDescription, { color: theme.colors.textSecondary }]}>
                  These terms constitute a legally binding agreement between you and the platform. 
                  If you do not agree with any part of these terms, please do not use our service. 
                  Your continued use of the application indicates your acceptance of these terms.
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Footer */}
        <View style={styles.section}>
          <AnimatedCard style={styles.footerCard}>
            <View style={styles.footerContent}>
              <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
                By using the B & B application, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms & Conditions.
              </Text>
              <Text style={[styles.footerDate, { color: theme.colors.textSecondary }]}>
                Effective Date: {new Date().toLocaleDateString()}
              </Text>
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
  headerCard: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 0,
  },
  headerContent: {
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  headerDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  termCard: {
    marginBottom: 12,
  },
  termContent: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  termIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termText: {
    flex: 1,
    gap: 8,
  },
  termTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  termDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  noticeCard: {
    marginBottom: 0,
  },
  noticeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
  },
  noticeText: {
    flex: 1,
    gap: 8,
  },
  noticeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  noticeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  footerCard: {
    marginBottom: 0,
  },
  footerContent: {
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  footerDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});
