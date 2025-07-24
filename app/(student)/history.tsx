import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getMyParticipations } from '@/utils/api';
import AnimatedCard from '@/components/AnimatedCard';
import { TrendingUp, TrendingDown, Filter, Calendar } from 'lucide-react-native';

const filterOptions = ['All', 'Earned', 'Spent'];

export default function StudentHistory() {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [participations, setParticipations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getMyParticipations();
        setParticipations(data.participations || []);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch participation history');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map participations to transaction-like objects
  const transactions = participations.map((p) => ({
    id: p.participation_id,
    description: p.bounty_name,
    date: p.updated_on || p.created_on || new Date().toISOString(),
    type: p.status === 'completed' ? 'earned' : 'registered',
    points: p.points_earned || 0,
    category: p.status,
  }));

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'All') return true;
    return selectedFilter === 'Earned' 
      ? transaction.type === 'earned' 
      : transaction.type === 'spent';
  });

  const totalEarned = transactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.points, 0);
  const totalSpent = 0; // No 'spent' in participation, but kept for UI consistency

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Points History
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Track your earning and spending activity
        </Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <AnimatedCard style={styles.summaryCard}>
            <View style={styles.summaryContent}>
              <View style={[styles.summaryIcon, { backgroundColor: theme.colors.success + '20' }]}>
                <TrendingUp size={20} color={theme.colors.success} />
              </View>
              <View>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  {totalEarned}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Total Earned
                </Text>
              </View>
            </View>
          </AnimatedCard>
          
          <AnimatedCard style={styles.summaryCard}>
            <View style={styles.summaryContent}>
              <View style={[styles.summaryIcon, { backgroundColor: theme.colors.error + '20' }]}>
                <TrendingDown size={20} color={theme.colors.error} />
              </View>
              <View>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  {totalSpent}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Total Spent
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.filterButtons}>
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                {
                  backgroundColor: selectedFilter === filter 
                    ? theme.colors.primary 
                    : theme.colors.surface,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterButtonText,
                { 
                  color: selectedFilter === filter 
                    ? '#FFFFFF' 
                    : theme.colors.textSecondary 
                }
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView 
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.transactionsContainer}>
          {loading ? (
            <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: 20 }}>Loading...</Text>
          ) : error ? (
            <Text style={{ color: theme.colors.error, textAlign: 'center', marginTop: 20 }}>{error}</Text>
          ) : filteredTransactions.length === 0 ? (
            <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: 20 }}>No participation history found.</Text>
          ) : (
            filteredTransactions.map((transaction) => (
              <AnimatedCard key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionContent}>
                  <View style={[
                    styles.transactionIcon,
                    { 
                      backgroundColor: transaction.type === 'earned' 
                        ? theme.colors.success + '20' 
                        : theme.colors.error + '20'
                    }
                  ]}>
                    <TrendingUp size={20} color={theme.colors.success} />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionDescription, { color: theme.colors.text }]}> 
                      {transaction.description}
                    </Text>
                    <View style={styles.transactionMeta}>
                      <Calendar size={12} color={theme.colors.textSecondary} />
                      <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}> 
                        {new Date(transaction.date).toLocaleDateString()}
                      </Text>
                      {transaction.category && (
                        <>
                          <Text style={[styles.transactionSeparator, { color: theme.colors.textSecondary }]}> 
                            •
                          </Text>
                          <Text style={[styles.transactionCategory, { color: theme.colors.textSecondary }]}> 
                            {transaction.category}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                  <View style={styles.transactionPoints}>
                    <Text style={[
                      styles.transactionPointsText,
                      { color: theme.colors.success }
                    ]}>
                      +{transaction.points}
                    </Text>
                    <Text style={[styles.transactionPointsLabel, { color: theme.colors.textSecondary }]}> 
                      points
                    </Text>
                  </View>
                </View>
              </AnimatedCard>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  summarySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  transactionsList: {
    flex: 1,
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  transactionCard: {
    marginBottom: 0,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    gap: 4,
  },
  transactionDescription: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  transactionSeparator: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  transactionCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textTransform: 'capitalize',
  },
  transactionPoints: {
    alignItems: 'flex-end',
  },
  transactionPointsText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  transactionPointsLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
});