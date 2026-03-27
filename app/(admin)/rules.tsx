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
import { Plus, Search, Shield, Award, Calendar, Users, BookOpen, CreditCard as Edit, Trash2, Trophy } from 'lucide-react-native';
import { useResponsive } from '@/hooks/useResponsive';
import { getAllRules, deleteRule } from '@/utils/api';

export default function AdminRules() {
  const { theme } = useTheme();
  const router = useRouter();
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { isMobile } = useResponsive();

  const styles = getStyles(theme, isMobile);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await getAllRules();
      setRules(response.data || []);
    } catch (error) {
      console.error('Error fetching rules:', error);
      Alert.alert('Error', 'Failed to fetch berry rules');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRules();
  }, []);

  const filteredRules = rules.filter(rule =>
    (rule.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (rule.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRule = () => {
    router.push('/(admin)/create-rule' as any);
  };

  const handleEditRule = (ruleId: string) => {
    router.push({
      pathname: '/(admin)/edit-rule',
      params: { id: ruleId }
    } as any);
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
          onPress: async () => {
            try {
              await deleteRule(ruleId);
              setRules(prev => prev.filter(rule => rule.id !== ruleId));
              Alert.alert('Success', 'Rule deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete rule');
            }
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
        .reduce((sum, r) => sum + (r.points || 0), 0)
    }));
  };

  const categoryStats = getCategoryStats();

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'academic': return BookOpen;
      case 'cultural': return Trophy;
      case 'volunteer': return Users;
      case 'achievement': return Award;
      default: return Shield;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'academic': return '#6366F1';
      case 'cultural': return '#8B5CF6';
      case 'volunteer': return '#10B981';
      case 'achievement': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar
        title="Berry Rules"
        subtitle="Manage berry allocation rules"
      />

      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddRule}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Rule</Text>
        </TouchableOpacity>
      </View>

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
                    {loading ? 'Fetching rules...' : 'Create your first berry rule to get started.'}
                  </Text>
                </View>
              </AnimatedCard>
            ) : (
              filteredRules.map((rule) => {
                const Icon = getCategoryIcon(rule.category);
                const categoryColor = getCategoryColor(rule.category);
                
                return (
                  <AnimatedCard key={rule.id} style={styles.ruleCard}>
                    <View style={styles.ruleContent}>
                      <View style={styles.ruleLeft}>
                        <View style={[
                          styles.ruleIcon,
                          { backgroundColor: categoryColor + '20' }
                        ]}>
                          <Icon size={20} color={categoryColor} />
                        </View>
                        <View style={styles.ruleInfo}>
                          <Text style={[styles.ruleActivity, { color: theme.colors.text }]}>
                            {rule.name}
                          </Text>
                          <Text style={[styles.ruleDescription, { color: theme.colors.textSecondary }]}>
                            {rule.description}
                          </Text>
                          <View style={styles.ruleMeta}>
                            <View style={[
                              styles.categoryTag,
                              { backgroundColor: categoryColor + '20' }
                            ]}>
                              <Text style={[styles.categoryTagText, { color: categoryColor }]}>
                                {rule.category}
                              </Text>
                            </View>
                            {rule.per_day_limit > 0 && (
                              <Text style={[styles.limitText, { color: theme.colors.textSecondary }]}>
                                Max {rule.per_day_limit}/day
                              </Text>
                            )}
                            {rule.per_month_limit > 0 && (
                              <Text style={[styles.limitText, { color: theme.colors.textSecondary }]}>
                                Max {rule.per_month_limit}/month
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>

                      <View style={styles.ruleRight}>
                        <View style={styles.berriesBadge}>
                          <Text style={[styles.berriesText, { color: theme.colors.primary }]}>
                            +{rule.points}
                          </Text>
                          <Text style={[styles.berriesLabel, { color: theme.colors.textSecondary }]}>
                            points
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
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any, isMobile: boolean) => StyleSheet.create({
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
    minHeight: 44,
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
    minHeight: 44,
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
    width: isMobile ? '100%' : '48%',
    minHeight: 44,
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
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: isMobile ? 16 : 0,
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
    alignItems: isMobile ? 'flex-start' : 'flex-end',
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
    minWidth: 44,
    minHeight: 44,
  },
});