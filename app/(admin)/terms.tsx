import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import TopMenuBar from '@/components/TopMenuBar';
import AnimatedCard from '@/components/AnimatedCard';

export default function AdminTerms() {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <TopMenuBar
                title="Terms & Conditions"
                subtitle="Read our terms of service"
                showBackButton={true}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <AnimatedCard style={styles.card}>
                    <Text style={[styles.heading, { color: theme.colors.text }]}>1. Introduction</Text>
                    <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
                        Welcome to Bounties & Berries. By accessing our administration panel, you agree to these terms and conditions.
                    </Text>

                    <Text style={[styles.heading, { color: theme.colors.text }]}>2. Admin Responsibilities</Text>
                    <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
                        As an administrator, you are responsible for maintaining the integrity of the system, managing user accounts responsibly, and ensuring fair distribution of berries.
                    </Text>

                    <Text style={[styles.heading, { color: theme.colors.text }]}>3. Data Privacy</Text>
                    <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
                        You must handle all student and faculty data with strict confidentiality and in compliance with data protection regulations.
                    </Text>

                    <Text style={[styles.heading, { color: theme.colors.text }]}>4. System Usage</Text>
                    <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
                        Any abuse of administrative privileges, including unauthorized berry generation or user manipulation, will result in immediate account suspension.
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
    card: {
        padding: 20,
    },
    heading: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 8,
        marginTop: 16,
    },
    paragraph: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 22,
        marginBottom: 8,
    },
});
