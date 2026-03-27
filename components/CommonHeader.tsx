import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, Menu } from 'lucide-react-native';
import { SPACING, TYPOGRAPHY, SHADOWS } from '@/utils/designSystem';

interface CommonHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  leftAction?: 'menu' | 'back' | React.ReactNode;
  rightAction?: 'notifications' | React.ReactNode;
  onLeftActionPress?: () => void;
  onRightActionPress?: () => void;
}

export default function CommonHeader({
  title,
  subtitle,
  leftAction,
  rightAction,
  onLeftActionPress,
  onRightActionPress,
}: CommonHeaderProps) {
  const { theme } = useTheme();
  const router = useRouter();

  const handleLeftAction = () => {
    if (onLeftActionPress) {
      onLeftActionPress();
    } else if (leftAction === 'back') {
      router.back();
    }
  };

  const renderLeftAction = () => {
    if (leftAction === 'menu' || leftAction === 'back') {
      const Icon = leftAction === 'menu' ? Menu : ChevronLeft;
      return (
        <TouchableOpacity onPress={handleLeftAction} style={styles.actionButton}>
          <Icon size={24} color={theme.colors.text} />
        </TouchableOpacity>
      );
    }
    return leftAction ? <View>{leftAction}</View> : <View style={styles.actionButton} />;
  };

  const renderRightAction = () => {
    if (rightAction === 'notifications') {
      return (
        <TouchableOpacity onPress={onRightActionPress} style={styles.actionButton}>
          <Bell size={22} color={theme.colors.text} />
        </TouchableOpacity>
      );
    }
    return rightAction ? <View>{rightAction}</View> : <View style={styles.actionButton} />;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { borderBottomColor: theme.colors.border }]}>
        {renderLeftAction()}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        {renderRightAction()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    ...SHADOWS.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    height: 60,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h3,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    marginTop: 2,
  },
  actionButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
