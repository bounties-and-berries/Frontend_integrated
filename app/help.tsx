import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import TopMenuBar from '@/components/TopMenuBar';
import AnimatedCard from '@/components/AnimatedCard';
import { Mail, Phone, ExternalLink, HelpCircle, FileQuestion, MessageSquare } from 'lucide-react-native';

export default function HelpScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const getFaqs = () => {
    switch (user?.role) {
      case 'student':
        return [
          {
            q: 'How do I earn Berries?',
            a: 'By registering for and completing events or bounties. Once a faculty member approves your participation, berries are added to your wallet automatically.'
          },
          {
            q: 'Can I claim multiple rewards?',
            a: 'Yes, as long as you have enough berries, you can claim any active reward. Just head to the Rewards tab!'
          },
          {
            q: 'What if my points are not updated?',
            a: 'It might take some time for the faculty to approve your attendance. If it has been over a week, you can log a query via the "Raise Query" section.'
          }
        ];
      case 'faculty':
        return [
          {
            q: 'How do I approve participations?',
            a: 'Go to the Bounties tab, click on an active event you created, and review the pending list of students to grant or reject their points.'
          },
          {
            q: 'Can I add a custom reward for my students?',
            a: 'Currently, only Admins can create new Rewards in the store. You can, however, allocate higher point values to your own events.'
          },
          {
            q: 'Who can see my events?',
            a: 'Events you create are visible to all students on the platform, unless marked as private or capacity is full.'
          }
        ];
      case 'admin':
        return [
          {
            q: 'How do I bulk import users?',
            a: 'In the Dashboard, select "Add User" and switch to the "Bulk Add" tab to upload a standardized CSV containing the students or faculty.'
          },
          {
            q: 'How do I restock rewards?',
            a: 'Navigate to "Rewards Management" and edit the existing reward to increase its availability count.'
          },
          {
            q: 'A student circumvented points. What to do?',
            a: 'Access the student profile from User Management. You have the ability to manually deduct points/berries or suspend the account.'
          }
        ];
      default:
        return [];
    }
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@bountiesandberries.edu');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar
        title="Help & Support"
        subtitle="We're here to assist you"
        showBackButton
        onBackPress={() => router.back()}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Support Options */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact Us</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity 
            style={[styles.contactCard, { backgroundColor: theme.colors.card }]}
            onPress={handleEmailSupport}
          >
            <View style={[styles.contactIcon, { backgroundColor: theme.colors.primary + '15' }]}>
              <Mail size={24} color={theme.colors.primary} />
            </View>
            <Text style={[styles.contactTitle, { color: theme.colors.text }]}>Email Support</Text>
            <Text style={[styles.contactSubtitle, { color: theme.colors.textSecondary }]}>support@bountiesandberries.edu</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.contactCard, { backgroundColor: theme.colors.card }]}
            onPress={() => router.push(`/${user?.role}/raise-query` as any)}
          >
            <View style={[styles.contactIcon, { backgroundColor: theme.colors.accent + '15' }]}>
              <MessageSquare size={24} color={theme.colors.accent} />
            </View>
            <Text style={[styles.contactTitle, { color: theme.colors.text }]}>Raise a Query</Text>
            <Text style={[styles.contactSubtitle, { color: theme.colors.textSecondary }]}>In-app ticket system</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 24 }]}>
          Frequently Asked Questions ({user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''})
        </Text>
        <AnimatedCard style={styles.faqCard}>
          {getFaqs().map((faq, index) => (
            <View key={index} style={[styles.faqItem, index !== getFaqs().length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
              <View style={styles.faqHeader}>
                <HelpCircle size={18} color={theme.colors.primary} style={styles.faqIcon} />
                <Text style={[styles.faqQ, { color: theme.colors.text }]}>{faq.q}</Text>
              </View>
              <Text style={[styles.faqA, { color: theme.colors.textSecondary }]}>{faq.a}</Text>
            </View>
          ))}
        </AnimatedCard>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  contactCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  faqCard: {
    padding: 0,
    overflow: 'hidden',
  },
  faqItem: {
    padding: 20,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  faqIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  faqQ: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 22,
  },
  faqA: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    marginLeft: 28,
  },
});
