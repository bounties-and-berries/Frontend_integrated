import { Image } from 'expo-image';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
  Platform
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { searchEvents, registerForEvent } from '@/utils/api';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  CheckCircle,
  Trophy,
  ChevronRight,
  Zap,
  Award,
  BookOpen,
} from 'lucide-react-native';
import { Bounty } from '@/types';

const SECTIONS = [
  { key: 'Upcoming', label: 'Available', icon: Zap, color: '#6C63FF' },
  { key: 'Registered', label: 'Registered', icon: CheckCircle, color: '#10B981' },
  { key: 'Completed', label: 'Completed', icon: Trophy, color: '#F59E0B' },
];

export default function StudentEvents() {
  const { theme } = useTheme();
  const { refreshUserBerries } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('Upcoming');
  const [sectionEvents, setSectionEvents] = useState<{ [key: string]: Bounty[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [upRes, regRes, compRes] = await Promise.all([
        searchEvents({ filters: { status: 'upcoming', name: searchQuery || undefined }, sortBy: 'scheduled_date', sortOrder: 'asc', pageNumber: 1, pageSize: 50 }),
        searchEvents({ filters: { status: 'registered', name: searchQuery || undefined }, sortBy: 'scheduled_date', sortOrder: 'asc', pageNumber: 1, pageSize: 50 }),
        searchEvents({ filters: { status: 'completed', name: searchQuery || undefined }, sortBy: 'scheduled_date', sortOrder: 'desc', pageNumber: 1, pageSize: 50 }),
      ]);
      setSectionEvents({
        Upcoming: upRes.results || [],
        Registered: regRes.results || [],
        Completed: compRes.results || [],
      });
    } catch (e: any) {
      setError(e.message || 'Failed to fetch bounties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [searchQuery]);

  const handleRegister = async (eventId: string) => {
    setRegisteringId(eventId);
    try {
      await registerForEvent(eventId);
      setSuccessId(eventId);
      setTimeout(() => {
        setSuccessId(null);
        setRegisteringId(null);
        refreshUserBerries();
        fetchAll();
      }, 1800);
    } catch (e: any) {
      setRegisteringId(null);
      if (Platform.OS === 'web') window.alert(e.message || 'Registration failed');
    }
  };

  const currentSection = SECTIONS.find(s => s.key === selectedSection)!;
  const events = sectionEvents[selectedSection] || [];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const getDaysUntil = (d: string) => {
    const diff = new Date(d).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const renderUrgencyBadge = (event: Bounty) => {
    if (!event.scheduled_date) return null;
    const days = getDaysUntil(event.scheduled_date);
    if (days <= 0) return null;
    if (days <= 3) return (
      <View style={[styles.urgencyBadge, { backgroundColor: '#EF444420' }]}>
        <Clock size={10} color="#EF4444" />
        <Text style={[styles.urgencyText, { color: '#EF4444' }]}>{days}d left</Text>
      </View>
    );
    if (days <= 7) return (
      <View style={[styles.urgencyBadge, { backgroundColor: '#F59E0B20' }]}>
        <Clock size={10} color="#F59E0B" />
        <Text style={[styles.urgencyText, { color: '#F59E0B' }]}>{days}d left</Text>
      </View>
    );
    return null;
  };

  const renderCard = (event: Bounty) => {
    const isRegistering = registeringId === event.id;
    const isSuccess = successId === event.id;
    const isRegistered = event.is_registered;

    return (
      <AnimatedCard key={event.id} style={styles.card}>
        {/* Top row: title + urgency */}
        <View style={styles.cardTopRow}>
          <View style={[styles.typeIcon, { backgroundColor: currentSection.color + '18' }]}>
            <BookOpen size={16} color={currentSection.color} />
          </View>
          <View style={styles.cardTitleBlock}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={1}>
              {event.name}
            </Text>
            {event.type ? (
              <Text style={[styles.cardType, { color: theme.colors.textSecondary }]}>
                {event.type}
              </Text>
            ) : null}
          </View>
          {selectedSection === 'Upcoming' && renderUrgencyBadge(event)}
        </View>

        {/* Description */}
        {event.description ? (
          <Text style={[styles.cardDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
            {event.description}
          </Text>
        ) : null}

        {/* Meta pills */}
        <View style={styles.metaRow}>
          {event.scheduled_date ? (
            <View style={[styles.metaPill, { backgroundColor: theme.colors.primary + '12' }]}>
              <Calendar size={12} color={theme.colors.primary} />
              <Text style={[styles.metaText, { color: theme.colors.primary }]}>
                {formatDate(event.scheduled_date)}
              </Text>
            </View>
          ) : null}
          {event.scheduled_date ? (
            <View style={[styles.metaPill, { backgroundColor: theme.colors.secondary + '12' }]}>
              <Clock size={12} color={theme.colors.secondary} />
              <Text style={[styles.metaText, { color: theme.colors.secondary }]}>
                {formatTime(event.scheduled_date)}
              </Text>
            </View>
          ) : null}
          {event.venue ? (
            <View style={[styles.metaPill, { backgroundColor: '#10B98112' }]}>
              <MapPin size={12} color="#10B981" />
              <Text style={[styles.metaText, { color: '#10B981' }]} numberOfLines={1}>
                {event.venue}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Divider + footer */}
        <View style={[styles.cardFooter, { borderTopColor: theme.colors.border }]}>
          {/* Rewards */}
          <View style={styles.rewardsRow}>
            <View style={styles.rewardChip}>
              <Star size={13} color="#F59E0B" />
              <Text style={[styles.rewardVal, { color: theme.colors.text }]}>
                {event.alloted_points || 0}
              </Text>
              <Text style={[styles.rewardLbl, { color: theme.colors.textSecondary }]}>pts</Text>
            </View>
            <View style={styles.rewardChip}>
              <Award size={13} color="#6C63FF" />
              <Text style={[styles.rewardVal, { color: theme.colors.text }]}>
                {event.alloted_berries || 0}
              </Text>
              <Text style={[styles.rewardLbl, { color: theme.colors.textSecondary }]}>berries</Text>
            </View>
            {(event.capacity ?? 0) > 0 ? (
              <View style={styles.rewardChip}>
                <Users size={13} color="#10B981" />
                <Text style={[styles.rewardVal, { color: theme.colors.text }]}>
                  {event.current_participants || 0}/{event.capacity}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Action button / status */}
          {selectedSection === 'Upcoming' && (
            isSuccess ? (
              <View style={[styles.actionBtn, { backgroundColor: '#10B981' }]}>
                <CheckCircle size={15} color="#fff" />
                <Text style={styles.actionBtnText}>Done!</Text>
              </View>
            ) : isRegistered ? (
              <View style={[styles.actionBtn, { backgroundColor: '#10B98120' }]}>
                <CheckCircle size={15} color="#10B981" />
                <Text style={[styles.actionBtnText, { color: '#10B981' }]}>Registered</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: theme.colors.primary, opacity: isRegistering ? 0.7 : 1 }]}
                onPress={() => handleRegister(event.id)}
                disabled={isRegistering}
                activeOpacity={0.8}
              >
                {isRegistering
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <>
                      <Text style={styles.actionBtnText}>Register</Text>
                      <ChevronRight size={14} color="#fff" />
                    </>
                }
              </TouchableOpacity>
            )
          )}

          {selectedSection === 'Registered' && (
            <View style={[styles.actionBtn, { backgroundColor: '#6C63FF20' }]}>
              <CheckCircle size={15} color="#6C63FF" />
              <Text style={[styles.actionBtnText, { color: '#6C63FF' }]}>Attending</Text>
            </View>
          )}

          {selectedSection === 'Completed' && (
            <View style={[styles.actionBtn, { backgroundColor: '#F59E0B20' }]}>
              <Trophy size={15} color="#F59E0B" />
              <Text style={[styles.actionBtnText, { color: '#F59E0B' }]}>Completed</Text>
            </View>
          )}
        </View>
      </AnimatedCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar title="Bounties" subtitle="Earn points & berries by participating" />

      {/* ── Search ── */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Search size={17} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search bounties..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* ── Section Tabs ── */}
      <View style={styles.tabRow}>
        {SECTIONS.map(s => {
          const active = selectedSection === s.key;
          const count = sectionEvents[s.key]?.length || 0;
          const Icon = s.icon;
          return (
            <TouchableOpacity
              key={s.key}
              style={[
                styles.tab,
                {
                  borderBottomColor: active ? s.color : 'transparent',
                  backgroundColor: active ? s.color + '10' : 'transparent',
                },
              ]}
              onPress={() => setSelectedSection(s.key)}
              activeOpacity={0.7}
            >
              <Icon size={15} color={active ? s.color : theme.colors.textSecondary} />
              <Text style={[styles.tabLabel, { color: active ? s.color : theme.colors.textSecondary, fontFamily: active ? 'Inter-SemiBold' : 'Inter-Regular' }]}>
                {s.label}
              </Text>
              {count > 0 && (
                <View style={[styles.tabBadge, { backgroundColor: active ? s.color : theme.colors.border }]}>
                  <Text style={[styles.tabBadgeText, { color: active ? '#fff' : theme.colors.textSecondary }]}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── List ── */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={currentSection.color} />
          <Text style={[styles.centerText, { color: theme.colors.textSecondary }]}>Loading bounties...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={{ color: theme.colors.error, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity onPress={fetchAll} style={{ marginTop: 12 }}>
            <Text style={{ color: theme.colors.primary }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.centerBox}>
          <View style={[styles.emptyIcon, { backgroundColor: currentSection.color + '15' }]}>
            {React.createElement(currentSection.icon, { size: 32, color: currentSection.color })}
          </View>
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            {selectedSection === 'Upcoming' ? 'No bounties right now' :
             selectedSection === 'Registered' ? "You haven't registered yet" :
             'No completed bounties yet'}
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            {selectedSection === 'Upcoming' ? 'Check back soon for new opportunities!' :
             selectedSection === 'Registered' ? 'Register for upcoming bounties to see them here.' :
             'Complete bounties to earn points and berries.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.listHeader, { color: theme.colors.textSecondary }]}>
            {events.length} {selectedSection === 'Upcoming' ? 'available' : selectedSection === 'Registered' ? 'registered' : 'completed'} bounti{events.length !== 1 ? 'es' : 'y'}
          </Text>
          {events.map(renderCard)}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Search */
  searchRow: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1, gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter-Regular' },

  /* Tabs */
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 4, marginBottom: 2 },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 10, borderRadius: 10, borderBottomWidth: 2,
  },
  tabLabel: { fontSize: 13 },
  tabBadge: {
    paddingHorizontal: 5, paddingVertical: 1,
    borderRadius: 8, minWidth: 18, alignItems: 'center',
  },
  tabBadgeText: { fontSize: 10, fontFamily: 'Inter-Bold' },

  /* List */
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingTop: 10, gap: 12 },
  listHeader: {
    fontSize: 12, fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 2,
  },

  /* Card */
  card: { marginBottom: 0 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  typeIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  cardTitleBlock: { flex: 1 },
  cardTitle: { fontSize: 16, fontFamily: 'Poppins-SemiBold', lineHeight: 22 },
  cardType: { fontSize: 11, fontFamily: 'Inter-Regular', textTransform: 'capitalize' },

  urgencyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8,
  },
  urgencyText: { fontSize: 10, fontFamily: 'Inter-SemiBold' },

  cardDesc: { fontSize: 13, fontFamily: 'Inter-Regular', lineHeight: 19, marginBottom: 10 },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  metaText: { fontSize: 11, fontFamily: 'Inter-Medium' },

  /* Footer */
  cardFooter: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth,
  },
  rewardsRow: { flexDirection: 'row', gap: 12 },
  rewardChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rewardVal: { fontSize: 14, fontFamily: 'Poppins-SemiBold' },
  rewardLbl: { fontSize: 10, fontFamily: 'Inter-Regular' },

  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
  },
  actionBtnText: { color: '#fff', fontSize: 13, fontFamily: 'Inter-SemiBold' },

  /* Empty / Loading */
  centerBox: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, gap: 12,
  },
  centerText: { fontSize: 14, fontFamily: 'Inter-Regular' },
  emptyIcon: {
    width: 68, height: 68, borderRadius: 34,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  emptyTitle: { fontSize: 18, fontFamily: 'Poppins-SemiBold', textAlign: 'center' },
  emptySubtitle: { fontSize: 13, fontFamily: 'Inter-Regular', textAlign: 'center', lineHeight: 20 },
});