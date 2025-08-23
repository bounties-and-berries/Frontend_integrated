import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronDown, 
  ChevronRight,
  BookOpen,
  Video,
  FileText,
  ExternalLink
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const faqData = [
  {
    id: '1',
    question: 'How do I earn berries?',
    answer: 'You can earn berries by participating in college events, completing academic achievements, volunteering, and other approved activities. Each activity has a specific berry value assigned by faculty.',
  },
  {
    id: '2',
    question: 'How do I request berries for external activities?',
    answer: 'Go to the "Request Berries" section in your menu, fill out the form with details about your activity, attach supporting documents, and submit for faculty approval.',
  },
  {
    id: '3',
    question: 'How long does it take to get berries approved?',
    answer: 'Faculty typically reviews and approves berry requests within 2-3 business days. You\'ll receive a notification once your request is processed.',
  },
  {
    id: '4',
    question: 'Can I transfer berries to other students?',
    answer: 'No, berries are non-transferable and are tied to your individual account. They can only be used by you to claim rewards and coupons.',
  },
  {
    id: '5',
    question: 'What happens to my berries at the end of the semester?',
    answer: 'Berries carry over to the next semester and academic year. They only expire when you graduate or leave the college.',
  },
  {
    id: '6',
    question: 'How do I report a technical issue?',
    answer: 'Use the "Raise Query" feature in settings to report technical issues. Select "Technical Issue" as the category and provide detailed information.',
  },
];

const supportChannels = [
  {
    id: 'email',
    title: 'Email Support',
    subtitle: 'Get help via email',
    icon: Mail,
    color: '#3B82F6',
    action: () => Linking.openURL('mailto:support@college.edu'),
  },
  {
    id: 'phone',
    title: 'Phone Support',
    subtitle: 'Call us directly',
    icon: Phone,
    color: '#10B981',
    action: () => Linking.openURL('tel:+1234567890'),
  },
  {
    id: 'location',
    title: 'Visit Us',
    subtitle: 'Find us on campus',
    icon: MapPin,
    color: '#8B5CF6',
    action: () => Linking.openURL('https://maps.google.com'),
  },
];

const resources = [
  {
    id: 'manual',
    title: 'User Manual',
    subtitle: 'Complete guide to using the app',
    icon: BookOpen,
    color: '#F59E0B',
    action: () => Linking.openURL('https://college.edu/manual'),
  },
  {
    id: 'tutorials',
    title: 'Video Tutorials',
    subtitle: 'Step-by-step video guides',
    icon: Video,
    color: '#EF4444',
    action: () => Linking.openURL('https://college.edu/tutorials'),
  },
  {
    id: 'faq',
    title: 'FAQ Document',
    subtitle: 'Frequently asked questions',
    icon: FileText,
    color: '#06B6D4',
    action: () => Linking.openURL('https://college.edu/faq'),
  },
];

export default function StudentHelpSupport() {
  const { theme } = useTheme();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Help & Support" 
        subtitle="Get help and find resources"
        showBackButton={true}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.section}>
          <AnimatedCard style={styles.welcomeCard}>
            <View style={styles.welcomeContent}>
              <HelpCircle size={32} color={theme.colors.primary} />
              <View style={styles.welcomeText}>
                <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>
                  How can we help you?
                </Text>
                <Text style={[styles.welcomeSubtitle, { color: theme.colors.textSecondary }]}>
                  Find answers to common questions, get in touch with support, 
                  or explore helpful resources to make the most of your experience.
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Support Channels */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Get in Touch
          </Text>
          <View style={styles.channelsGrid}>
            {supportChannels.map((channel) => {
              const IconComponent = channel.icon;
              return (
                <TouchableOpacity
                  key={channel.id}
                  style={[styles.channelCard, { backgroundColor: theme.colors.card }]}
                  onPress={channel.action}
                  activeOpacity={0.7}
                >
                  <View style={[styles.channelIcon, { backgroundColor: channel.color + '20' }]}>
                    <IconComponent size={24} color={channel.color} />
                  </View>
                  <View style={styles.channelContent}>
                    <Text style={[styles.channelTitle, { color: theme.colors.text }]}>
                      {channel.title}
                    </Text>
                    <Text style={[styles.channelSubtitle, { color: theme.colors.textSecondary }]}>
                      {channel.subtitle}
                    </Text>
                  </View>
                  <ExternalLink size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Frequently Asked Questions
          </Text>
          {faqData.map((faq) => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <AnimatedCard key={faq.id} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFaq(faq.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
                    {faq.question}
                  </Text>
                  {isExpanded ? (
                    <ChevronDown size={20} color={theme.colors.textSecondary} />
                  ) : (
                    <ChevronRight size={20} color={theme.colors.textSecondary} />
                  )}
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.faqAnswer}>
                    <Text style={[styles.faqAnswerText, { color: theme.colors.textSecondary }]}>
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </AnimatedCard>
            );
          })}
        </View>

        {/* Resources Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Helpful Resources
          </Text>
          <View style={styles.resourcesGrid}>
            {resources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <TouchableOpacity
                  key={resource.id}
                  style={[styles.resourceCard, { backgroundColor: theme.colors.card }]}
                  onPress={resource.action}
                  activeOpacity={0.7}
                >
                  <View style={[styles.resourceIcon, { backgroundColor: resource.color + '20' }]}>
                    <IconComponent size={24} color={resource.color} />
                  </View>
                  <View style={styles.resourceContent}>
                    <Text style={[styles.resourceTitle, { color: theme.colors.text }]}>
                      {resource.title}
                    </Text>
                    <Text style={[styles.resourceSubtitle, { color: theme.colors.textSecondary }]}>
                      {resource.subtitle}
                    </Text>
                  </View>
                  <ExternalLink size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Additional Help */}
        <View style={styles.section}>
          <AnimatedCard style={styles.additionalHelpCard}>
            <View style={styles.additionalHelpContent}>
              <MessageSquare size={24} color={theme.colors.primary} />
              <View style={styles.additionalHelpText}>
                <Text style={[styles.additionalHelpTitle, { color: theme.colors.text }]}>
                  Still need help?
                </Text>
                <Text style={[styles.additionalHelpSubtitle, { color: theme.colors.textSecondary }]}>
                  If you couldn't find what you're looking for, use the "Raise Query" 
                  feature in settings to submit a specific question or concern.
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
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  welcomeCard: {
    marginBottom: 0,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  channelsGrid: {
    gap: 12,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  channelIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelContent: {
    flex: 1,
  },
  channelTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  channelSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  faqCard: {
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  resourcesGrid: {
    gap: 12,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  resourceSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  additionalHelpCard: {
    marginBottom: 0,
  },
  additionalHelpContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  additionalHelpText: {
    flex: 1,
  },
  additionalHelpTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  additionalHelpSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});
