import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Student } from '@/types';
import { searchRewards, claimReward, getClaimedRewards, getUserAvailableBerries } from '@/utils/api';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import {
  Search,
  Gift,
  Star,
  Tag,
  TrendingDown,
  ShoppingBag,
  Filter,
  X,
  Wallet,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react-native';

const sortOptions = ['Expiry Date', 'Name'];

export default function StudentRewards() {
  const { theme } = useTheme();
  const { user, refreshUserBerries } = useAuth();
  const router = useRouter();
  const student = user as Student;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('Expiry Date');
  const [showFilters, setShowFilters] = useState(false);

  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimSuccess, setClaimSuccess] = useState<{ code: string; remaining: number; rewardId: string } | null>(null);
  const [itemsClaimed, setItemsClaimed] = useState(0);
  const [totalPointsSpent, setTotalPointsSpent] = useState(0);
  const [availableBerries, setAvailableBerries] = useState<number>(student?.totalPoints || 0);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const fetchRewards = async () => {
    setLoading(true);
    setError('');
    try {
      let sortBy = 'expiry_date';
      if (selectedSort === 'Name') sortBy = 'name';
      const filters: any = {
        filters: {
          name: searchQuery || undefined,
        },
        sortBy,
        sortOrder: 'asc',
        pageNumber: 1,
        pageSize: 50,
      };
      const res = await searchRewards(filters);
      const now = new Date();
      const nonExpired = (res.results || []).filter((r: any) => !r.expiry_date || new Date(r.expiry_date) > now);
      setRewards(nonExpired);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchBerriesAndClaims = async () => {
      try {
        const [statsRes, claimsRes] = await Promise.all([
          getUserAvailableBerries(),
          getClaimedRewards(),
        ]);
        const backendBerries = statsRes.data?.berries?.current;
        const backendSpent = statsRes.data?.berries?.total_spent || 0;
        setAvailableBerries(backendBerries !== undefined ? backendBerries : (student?.totalPoints || 0));
        setTotalPointsSpent(backendSpent);
        setItemsClaimed(claimsRes.length || 0);
      } catch (e) {
        setAvailableBerries(student?.totalPoints || 0);
      }
    };
    fetchBerriesAndClaims();
  }, []);

  React.useEffect(() => {
    fetchRewards();
  }, [searchQuery, selectedSort]);

  const handleClaim = async (reward: any) => {
    const studentPoints = Number(availableBerries);
    const requiredPoints = Number(reward.berries_required);
    if (studentPoints < requiredPoints) {
      if (Platform.OS === 'web') {
        window.alert(`You need ${requiredPoints - studentPoints} more berries to claim this reward.`);
      } else {
        Alert.alert('Insufficient Berries', `You need ${requiredPoints - studentPoints} more berries to claim this reward.`);
      }
      return;
    }
    setClaimingId(reward.id);
    setClaimMessage('');
    setClaimSuccess(null);
    try {
      const res = await claimReward(reward.id);
      setClaimMessage(res.message || 'Reward claimed successfully!');
      setClaimSuccess({ code: res.redeem_code, remaining: res.remaining_berries, rewardId: reward.id?.toString() });

      // Optimistic update for immediate UI feedback
      setAvailableBerries(res.remaining_berries);
      setTotalPointsSpent(prev => prev + Number(reward.berries_required));
      setItemsClaimed(prev => prev + 1);
      setShowClaimModal(true);

      // Then sync accurate data from backend
      await refreshUserBerries();
      fetchRewards();

      // Re-fetch latest stats so chips are perfectly accurate
      try {
        const [statsRes, claimsRes] = await Promise.all([getUserAvailableBerries(), getClaimedRewards()]);
        const backendBerries = statsRes.data?.berries?.current;
        const backendSpent = statsRes.data?.berries?.total_spent || 0;
        if (backendBerries !== undefined) setAvailableBerries(backendBerries);
        setTotalPointsSpent(backendSpent);
        setItemsClaimed(claimsRes.length || 0);
      } catch (_) { /* keep optimistic values if re-fetch fails */ }
    } catch (e: any) {
      setClaimMessage(e.message || 'Failed to claim reward');
      setClaimSuccess(null);
      if (Platform.OS === 'web') {
        window.alert(e.message || 'Failed to claim reward');
      } else {
        Alert.alert('Error', e.message || 'Failed to claim reward');
      }
    } finally {
      setClaimingId(null);
    }
  };

  const getDaysUntilExpiry = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const diff = new Date(expiryDate).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar title="Rewards" subtitle="Spend your berries on exciting rewards" />

      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
        {/* ── Balance Strip ── */}
        <View style={styles.balanceStrip}>
          <View style={[styles.balanceCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.balanceLeft}>
              <View style={[styles.balanceIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Wallet size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>Available</Text>
                <Text style={[styles.balanceValue, { color: theme.colors.text }]}>{availableBerries} <Text style={styles.balanceUnit}>berries</Text></Text>
              </View>
            </View>
            <Sparkles size={18} color={theme.colors.accent} />
          </View>
        </View>

        {/* ── Quick Stats (tappable chips) ── */}
        <View style={styles.chipRow}>
          <TouchableOpacity
            style={[styles.chip, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => router.push('/(student)/claim-history?view=claims' as any)}
            activeOpacity={0.7}
          >
            <ShoppingBag size={16} color={theme.colors.primary} />
            <Text style={[styles.chipValue, { color: theme.colors.text }]}>{itemsClaimed}</Text>
            <Text style={[styles.chipLabel, { color: theme.colors.textSecondary }]}>Claimed</Text>
            <ChevronRight size={14} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => router.push('/(student)/claim-history?view=spending' as any)}
            activeOpacity={0.7}
          >
            <TrendingDown size={16} color={theme.colors.error} />
            <Text style={[styles.chipValue, { color: theme.colors.text }]}>{totalPointsSpent}</Text>
            <Text style={[styles.chipLabel, { color: theme.colors.textSecondary }]}>Spent</Text>
            <ChevronRight size={14} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ── Search Bar ── */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Search size={18} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search rewards..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {/* Sort toggle */}
          <TouchableOpacity
            style={[styles.sortToggle, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => setSelectedSort(selectedSort === 'Expiry Date' ? 'Name' : 'Expiry Date')}
          >
            <Filter size={16} color={theme.colors.primary} />
            <Text style={[styles.sortText, { color: theme.colors.primary }]}>{selectedSort}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Rewards List ── */}
        <View style={styles.rewardsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Available Rewards
          </Text>

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Text style={{ color: theme.colors.error, textAlign: 'center' }}>{error}</Text>
            </View>
          ) : rewards.length === 0 ? (
            <View style={styles.centerContainer}>
              <Gift size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No rewards available right now</Text>
            </View>
          ) : (
            <View style={styles.rewardsGrid}>
              {rewards.map((reward: any) => {
                const canAfford = availableBerries >= reward.berries_required;
                const daysLeft = getDaysUntilExpiry(reward.expiry_date);
                const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0;

                return (
                  <AnimatedCard key={reward.id} style={[styles.rewardCard, !canAfford && { opacity: 0.55 }]}>
                    {/* Expiry badge */}
                    {isExpiringSoon && (
                      <View style={[styles.expiryBadge, { backgroundColor: theme.colors.warning + '20' }]}>
                        <Clock size={10} color={theme.colors.warning} />
                        <Text style={[styles.expiryBadgeText, { color: theme.colors.warning }]}>
                          {daysLeft}d left
                        </Text>
                      </View>
                    )}

                    {/* Reward name & category */}
                    <View style={styles.cardTop}>
                      <View style={[styles.categoryDot, { backgroundColor: theme.colors.secondary + '30' }]}>
                        <Tag size={14} color={theme.colors.secondary} />
                      </View>
                      <Text style={[styles.categoryLabel, { color: theme.colors.textSecondary }]}>
                        {reward.category || 'Reward'}
                      </Text>
                    </View>

                    <Text style={[styles.rewardName, { color: theme.colors.text }]} numberOfLines={2}>
                      {reward.name}
                    </Text>

                    <Text style={[styles.rewardDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                      {reward.description || 'No description'}
                    </Text>

                    {/* Cost + Claim row */}
                    <View style={styles.cardFooter}>
                      <View style={styles.costRow}>
                        <Star size={14} color={theme.colors.accent} />
                        <Text style={[styles.costText, { color: theme.colors.text }]}>
                          {reward.berries_required}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.claimBtn,
                          {
                            backgroundColor: canAfford ? theme.colors.primary : theme.colors.border,
                          },
                        ]}
                        onPress={() => handleClaim(reward)}
                        disabled={!canAfford || claimingId === reward.id}
                        activeOpacity={0.7}
                      >
                        {claimingId === reward.id ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={[styles.claimBtnText, { color: canAfford ? '#fff' : theme.colors.textSecondary }]}>
                            {canAfford ? 'Claim' : 'Need More'}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </AnimatedCard>
                );
              })}
            </View>
          )}
        </View>

        {/* Bottom spacer for tab bar */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ── Claim Success Modal ── */}
      <Modal
        visible={showClaimModal && !!claimSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClaimModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.card }]}>
            {/* Close button */}
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowClaimModal(false)}>
              <X size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.modalIconWrap, { backgroundColor: theme.colors.success + '20' }]}>
              <Gift size={32} color={theme.colors.success} />
            </View>

            <Text style={[styles.modalTitle, { color: theme.colors.success }]}>Reward Claimed!</Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>Your redeem code:</Text>

            <View style={[styles.modalCodeBox, { backgroundColor: theme.colors.primary + '15' }]}>
              <Text selectable style={[styles.modalCodeText, { color: theme.colors.primary }]}>
                {claimSuccess?.code}
              </Text>
            </View>

            <View style={styles.modalStatsRow}>
              <View style={styles.modalStat}>
                <Text style={[styles.modalStatValue, { color: theme.colors.text }]}>{claimSuccess?.remaining}</Text>
                <Text style={[styles.modalStatLabel, { color: theme.colors.textSecondary }]}>Berries Left</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.modalDoneBtn, { backgroundColor: theme.colors.primary }]}
              onPress={() => setShowClaimModal(false)}
            >
              <Text style={styles.modalDoneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainScroll: { flex: 1 },

  /* ── Balance Strip ── */
  balanceStrip: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  balanceLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  balanceIcon: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  balanceLabel: { fontSize: 12, fontFamily: 'Inter-Regular' },
  balanceValue: { fontSize: 22, fontFamily: 'Poppins-Bold' },
  balanceUnit: { fontSize: 14, fontFamily: 'Inter-Regular' },

  /* ── Chips ── */
  chipRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, paddingTop: 10, paddingBottom: 6 },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipValue: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  chipLabel: { fontSize: 12, fontFamily: 'Inter-Regular', flex: 1 },

  /* ── Search ── */
  searchSection: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6, gap: 8 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter-Regular' },
  sortToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  sortText: { fontSize: 12, fontFamily: 'Inter-SemiBold' },

  /* ── Rewards Grid ── */
  rewardsSection: { paddingHorizontal: 20, paddingTop: 10 },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins-SemiBold', marginBottom: 12 },
  rewardsGrid: { gap: 12 },
  centerContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: 'Inter-Regular' },

  /* ── Reward Card ── */
  rewardCard: { marginBottom: 0, position: 'relative' },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  expiryBadgeText: { fontSize: 11, fontFamily: 'Inter-SemiBold' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  categoryDot: {
    width: 26, height: 26, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center',
  },
  categoryLabel: { fontSize: 12, fontFamily: 'Inter-Medium', textTransform: 'capitalize' },
  rewardName: { fontSize: 16, fontFamily: 'Poppins-SemiBold', marginBottom: 4 },
  rewardDesc: { fontSize: 13, fontFamily: 'Inter-Regular', lineHeight: 18, marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.2)',
    paddingTop: 10,
  },
  costRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  costText: { fontSize: 16, fontFamily: 'Poppins-Bold' },
  claimBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  claimBtnText: { fontSize: 14, fontFamily: 'Inter-SemiBold' },

  /* ── Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: 310,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    position: 'relative',
  },
  modalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  modalIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 22, fontFamily: 'Poppins-Bold', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', marginBottom: 10 },
  modalCodeBox: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  modalCodeText: { fontSize: 20, fontFamily: 'Inter-Bold', letterSpacing: 2 },
  modalStatsRow: { flexDirection: 'row', marginBottom: 18 },
  modalStat: { alignItems: 'center' },
  modalStatValue: { fontSize: 22, fontFamily: 'Poppins-Bold' },
  modalStatLabel: { fontSize: 12, fontFamily: 'Inter-Regular' },
  modalDoneBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalDoneBtnText: { color: '#fff', fontSize: 16, fontFamily: 'Inter-SemiBold' },
});