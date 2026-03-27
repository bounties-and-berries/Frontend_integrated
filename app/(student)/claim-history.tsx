import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalSearchParams } from 'expo-router';
import { getClaimedRewards, getUserAvailableBerries } from '@/utils/api';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import {
  Gift,
  TrendingDown,
  ShoppingBag,
  Calendar,
  Hash,
  ArrowDownCircle,
  Wallet,
} from 'lucide-react-native';

type ClaimItem = {
  claim_id: string;
  reward_id: string;
  name: string;
  description: string;
  berries_spent: number;
  berries_required: number;
  redeemable_code: string;
  created_on: string;
  img_url: string;
};

export default function ClaimHistory() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const view = (params.view as string) || 'claims'; // 'claims' or 'spending'

  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [currentBerries, setCurrentBerries] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [claimsRes, statsRes] = await Promise.all([
        getClaimedRewards(),
        getUserAvailableBerries(),
      ]);
      setClaims(claimsRes || []);
      const spent = (claimsRes || []).reduce(
        (sum: number, c: any) => sum + (parseInt(c.berries_spent, 10) || 0),
        0
      );
      setTotalSpent(spent);
      setCurrentBerries(statsRes.data?.berries?.current || 0);
    } catch (e) {
      console.error('Failed to fetch claim history:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isSpendingView = view === 'spending';
  const title = isSpendingView ? 'Spending History' : 'Claimed Rewards';
  const subtitle = isSpendingView
    ? 'Track your berries spending'
    : 'All rewards you have claimed';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar title={title} subtitle={subtitle} showBackButton />

      {/* Summary Card */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <AnimatedCard style={styles.summaryCard}>
            <View style={[styles.summaryIconWrap, { backgroundColor: theme.colors.primary + '20' }]}>
              {isSpendingView ? (
                <TrendingDown size={22} color={theme.colors.primary} />
              ) : (
                <ShoppingBag size={22} color={theme.colors.primary} />
              )}
            </View>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {isSpendingView ? totalSpent : claims.length}
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              {isSpendingView ? 'Berries Spent' : 'Items Claimed'}
            </Text>
          </AnimatedCard>

          <AnimatedCard style={styles.summaryCard}>
            <View style={[styles.summaryIconWrap, { backgroundColor: theme.colors.success + '20' }]}>
              <Wallet size={22} color={theme.colors.success} />
            </View>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {currentBerries}
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Current Balance
            </Text>
          </AnimatedCard>
        </View>
      </View>

      {/* Transaction List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading history...
          </Text>
        </View>
      ) : claims.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Gift size={56} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No transactions yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            Claim rewards from the Rewards tab to see them here.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.listContainer}>
            {/* Section header */}
            <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>
              {isSpendingView ? 'All Transactions' : 'All Claims'} ({claims.length})
            </Text>

            {claims.map((claim, index) => (
              <AnimatedCard key={claim.claim_id || index} style={styles.txCard}>
                <View style={styles.txRow}>
                  {/* Left: icon circle */}
                  <View
                    style={[
                      styles.txIconCircle,
                      {
                        backgroundColor: isSpendingView
                          ? theme.colors.error + '15'
                          : theme.colors.primary + '15',
                      },
                    ]}
                  >
                    {isSpendingView ? (
                      <ArrowDownCircle size={22} color={theme.colors.error} />
                    ) : (
                      <Gift size={22} color={theme.colors.primary} />
                    )}
                  </View>

                  {/* Middle: info */}
                  <View style={styles.txInfo}>
                    <Text
                      style={[styles.txName, { color: theme.colors.text }]}
                      numberOfLines={1}
                    >
                      {claim.name}
                    </Text>
                    <View style={styles.txMeta}>
                      <Calendar size={12} color={theme.colors.textSecondary} />
                      <Text style={[styles.txDate, { color: theme.colors.textSecondary }]}>
                        {formatDate(claim.created_on)} • {formatTime(claim.created_on)}
                      </Text>
                    </View>
                    {!isSpendingView && claim.redeemable_code && (
                      <View style={styles.txCodeRow}>
                        <Hash size={12} color={theme.colors.accent} />
                        <Text
                          selectable
                          style={[styles.txCode, { color: theme.colors.accent }]}
                        >
                          {claim.redeemable_code}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Right: amount */}
                  <View style={styles.txAmountWrap}>
                    <Text
                      style={[
                        styles.txAmount,
                        { color: isSpendingView ? theme.colors.error : theme.colors.primary },
                      ]}
                    >
                      {isSpendingView ? '-' : ''}
                      {parseInt(String(claim.berries_spent || claim.berries_required), 10)}
                    </Text>
                    <Text style={[styles.txAmountLabel, { color: theme.colors.textSecondary }]}>
                      berries
                    </Text>
                  </View>
                </View>
              </AnimatedCard>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  summarySection: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  summaryRow: { flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, alignItems: 'center', gap: 6 },
  summaryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  summaryValue: { fontSize: 24, fontFamily: 'Poppins-Bold' },
  summaryLabel: { fontSize: 12, fontFamily: 'Inter-Regular', textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, fontFamily: 'Inter-Regular' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 20, fontFamily: 'Poppins-SemiBold' },
  emptySubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center' },
  listScroll: { flex: 1 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 30, gap: 10 },
  sectionHeader: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 4,
  },
  txCard: { marginBottom: 0, padding: 0 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  txIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfo: { flex: 1, gap: 3 },
  txName: { fontSize: 15, fontFamily: 'Inter-SemiBold' },
  txMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  txDate: { fontSize: 12, fontFamily: 'Inter-Regular' },
  txCodeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  txCode: { fontSize: 12, fontFamily: 'Inter-Bold', letterSpacing: 0.5 },
  txAmountWrap: { alignItems: 'flex-end' },
  txAmount: { fontSize: 18, fontFamily: 'Poppins-Bold' },
  txAmountLabel: { fontSize: 10, fontFamily: 'Inter-Regular' },
});
