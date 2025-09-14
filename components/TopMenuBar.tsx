import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
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
  TrendingUp
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

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
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Auto-detect if back button should be shown based on navigation source
  const shouldShowBackButton = showBackButton || params.fromMenu === 'true';
  
  const student = user as Student;
  const faculty = user as Faculty;
  const admin = user as Admin;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const insets = useSafeAreaInsets();

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
      // Slide in from left
      menuTranslateX.value = withTiming(0, slideAnimationConfig);
      overlayOpacity.value = withTiming(0.5, overlayAnimationConfig);
    } else {
      // Slide out to left
      menuTranslateX.value = withTiming(-width, slideAnimationConfig);
      overlayOpacity.value = withTiming(0, {
        ...overlayAnimationConfig,
        // Hide overlay after animation completes
      }, (finished) => {
        if (finished) {
          runOnJS(setShowOverlay)(false);
        }
      });
    }
  }, [isMenuOpen]);

  // Animated styles for menu and overlay
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

  // Simple menu toggle with smooth animations
  const handleMenuPress = () => {
    console.log('Menu button pressed, toggling menu state from:', isMenuOpen, 'to:', !isMenuOpen);
    
    setIsMenuOpen(!isMenuOpen);
    
    // Add haptic feedback
    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
  };

  const closeMenu = () => {
    console.log('Closing menu...');
    setIsMenuOpen(false);
  };

  const handleMenuItemPress = (route: string) => {
    // Add haptic feedback for menu item press
    if (Platform.OS !== 'web') {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    closeMenu();
    // Add fromMenu parameter to indicate navigation from top menu
    const routeWithParams = route.includes('?') 
      ? `${route}&fromMenu=true` 
      : `${route}?fromMenu=true`;
    setTimeout(() => router.push(routeWithParams as any), 250);
  };

  const handleProfilePress = () => {
    // Add haptic feedback
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
    // Add haptic feedback for better UX
    if (Platform.OS !== 'web') {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const routeWithParams = (route: string) => {
      return route.includes('?') ? `${route}&fromMenu=true` : `${route}?fromMenu=true`;
    };
    
    switch (user?.role) {
      case 'student':
        router.push(routeWithParams('/(student)/notifications') as any);
        break;
      case 'faculty':
        router.push(routeWithParams('/(faculty)/notifications') as any);
        break;
      case 'admin':
        router.push(routeWithParams('/(admin)/notifications') as any);
        break;
    }
  };

  const handleBackPress = () => {
    // Add haptic feedback
    if (Platform.OS !== 'web') {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleLogout = () => {
    // Add haptic feedback
    if (Platform.OS !== 'web') {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            closeMenu();
            logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleTerms = () => {
    // Add haptic feedback
    if (Platform.OS !== 'web') {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    closeMenu();
    setTimeout(() => router.push('/terms?fromMenu=true' as any), 250);
  };

  // Role-specific menu items
  const getMenuItems = () => {
    const baseItems = [
      {
        id: 'settings',
        title: 'Settings',
        subtitle: 'Manage your account preferences',
        icon: Settings,
        route: user?.role === 'student' ? '/(student)/settings' : 
               user?.role === 'faculty' ? '/(faculty)/settings' : '/(admin)/settings',
        color: theme.colors.textSecondary,
      },
    ];

    if (user?.role === 'student') {
      return [
        {
          id: 'history',
          title: 'History',
          subtitle: 'Track your berries activity',
          icon: History,
          route: '/(student)/history',
          color: theme.colors.secondary,
        },
        {
          id: 'myrewards',
          title: 'My Rewards',
          subtitle: 'View claimed coupons and rewards',
          icon: FileText,
          route: '/(student)/myrewards',
          color: theme.colors.accent,
        },
        {
          id: 'request-points',
          title: 'Request Berries',
          subtitle: 'Submit external activity for berries',
          icon: FileText,
          route: '/(student)/request-points',
          color: theme.colors.primary,
        },
        ...baseItems,
      ];
    } else if (user?.role === 'faculty') {
      return [
        {
          id: 'student-progress',
          title: 'Student Progress',
          subtitle: 'Monitor student performance and engagement',
          icon: TrendingUp,
          route: '/(faculty)/student-progress',
          color: theme.colors.primary,
        },
        ...baseItems,
      ];
    } else if (user?.role === 'admin') {
      return [
        {
          id: 'rules',
          title: 'Point Rules',
          subtitle: 'Manage berry allocation rules',
          icon: FileText,
          route: '/(admin)/rules',
          color: theme.colors.primary,
        },
        {
          id: 'request-berries',
          title: 'Request Berries',
          subtitle: 'Purchase berries for distribution',
          icon: Coins,
          route: '/(admin)/request-berries',
          color: theme.colors.success,
        },
        ...baseItems,
      ];
    }
    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <>
      <View style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + (Platform.OS === 'ios' ? 10 : 20),
        }
      ]}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <View style={styles.headerRow}>
              {shouldShowBackButton && (
                <TouchableOpacity
                  style={[styles.backButton, { backgroundColor: theme.colors.card }]}
                  onPress={handleBackPress}
                  activeOpacity={0.6}
                  accessible={true}
                  accessibilityLabel="Go back"
                  accessibilityRole="button"
                >
                  {Platform.OS === 'ios' ? (
                    <ChevronLeft size={20} color={theme.colors.text} />
                  ) : (
                    <ArrowLeft size={20} color={theme.colors.text} />
                  )}
                </TouchableOpacity>
              )}
              <Text style={[styles.appName, { color: theme.colors.primary }]}>
                Bounties & Berries
              </Text>
            </View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
          
          <View style={styles.headerActions}>
            {showNotifications && !shouldShowBackButton && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
                onPress={handleNotificationPress}
                activeOpacity={0.6}
                accessible={true}
                accessibilityLabel="Notifications"
                accessibilityRole="button"
              >
                <Bell size={20} color={theme.colors.text} />
              </TouchableOpacity>
            )}
            
            {!shouldShowBackButton && (
              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: theme.colors.card }]}
                onPress={handleMenuPress}
                activeOpacity={0.6}
                accessible={true}
                accessibilityLabel="Menu"
                accessibilityRole="button"
              >
                <Menu size={24} color={theme.colors.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Animated Menu Overlay with smooth slide transitions */}
      {showOverlay && (
        <>
          {/* Animated Backdrop with fade */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 9999,
                pointerEvents: showOverlay ? 'auto' : 'none',
              },
              overlayAnimatedStyle,
            ]}
          >
            <Pressable
              style={{ flex: 1 }}
              onPress={closeMenu}
            />
          </Animated.View>
          
          {/* Animated Menu Container */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                width: Platform.OS === 'web' ? Math.min(400, width * 0.9) : width * 0.85,
                height: height,
                backgroundColor: theme.colors.background,
                zIndex: 10000,
                elevation: 16,
                shadowColor: '#000',
                shadowOffset: { width: 4, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
              },
              menuAnimatedStyle,
            ]}
          >
            {/* Menu Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingTop: insets.top + 20,
                paddingBottom: 20,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              }}
            >
              <Text style={{ fontSize: 24, fontFamily: 'Poppins-Bold', color: theme.colors.text }}>
                Menu
              </Text>
              <TouchableOpacity
                onPress={closeMenu}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: theme.colors.card,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <X size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* User Info Header */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              }}
              onPress={handleProfilePress}
            >
              <Image
                source={{ uri: user?.profileImage }}
                style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontFamily: 'Poppins-SemiBold', color: theme.colors.text }}>
                  {user?.name}
                </Text>
                <Text style={{ fontSize: 14, fontFamily: 'Inter-Regular', color: theme.colors.textSecondary, marginTop: 2 }}>
                  {user?.email}
                </Text>
                {user?.role === 'faculty' && (
                  <Text style={{ fontSize: 14, fontFamily: 'Inter-Regular', color: theme.colors.textSecondary, marginTop: 2 }}>
                    {(user as Faculty)?.department}
                  </Text>
                )}
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {/* Menu Items */}
            <ScrollView style={{ flex: 1, paddingVertical: 8 }}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: 0.5,
                    borderBottomColor: theme.colors.border,
                    minHeight: 64,
                  }}
                  onPress={() => handleMenuItemPress(item.route)}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: item.color + '20',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <item.icon size={20} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Inter-SemiBold', color: theme.colors.text }}>
                      {item.title}
                    </Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: theme.colors.textSecondary, marginTop: 2 }}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <ChevronRight size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ))}
              
              {/* Terms & Conditions */}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  borderBottomWidth: 0.5,
                  borderBottomColor: theme.colors.border,
                  minHeight: 64,
                }}
                onPress={handleTerms}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: theme.colors.primary + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <FileText size={20} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontFamily: 'Inter-SemiBold', color: theme.colors.text }}>
                    Terms & Conditions
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: theme.colors.textSecondary, marginTop: 2 }}>
                    Read our terms and conditions
                  </Text>
                </View>
                <ChevronRight size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              
              {/* Logout */}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  minHeight: 64,
                }}
                onPress={handleLogout}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: theme.colors.error + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <LogOut size={20} color={theme.colors.error} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontFamily: 'Inter-SemiBold', color: theme.colors.error }}>
                    Logout
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: theme.colors.textSecondary, marginTop: 2 }}>
                    Sign out of your account
                  </Text>
                </View>
                <ChevronRight size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  appName: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});