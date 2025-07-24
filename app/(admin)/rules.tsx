import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Plus, Search, Shield, Award, Calendar, Users, BookOpen, CreditCard as Edit, Trash2 } from 'lucide-react-native';

interface BerryRule {
  id: string;
  category: string;
  activity: string;
  berries: number;
  maxPerDay?: number;
  maxPerMonth?: number;
  description: string;
  icon: any;
  color: string;
}

const mockRules: BerryRule[] = [
  {
    id: '1',
    category: 'Academic',
    activity: 'Perfect Attendance',
    berries: 10,
    maxPerDay: 1,
    description: 'Attending all classes in a day',
    icon: BookOpen,
    color: '#6366F1',
  },
  {
    id: '2',
    category: 'Academic',
    activity: 'Assignment Submission',
    berries: 5,
    maxPerDay: 3,
    description: 'Submitting assignments on time',
    icon: BookOpen,
    color: '#6366F1',
  },
  {
    id: '3',
    category: 'Cultural',
    activity: 'Bounty Participation',
    berries: 50,
    maxPerMonth: 5,
    description: 'Participating in cultural bounties',
    icon: Calendar,
    color: '#8B5CF6',
  },
  {
    id: '4',
    category: 'Volunteer',
    activity: 'Community Service',
    berries: 100,
    maxPerMonth: 3,
    description: 'Volunteering for community activities',
    icon: Users,
    color: '#10B981',
  },
  {
    id: '5',
    category: 'Achievement',
    activity: 'Competition Winner',
    berries: 200,
    description: 'Winning academic or cultural competitions',
    icon: Award,
    color: '#F59E0B',
  },
];

export default function AdminRules() {
  const { theme } = useTheme();
  const router = useRouter();
  const [rules, setRules] = useState(mockRules);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredRules = rules.filter(rule =>
    rule.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRule = () => {
    router.push('/(admin)/create-rule' as any);
  };

  const handleEditRule = (ruleId: string) => {
    Alert.alert('Edit Rule', `Edit rule ${ruleId} - Feature coming soon.`);
  };

  const handleDeleteRule = (ruleId: string) => {
    Alert.alert(
      'Delete Rule',
      'Are you sure you want to delete this rule?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setRules(prev => prev.filter(rule => rule.id !== ruleId));
            Alert.alert('Success', 'Rule deleted successfully!');
          }
        }
      ]
    );
  };

  const getCategoryStats = () => {
    const stats = rules.reduce((acc, rule) => {
      acc[rule.category] = (acc[rule.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(stats).map(([category, count]) => ({
      category,
      count,
      totalBerries: rules
        .filter(r => r.category === category)
        .reduce((sum, r) => sum + r.berries, 0)
    }));
  };

  const categoryStats = getCategoryStats();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="Berry Rules"
        subtitle="Manage berry allocation rules"
      />

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddRule}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Rule</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search rules..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Category Overview
          </Text>
          <View style={styles.categoryGrid}>
            {categoryStats.map((stat) => (
              <AnimatedCard key={stat.category} style={styles.categoryCard}>
                <View style={styles.categoryContent}>
                  <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                    {stat.category}
                  </Text>
                  <Text style={[styles.categoryCount, { color: theme.colors.textSecondary }]}>
                    {stat.count} rules
                  </Text>
                  <Text style={[styles.categoryBerries, { color: theme.colors.primary }]}>
                    {stat.totalBerries} max berries
                  </Text>
                </View>
              </AnimatedCard>
            ))}
          </View>
        </View>

        {/* Rules List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            All Rules
          </Text>
          
          <View style={styles.rulesList}>
            {filteredRules.length === 0 ? (
              <AnimatedCard style={styles.emptyCard}>
                <View style={styles.emptyContent}>
                  <Shield size={48} color={theme.colors.textSecondary} />
                  <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                    No Rules Found
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                    Create your first berry rule to get started.
                  </Text>
                </View>
              </AnimatedCard>
            ) : (
              filteredRules.map((rule) => (
                <AnimatedCard key={rule.id} style={styles.ruleCard}>
                  <View style={styles.ruleContent}>
                    <View style={styles.ruleLeft}>
                      <View style={[
                        styles.ruleIcon,
                        { backgroundColor: rule.color + '20' }
                      ]}>
                        <rule.icon size={20} color={rule.color} />
                      </View>
                      <View style={styles.ruleInfo}>
                        <Text style={[styles.ruleActivity, { color: theme.colors.text }]}>
                          {rule.activity}
                        </Text>
                        <Text style={[styles.ruleDescription, { color: theme.colors.textSecondary }]}>
                          {rule.description}
                        </Text>
                        <View style={styles.ruleMeta}>
                          <View style={[
                            styles.categoryTag,
                            { backgroundColor: rule.color + '20' }
                          ]}>
                            <Text style={[styles.categoryTagText, { color: rule.color }]}>
                              {rule.category}
                            </Text>
                          </View>
                          {rule.maxPerDay && (
                            <Text style={[styles.limitText, { color: theme.colors.textSecondary }]}>
                              Max {rule.maxPerDay}/day
                            </Text>
                          )}
                          {rule.maxPerMonth && (
                            <Text style={[styles.limitText, { color: theme.colors.textSecondary }]}>
                              Max {rule.maxPerMonth}/month
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.ruleRight}>
                      <View style={styles.berriesBadge}>
                        <Text style={[styles.berriesText, { color: theme.colors.primary }]}>
                          +{rule.berries}
                        </Text>
                        <Text style={[styles.berriesLabel, { color: theme.colors.textSecondary }]}>
                          berries
                        </Text>
                      </View>
                      
                      <View style={styles.ruleActions}>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.colors.secondary + '20' }]}
                          onPress={() => handleEditRule(rule.id)}
                        >
                          <Edit size={14} color={theme.colors.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.colors.error + '20' }]}
                          onPress={() => handleDeleteRule(rule.id)}
                        >
                          <Trash2 size={14} color={theme.colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </AnimatedCard>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
  },
  categoryContent: {
    alignItems: 'center',
    gap: 4,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  categoryBerries: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  rulesList: {
    gap: 16,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContent: {
    alignItems: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  ruleCard: {
    marginBottom: 0,
  },
  ruleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ruleLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  ruleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleInfo: {
    flex: 1,
    gap: 4,
  },
  ruleActivity: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  ruleDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  ruleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  categoryTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryTagText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  limitText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  ruleRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  berriesBadge: {
    alignItems: 'center',
  },
  berriesText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  berriesLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  ruleActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});