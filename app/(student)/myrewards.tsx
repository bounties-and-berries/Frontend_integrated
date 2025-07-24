import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getClaimedRewards, searchRewards } from '@/utils/api';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Gift, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react-native';

const rewardSections = ['Active', 'Redeemed', 'Expired', 'Expiring Soon'];

// Claimed rewards from backend
export default function MyRewards() {
  const { theme } = useTheme();
  const [selectedSection, setSelectedSection] = useState('Active');
  const [claimedRewards, setClaimedRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const claimedRes = await getClaimedRewards();
      setClaimedRewards(claimedRes || []);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map backend fields to UI and filter by status
  const getFilteredRewards = (): any[] => {
    const now = new Date();
    if (selectedSection === 'Active') {
      // Only show claimed, non-expired rewards
      return Array.isArray(claimedRewards)
        ? claimedRewards.filter((r: any) => !r.expiry_date || new Date(r.expiry_date) > now)
        : [];
    } else if (selectedSection === 'Redeemed') {
      // Only show claimed, non-expired rewards (same as Active)
      return Array.isArray(claimedRewards)
        ? claimedRewards.filter((r: any) => !r.expiry_date || new Date(r.expiry_date) > now)
        : [];
    } else if (selectedSection === 'Expiring Soon') {
      // Only show claimed rewards expiring within 7 days
      return Array.isArray(claimedRewards)
        ? claimedRewards.filter((r: any) => {
            if (!r.expiry_date) return false;
            const expiry = new Date(r.expiry_date);
            const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            return diffDays > 0 && diffDays <= 7;
          })
        : [];
    } else if (selectedSection === 'Expired') {
      // Only show expired claimed rewards
      return Array.isArray(claimedRewards)
        ? claimedRewards.filter((r: any) => r.expiry_date && new Date(r.expiry_date) <= now)
        : [];
    }
    return [];
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'Active':
        return Gift;
      case 'Redeemed':
        return CheckCircle;
      case 'Expired':
        return AlertTriangle;
      case 'Expiring Soon':
        return Clock;
      default:
        return Gift;
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'Active':
        return theme.colors.success;
      case 'Redeemed':
        return theme.colors.primary;
      case 'Expired':
        return theme.colors.error;
      case 'Expiring Soon':
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'claimed':
        return theme.colors.primary;
      case 'expired':
        return theme.colors.error;
      case 'expiring_soon':
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'claimed':
        return 'Used';
      case 'expired':
        return 'Expired';
      case 'expiring_soon':
        return 'Expiring Soon';
      default:
        return 'Unknown';
    }
  };

  const filteredRewards = getFilteredRewards();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="My Rewards"
        subtitle="Manage your claimed coupons and rewards"
      />

      {/* Reward Sections */}
      <View style={styles.sectionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.sectionsList}>
            {rewardSections.map((section) => {
              const IconComponent = getSectionIcon(section);
              const sectionColor = getSectionColor(section);
              const isSelected = selectedSection === section;
              const count = getFilteredRewards().length;
              
              return (
                <TouchableOpacity
                  key={section}
                  style={[
                    styles.sectionButton,
                    {
                      backgroundColor: isSelected 
                        ? sectionColor + '20' 
                        : theme.colors.surface,
                      borderColor: isSelected ? sectionColor : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    }
                  ]}
                  onPress={() => {
                    setSelectedSection(section);
                    fetchData();
                  }}
                >
                  <IconComponent 
                    size={18} 
                    color={isSelected ? sectionColor : theme.colors.textSecondary} 
                  />
                  <Text style={[
                    styles.sectionButtonText,
                    { 
                      color: isSelected ? sectionColor : theme.colors.textSecondary,
                      fontFamily: isSelected ? 'Inter-SemiBold' : 'Inter-Medium',
                    }
                  ]}>
                    {section}
                  </Text>
                  <View style={[
                    styles.sectionBadge,
                    { backgroundColor: isSelected ? sectionColor : theme.colors.textSecondary }
                  ]}>
                    <Text style={styles.sectionBadgeText}>
                      {section === selectedSection ? count : getFilteredRewards().filter(r => {
                        switch (section) {
                          case 'Active': return r.status === 'active';
                          case 'Redeemed': return r.status === 'claimed';
                          case 'Expired': return r.status === 'expired';
                          case 'Expiring Soon': return r.status === 'expiring_soon';
                          default: return false;
                        }
                      }).length}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Rewards List */}
      <ScrollView 
        style={styles.rewardsList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.rewardsContainer}>
          {loading ? (
            <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: 20 }}>Loading...</Text>
          ) : error ? (
            <Text style={{ color: theme.colors.error, textAlign: 'center', marginTop: 20 }}>{error}</Text>
          ) : filteredRewards.length === 0 ? (
            <AnimatedCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Gift size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                  No {selectedSection.toLowerCase()} rewards
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                  Your {selectedSection.toLowerCase()} rewards will appear here.
                </Text>
              </View>
            </AnimatedCard>
          ) : (
            filteredRewards.map((reward: any) => (
              <AnimatedCard key={reward.claim_id || reward.id} style={styles.rewardCard}>
                <View style={styles.rewardContent}>
                  <Image source={{ uri: reward.img_url || '' }} style={styles.rewardImage} />
                  <View style={styles.rewardInfo}>
                    <View style={styles.rewardHeader}>
                      <Text style={[styles.rewardTitle, { color: theme.colors.text }]}>
                        {reward.name}
                      </Text>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(reward.status) + '20' }
                      ]}>
                        <Text style={[
                          styles.statusText,
                          { color: getStatusColor(reward.status) }
                        ]}>
                          {getStatusText(reward.status)}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.rewardDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                      {reward.description}
                    </Text>
                    <View style={styles.rewardDetails}>
                      <View style={styles.rewardDetail}>
                        <Calendar size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.rewardDetailText, { color: theme.colors.textSecondary }]}>
                          Claimed: {reward.claimed_on ? new Date(reward.claimed_on).toLocaleDateString() : ''}
                        </Text>
                      </View>
                      {/* Add expiry date if available */}
                      {/* <View style={styles.rewardDetail}>
                        <Clock size={14} color={theme.colors.textSecondary} />
                        <Text style={[styles.rewardDetailText, { color: theme.colors.textSecondary }]}>
                          Expires: {reward.expiry_date ? new Date(reward.expiry_date).toLocaleDateString() : ''}
                        </Text>
                      </View> */}
                    </View>
                    {reward.status === 'active' && reward.redeemable_code && (
                      <View style={styles.codeContainer}>
                        <Text style={[styles.codeLabel, { color: theme.colors.textSecondary }]}>
                          Coupon Code:
                        </Text>
                        <View style={[styles.codeBox, { backgroundColor: theme.colors.primary + '20' }]}>
                          <Text style={[styles.codeText, { color: theme.colors.primary }]}>
                            {reward.redeemable_code}
                          </Text>
                        </View>
                      </View>
                    )}
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
  sectionsContainer: {
    paddingVertical: 16,
  },
  sectionsList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  sectionButtonText: {
    fontSize: 14,
  },
  sectionBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  rewardsList: {
    flex: 1,
  },
  rewardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  rewardCard: {
    marginBottom: 0,
  },
  rewardContent: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  rewardInfo: {
    flex: 1,
    gap: 8,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rewardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  rewardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  rewardDetails: {
    gap: 4,
  },
  rewardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardDetailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  codeContainer: {
    marginTop: 8,
    gap: 4,
  },
  codeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  codeBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  codeText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1,
  },
});