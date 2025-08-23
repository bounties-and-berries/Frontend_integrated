import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Student, Faculty, Admin } from '@/types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { 
  Menu, 
  X, 
  History, 
  Settings,
  ChevronRight,
  LogOut,
  Bell,
  Sun,
  Moon,
  Coins,
  Home,
  ArrowLeft,
  Rss,
  FileText
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
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const student = user as Student;
  const faculty = user as Faculty;
  const admin = user as Admin;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(-width);
  const opacity = useSharedValue(0);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleMenuPress = () => {
    scale.value = withSpring(0.95, { duration: 100 }, () => {
      scale.value = withSpring(1);
    });
    
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      opacity.value = withTiming(1, { duration: 300 });
      translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
    } else {
      closeMenu();
    }
  };

  const closeMenu = () => {
    opacity.value = withTiming(0, { duration: 200 });
    translateX.value = withTiming(-width, { duration: 200 });
    setTimeout(() => setIsMenuOpen(false), 200);
  };

  const handleMenuItemPress = (route: string) => {
    closeMenu();
    setTimeout(() => router.push(route as any), 250);
  };

  const handleProfilePress = () => {
    closeMenu();
    setTimeout(() => {
      if (user?.role === 'student') {
        router.push('/(student)/profile' as any);
      } else if (user?.role === 'faculty') {
        router.push('/(faculty)/settings' as any);
      } else if (user?.role === 'admin') {
        router.push('/(admin)/settings' as any);
      }
    }, 250);
  };

  const handleNotificationPress = () => {
    switch (user?.role) {
      case 'student':
        router.push('/(student)/notifications' as any);
        break;
      case 'faculty':
        router.push('/(faculty)/notifications' as any);
        break;
      case 'admin':
        router.push('/(admin)/notifications' as any);
        break;
    }
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleLogout = () => {
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
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <View style={styles.headerRow}>
              {showBackButton && (
                <TouchableOpacity
                  style={[styles.backButton, { backgroundColor: theme.colors.card }]}
                  onPress={handleBackPress}
                  activeOpacity={0.7}
                >
                  <ArrowLeft size={20} color={theme.colors.text} />
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
            {/* Theme Toggle Button */}
            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
                onPress={toggleTheme}
                activeOpacity={0.7}
              >
                {isDark ? (
                  <Sun size={20} color={theme.colors.primary} />
                ) : (
                  <Moon size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            </Animated.View>

            {showNotifications && (
              <Animated.View style={animatedButtonStyle}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
                  onPress={handleNotificationPress}
                  activeOpacity={0.7}
                >
                  <Bell size={20} color={theme.colors.text} />
                </TouchableOpacity>
              </Animated.View>
            )}
            
            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: theme.colors.card }]}
                onPress={handleMenuPress}
                activeOpacity={0.7}
              >
                <Menu size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>

      <Modal
        visible={isMenuOpen}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalContainer}>
          <Animated.View 
            style={[styles.backdrop, animatedBackdropStyle]}
          >
            <Pressable 
              style={styles.backdropPressable}
              onPress={closeMenu}
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.menuContainer, 
              { backgroundColor: theme.colors.background },
              animatedModalStyle
            ]}
          >
            {/* Menu Header with Close Button */}
            <View style={[styles.menuHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
                Menu
              </Text>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: theme.colors.card }]}
                onPress={closeMenu}
                activeOpacity={0.7}
              >
                <X size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* User Info Header - Clickable */}
            <TouchableOpacity 
              style={[styles.userHeader, { borderBottomColor: theme.colors.border }]}
              onPress={handleProfilePress}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: user?.profileImage }}
                style={styles.userImage}
              />
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.colors.text }]}>
                  {user?.name}
                </Text>
                <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
                  {user?.email}
                </Text>
                {user?.role === 'student' && (
                  <Text style={[styles.userPoints, { color: theme.colors.primary }]}>
                    {student?.totalPoints} berries
                  </Text>
                )}
                {user?.role === 'faculty' && (
                  <Text style={[styles.userDepartment, { color: theme.colors.textSecondary }]}>
                    {faculty?.department}
                  </Text>
                )}
                {user?.role === 'admin' && (
                  <Text style={[styles.userCollege, { color: theme.colors.textSecondary }]}>
                    {admin?.collegeName}
                  </Text>
                )}
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {/* Menu Items */}
            <View style={styles.menuItems}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
                  onPress={() => handleMenuItemPress(item.route)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <item.icon size={20} color={item.color} />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={[styles.menuItemTitle, { color: theme.colors.text }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.menuItemSubtitle, { color: theme.colors.textSecondary }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <ChevronRight size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ))}
              

              

              
              {/* Logout */}
              <TouchableOpacity
                style={[styles.menuItem, { borderBottomWidth: 0 }]}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, { backgroundColor: theme.colors.error + '20' }]}>
                  <LogOut size={20} color={theme.colors.error} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: theme.colors.error }]}>
                    Logout
                  </Text>
                  <Text style={[styles.menuItemSubtitle, { color: theme.colors.textSecondary }]}>
                    Sign out of your account
                  </Text>
                </View>
                <ChevronRight size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
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
    width: 36,
    height: 36,
    borderRadius: 18,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropPressable: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  menuTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  userPoints: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginTop: 4,
  },
  userDepartment: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  userCollege: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  menuItems: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  menuItemSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
});