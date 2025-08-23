import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  Alert,
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
    question: 'How do I approve student point requests?',
    answer: 'Navigate to the Approvals section from your home dashboard. You can review pending requests and approve or reject them with comments. Each approval will automatically award the specified berries to the student.',
    category: 'Faculty Operations'
  },
  {
    id: '2',
    question: 'Can I create custom events for my department?',
    answer: 'Yes! Faculty members can create department-specific events. Go to the Events section and use the "Create Event" button. You can set berry rewards, participation limits, and event details.',
    category: 'Event Management'
  },
  {
    id: '3',
    question: 'How do I track student progress?',
    answer: 'Access the Student Progress section to view individual student performance, berry earnings, and activity history. You can filter by department, year, and other criteria.',
    category: 'Student Monitoring'
  },
  {
    id: '4',
    question: 'What are the berry allocation rules?',
    answer: 'Berry allocation follows predefined rules set by administrators. Common activities include academic achievements (50-200 berries), participation in events (10-100 berries), and community service (25-150 berries).',
    category: 'Point System'
  },
  {
    id: '5',
    question: 'How can I contact technical support?',
    answer: 'For technical issues, use the Raise Query feature and select "Technical Issue" category. For urgent matters, call our support line at +1-555-0123 or email support@college.edu',
    category: 'Technical Support'
  },
  {
    id: '6',
    question: 'Can I export student data for analysis?',
    answer: 'Yes, you can export student progress data in CSV format from the Student Progress section. This includes berry earnings, activity participation, and performance metrics.',
    category: 'Data Management'
  }
];

const supportChannels = [
  {
    id: 'phone',
    title: 'Phone Support',
    subtitle: '24/7 Technical Support',
    icon: Phone,
    color: '#10B981',
    action: () => Linking.openURL('tel:+1-555-0123'),
    details: '+1-555-0123'
  },
  {
    id: 'email',
    title: 'Email Support',
    subtitle: 'General Inquiries',
    icon: Mail,
    color: '#3B82F6',
    action: () => Linking.openURL('mailto:support@college.edu'),
    details: 'support@college.edu'
  },
  {
    id: 'chat',
    title: 'Live Chat',
    subtitle: 'Real-time Assistance',
    icon: MessageSquare,
    color: '#F59E0B',
    action: () => Alert.alert('Live Chat', 'Live chat feature coming soon!'),
    details: 'Available 9 AM - 6 PM'
  }
];

const resources = [
  {
    id: 'manual',
    title: 'Faculty Manual',
    subtitle: 'Complete guide to using the platform',
    icon: BookOpen,
    color: '#8B5CF6',
    action: () => Linking.openURL('https://college.edu/faculty-manual')
  },
  {
    id: 'tutorials',
    title: 'Video Tutorials',
    subtitle: 'Step-by-step video guides',
    icon: Video,
    color: '#EF4444',
    action: () => Linking.openURL('https://college.edu/tutorials')
  },
  {
    id: 'faq',
    title: 'FAQ Database',
    subtitle: 'Searchable question database',
    icon: FileText,
    color: '#06B6D4',
    action: () => Linking.openURL('https://college.edu/faq')
  }
];

export default function HelpSupport() {
  const { theme } = useTheme();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const groupedFaqs = faqData.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqData>);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Help & Support"
        subtitle="Get assistance and find answers"
        showBackButton={true}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View style={styles.section}>
          <AnimatedCard style={styles.headerCard}>
            <View style={styles.headerContent}>
              <View style={[styles.headerIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <HelpCircle size={32} color={theme.colors.primary} />
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                  How can we help you?
                </Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                  Find answers to common questions, contact support, and access helpful resources.
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Support Channels */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Contact Support
          </Text>
          <View style={styles.supportGrid}>
            {supportChannels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                style={[styles.supportCard, { backgroundColor: theme.colors.card }]}
                onPress={channel.action}
                activeOpacity={0.8}
              >
                <View style={[styles.supportIcon, { backgroundColor: channel.color + '20' }]}>
                  <channel.icon size={24} color={channel.color} />
                </View>
                <View style={styles.supportContent}>
                  <Text style={[styles.supportTitle, { color: theme.colors.text }]}>
                    {channel.title}
                  </Text>
                  <Text style={[styles.supportSubtitle, { color: theme.colors.textSecondary }]}>
                    {channel.subtitle}
                  </Text>
                  <Text style={[styles.supportDetails, { color: channel.color }]}>
                    {channel.details}
                  </Text>
                </View>
                <ExternalLink size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Helpful Resources
          </Text>
          <View style={styles.resourcesGrid}>
            {resources.map((resource) => (
              <TouchableOpacity
                key={resource.id}
                style={[styles.resourceCard, { backgroundColor: theme.colors.card }]}
                onPress={resource.action}
                activeOpacity={0.8}
              >
                <View style={[styles.resourceIcon, { backgroundColor: resource.color + '20' }]}>
                  <resource.icon size={24} color={resource.color} />
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
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Frequently Asked Questions
          </Text>
          
          {Object.entries(groupedFaqs).map(([category, faqs]) => (
            <View key={category} style={styles.faqCategory}>
              <Text style={[styles.categoryTitle, { color: theme.colors.primary }]}>
                {category}
              </Text>
              {faqs.map((faq) => (
                <AnimatedCard key={faq.id} style={styles.faqCard}>
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => toggleFaq(faq.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
                      {faq.question}
                    </Text>
                    {expandedFaq === faq.id ? (
                      <ChevronDown size={20} color={theme.colors.textSecondary} />
                    ) : (
                      <ChevronRight size={20} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                  
                  {expandedFaq === faq.id && (
                    <View style={styles.faqAnswer}>
                      <Text style={[styles.faqAnswerText, { color: theme.colors.textSecondary }]}>
                        {faq.answer}
                      </Text>
                    </View>
                  )}
                </AnimatedCard>
              ))}
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <AnimatedCard style={styles.quickActionsCard}>
            <Text style={[styles.quickActionsTitle, { color: theme.colors.text }]}>
              Still need help?
            </Text>
            <Text style={[styles.quickActionsSubtitle, { color: theme.colors.textSecondary }]}>
              Can't find what you're looking for? Submit a new query and our team will assist you.
            </Text>
            <TouchableOpacity
              style={[styles.raiseQueryButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => {/* Navigate to raise query */}}
              activeOpacity={0.8}
            >
              <MessageSquare size={20} color="#FFFFFF" />
              <Text style={styles.raiseQueryButtonText}>Raise New Query</Text>
            </TouchableOpacity>
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
  headerCard: {
    marginBottom: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  supportGrid: {
    gap: 12,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  supportSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  supportDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
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
  faqCategory: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  faqCard: {
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  faqQuestion: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    flex: 1,
    paddingRight: 16,
  },
  faqAnswer: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  faqAnswerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  quickActionsCard: {
    marginBottom: 0,
    alignItems: 'center',
    textAlign: 'center',
  },
  quickActionsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  quickActionsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  raiseQueryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  raiseQueryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
