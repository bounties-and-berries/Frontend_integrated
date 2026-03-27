import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
  Platform,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Student, Faculty, Admin } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Menu,
  X,
  History,
  Settings,
  ChevronRight,
  LogOut,
  FileText,
  Bell,
  Coins,
  ArrowLeft,
  ChevronLeft,
  TrendingUp,
  Sun,
  Moon,
  Search,
  BarChart3
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const defaultAvatar = require('@/assets/images/default-avatar.png');

interface TopMenuBarProps {
  title: string;
  subtitle?: string;
  showNotifications?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function TopMenuBar({
  title,
  subtitle,
  showNotifications = true,
  showBackButton = false,
  onBackPress
}: TopMenuBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Auto-detect if back button should be shown based on navigation source
  const shouldShowBackButton = showBackButton || params.fromMenu === 'true';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const insets = useSafeAreaInsets();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Animation values for menu slide
  const menuTranslateX = useSharedValue(-width);
  const overlayOpacity = useSharedValue(0);

  // Animation configurations
  const slideAnimationConfig = {
    duration: 250,
    easing: Easing.out(Easing.cubic),
  };

  const overlayAnimationConfig = {
    duration: 200,
    easing: Easing.inOut(Easing.ease),
  };

  useEffect(() => {
    if (isMenuOpen) {
      setShowOverlay(true);
      menuTranslateX.value = withTiming(0, slideAnimationConfig);
      overlayOpacity.value = withTiming(0.5, overlayAnimationConfig);
    } else {
      menuTranslateX.value = withTiming(-width, slideAnimationConfig);
      overlayOpacity.value = withTiming(0, {
        ...overlayAnimationConfig,
      }, (finished) => {
        if (finished) {
          runOnJS(setShowOverlay)(false);
        }
      });
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const { globalSearch } = await import('@/utils/api');
          const data = await globalSearch(searchQuery);
          setSearchResults(data.results || []);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const menuAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: menuTranslateX.value }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  const handleMenuPress = () => {
    setIsMenuOpen(!isMenuOpen);
    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {}
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleMenuItemPress = (route: string) => {
    if (Platform.OS !== 'web') {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    closeMenu();
    const routeWithParams = route.includes('?') ? `${route}&fromMenu=true` : `${route}?fromMenu=true`;
    setTimeout(() => router.push(routeWithParams as any), 250);
  };

  const handleProfilePress = () => {
    if (Platform.OS !== 'web') {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    closeMenu();
    setTimeout(() => {
      if (user?.role === 'student') {
        router.push('/(student)/profile?fromMenu=true' as any);
      } else if (user?.role === 'faculty') {
        router.push('/(faculty)/settings?fromMenu=true' as any);
      } else if (user?.role === 'admin') {
        router.push('/(admin)/settings?fromMenu=true' as any);
      }
    }, 250);
  };

  const handleNotificationPress = () => {
    if (Platform.OS !== 'web') {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const routeWithParams = (route: string) => route.includes('?') ? `${route}&fromMenu=true` : `${route}?fromMenu=true`;
    switch (user?.role) {
      case 'student': router.push(routeWithParams('/(student)/notifications') as any); break;
      case 'faculty': router.push(routeWithParams('/(faculty)/notifications') as any); break;
      case 'admin': router.push(routeWithParams('/(admin)/notifications') as any); break;
    }
  };

  const handleBackPress = () => {
    if (Platform.OS !== 'web') {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (onBackPress) onBackPress(); else router.back();
  };

  const handleLogout = () => {
    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {}
    }

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        closeMenu();
        logout();
      }
      return;
    }

    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => { closeMenu(); logout(); } }
    ]);
  };

  const handleTerms = () => {
    if (Platform.OS !== 'web') {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    closeMenu();
    setTimeout(() => router.push('/terms?fromMenu=true' as any), 250);
  };

  const handleSearchResultPress = (link: string) => {
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
    router.push(link as any);
  };

  const getMenuItems = () => {
    const baseItems = [
      {
        id: 'settings',
        title: 'Settings',
        subtitle: 'Manage your account preferences',
        icon: Settings,
        route: user?.role === 'student' ? '/(student)/settings' : user?.role === 'faculty' ? '/(faculty)/settings' : '/(admin)/settings',
        color: theme.colors.textSecondary,
      },
    ];

    if (user?.role === 'student') {
      return [
        { id: 'history', title: 'History', subtitle: 'Track your berries activity', icon: History, route: '/(student)/history', color: theme.colors.secondary },
        { id: 'myrewards', title: 'My Rewards', subtitle: 'View claimed coupons and rewards', icon: FileText, route: '/(student)/myrewards', color: theme.colors.accent },
        { id: 'request-points', title: 'Request Berries', subtitle: 'Submit external activity for berries', icon: FileText, route: '/(student)/request-points', color: theme.colors.primary },
        ...baseItems,
      ];
    } else if (user?.role === 'faculty') {
      return [
        { id: 'student-progress', title: 'Analysis', subtitle: 'Detailed student growth patterns', icon: BarChart3, route: '/(faculty)/(tabs)/analysis', color: theme.colors.primary },
        ...baseItems,
      ];
    } else if (user?.role === 'admin') {
      return [
        { id: 'rules', title: 'Point Rules', subtitle: 'Manage berry allocation rules', icon: FileText, route: '/(admin)/rules', color: theme.colors.primary },
        { id: 'request-berries', title: 'Request Berries', subtitle: 'Purchase berries for distribution', icon: Coins, route: '/(admin)/purchase-berries', color: theme.colors.success },
        ...baseItems,
      ];
    }
    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top + (Platform.OS === 'ios' ? 10 : 20) }]}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <View style={styles.headerRow}>
              {shouldShowBackButton && (
                <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.colors.card }]} onPress={handleBackPress} activeOpacity={0.6}>
                  {Platform.OS === 'ios' ? <ChevronLeft size={20} color={theme.colors.text} /> : <ArrowLeft size={20} color={theme.colors.text} />}
                </TouchableOpacity>
              )}
              <Image source={require('@/assets/images/logo.png')} style={{ width: 140, height: 40 }} resizeMode="contain" />
            </View>
            <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
            {subtitle && <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.card }]} onPress={() => setShowSearchModal(true)} activeOpacity={0.6}>
              <Search size={20} color={theme.colors.text} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.card }]} onPress={toggleTheme} activeOpacity={0.6}>
              {theme.dark ? <Sun size={20} color={theme.colors.text} /> : <Moon size={20} color={theme.colors.text} />}
            </TouchableOpacity>

            {showNotifications && !shouldShowBackButton && (
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.card }]} onPress={handleNotificationPress} activeOpacity={0.6}>
                <Bell size={20} color={theme.colors.text} />
              </TouchableOpacity>
            )}

            {!shouldShowBackButton && (
              <TouchableOpacity style={[styles.menuButton, { backgroundColor: theme.colors.card }]} onPress={handleMenuPress} activeOpacity={0.6}>
                <Menu size={24} color={theme.colors.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {showOverlay && (
        <>
          <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 9999 }, overlayAnimatedStyle]}>
            <Pressable style={{ flex: 1 }} onPress={closeMenu} />
          </Animated.View>

          <Animated.View style={[{ position: 'absolute', top: 0, left: 0, width: Platform.OS === 'web' ? Math.min(400, width * 0.9) : width * 0.85, height: height, backgroundColor: theme.colors.background, zIndex: 10000, elevation: 16, shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.3, shadowRadius: 12 }, menuAnimatedStyle]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: insets.top + 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
              <Text style={{ fontSize: 24, fontFamily: 'Poppins-Bold', color: theme.colors.text }}>Menu</Text>
              <TouchableOpacity onPress={closeMenu} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.card, justifyContent: 'center', alignItems: 'center' }}>
                <X size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: theme.colors.border }} onPress={handleProfilePress}>
              <Image source={user?.profileImage ? { uri: user.profileImage } : defaultAvatar} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontFamily: 'Poppins-SemiBold', color: theme.colors.text }}>{user?.name}</Text>
                <Text style={{ fontSize: 14, fontFamily: 'Inter-Regular', color: theme.colors.textSecondary, marginTop: 2 }}>{user?.email}</Text>
                {user?.role === 'faculty' && <Text style={{ fontSize: 14, fontFamily: 'Inter-Regular', color: theme.colors.textSecondary, marginTop: 2 }}>{(user as Faculty)?.department}</Text>}
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <ScrollView style={{ flex: 1, paddingVertical: 8 }}>
              {menuItems.map((item) => (
                <TouchableOpacity key={item.id} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: theme.colors.border, minHeight: 64 }} onPress={() => handleMenuItemPress(item.route)}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: item.color + '20', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}><item.icon size={20} color={item.color} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Inter-SemiBold', color: theme.colors.text }}>{item.title}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: theme.colors.textSecondary, marginTop: 2 }}>{item.subtitle}</Text>
                  </View>
                  <ChevronRight size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ))}

              {user?.role === 'faculty' && (
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: theme.colors.border, minHeight: 64 }} onPress={handleTerms}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}><FileText size={20} color={theme.colors.primary} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Inter-SemiBold', color: theme.colors.text }}>Terms & Conditions</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: theme.colors.textSecondary, marginTop: 2 }}>Read our terms and conditions</Text>
                  </View>
                  <ChevronRight size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              )}

              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, minHeight: 64 }} onPress={handleLogout}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.error + '20', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}><LogOut size={20} color={theme.colors.error} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontFamily: 'Inter-SemiBold', color: theme.colors.error }}>Logout</Text>
                  <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: theme.colors.textSecondary, marginTop: 2 }}>Sign out of your account</Text>
                </View>
                <ChevronRight size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </>
      )}

      <Modal visible={showSearchModal} animationType="fade" transparent={true} onRequestClose={() => setShowSearchModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-start', paddingTop: insets.top + (Platform.OS === 'web' ? 20 : 60) }}>
          <View style={{ backgroundColor: theme.colors.background, marginHorizontal: 20, borderRadius: 12, maxHeight: height * 0.7, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
              <Search size={20} color={theme.colors.textSecondary} style={{ marginRight: 10 }} />
              <TextInput style={{ flex: 1, height: 40, color: theme.colors.text, fontSize: 16, fontFamily: 'Inter-Regular' }} placeholder="Search events, rewards..." placeholderTextColor={theme.colors.textSecondary} autoFocus value={searchQuery} onChangeText={setSearchQuery} />
              <TouchableOpacity onPress={() => setShowSearchModal(false)}><X size={20} color={theme.colors.textSecondary} /></TouchableOpacity>
            </View>
            <ScrollView style={{ padding: 10 }}>
              {isSearching ? <ActivityIndicator style={{ margin: 20 }} color={theme.colors.primary} /> : searchQuery.length > 0 && searchQuery.length < 2 ? <Text style={{ textAlign: 'center', padding: 20, color: theme.colors.textSecondary }}>Type at least 2 characters</Text> : searchResults.length === 0 && searchQuery.length >= 2 ? <Text style={{ textAlign: 'center', padding: 20, color: theme.colors.textSecondary }}>No results found</Text> : searchResults.map((result, idx) => (
                <TouchableOpacity key={idx} style={{ padding: 15, borderBottomWidth: idx === searchResults.length - 1 ? 0 : 0.5, borderBottomColor: theme.colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => handleSearchResultPress(result.link)}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.colors.text, fontSize: 16, fontFamily: 'Inter-SemiBold' }}>{result.name || result.title}</Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 12, textTransform: 'capitalize' }}>{result.category} • {result.description?.substring(0, 50)}...</Text>
                  </View>
                  <ChevronRight size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 20, 
    paddingBottom: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  content: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleSection: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontFamily: 'Poppins-SemiBold', marginBottom: 2 },
  subtitle: { fontSize: 13, fontFamily: 'Inter-Regular' },
  headerActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  menuButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
});