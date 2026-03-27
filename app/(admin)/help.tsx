import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import TopMenuBar from '@/components/TopMenuBar';
import AnimatedCard from '@/components/AnimatedCard';
// @ts-ignore
import { Mail, MessageCircle, Phone, FileQuestion } from 'lucide-react-native';

export default function AdminHelp() {
    const { theme } = useTheme();

    const supportOptions = [
        {
            icon: FileQuestion,
            title: 'FAQs',
            description: 'Common questions about admin tools',
            action: () => { },
        },
        {
            icon: Mail,
            title: 'Email Support',
            description: 'admin-support@bountiesandberries.com',
            action: () => Linking.openURL('mailto:admin-support@bountiesandberries.com'),
        },
        {
            icon: Phone,
            title: 'Emergency Hotline',
            description: '+1 (800) 123-4567',
            action: () => Linking.openURL('tel:+18001234567'),
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <TopMenuBar
                title="Help & Support"
                subtitle="Get assistance with admin tools"
                showBackButton={true}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact Us</Text>

                {supportOptions.map((option, index) => (
                    <AnimatedCard key={index} style={styles.card} onPress={option.action}>
                        <View style={styles.cardContent}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                                <option.icon size={24} color={theme.colors.primary} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{option.title}</Text>
                                <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
                                    {option.description}
                                </Text>
                            </View>
                        </View>
                    </AnimatedCard>
                ))}

                <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 24 }]}>Common Issues</Text>
                <AnimatedCard style={styles.faqCard}>
                    <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>How do I reset a user's password?</Text>
                    <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>
                        Go to the Users tab, search for the user, and click on "Reset Password" in their profile options.
                    </Text>
                </AnimatedCard>

                <AnimatedCard style={styles.faqCard}>
                    <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>How do I approve a bounty?</Text>
                    <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>
                        Navigate to the Dashboard or Notifications to see pending bounty requests.
                    </Text>
                </AnimatedCard>
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
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 16,
    },
    card: {
        marginBottom: 12,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
    },
    cardDescription: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        marginTop: 2,
    },
    faqCard: {
        marginBottom: 12,
        padding: 16,
    },
    faqQuestion: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        marginBottom: 8,
    },
    faqAnswer: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
    },
});
