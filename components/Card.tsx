import React, { useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { BORDER_RADIUS, SHADOWS, SPACING } from '@/utils/designSystem';

// --- Sub-components ---

const CardContent = ({ children, style }: { children: React.ReactNode, style?: ViewStyle }) => (
  <View style={[styles.content, style]}>{children}</View>
);

const CardHeader = ({ children, style }: { children: React.ReactNode, style?: ViewStyle }) => (
  <View style={[styles.header, style]}>{children}</View>
);

const CardFooter = ({ children, style }: { children: React.ReactNode, style?: ViewStyle }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

const CardDivider = () => {
  const { theme } = useTheme();
  return <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />;
};

// --- Main Component ---

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  disabled?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

function CardRoot({  children,  style,  onPress,  variant = 'default',  disabled = false,  padding = 'md',}: CardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (onPress && !disabled) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (onPress && !disabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const paddingValue = useMemo(() => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return SPACING.sm;
      case 'md': return SPACING.md;
      case 'lg': return SPACING.lg;
      default: return SPACING.md;
    }
  }, [padding]);

  const cardStyle = useMemo(() => {
    const base: ViewStyle = {
      borderRadius: BORDER_RADIUS.lg,
      overflow: 'hidden',
      padding: paddingValue,
    };

    const variants: Record<typeof variant, ViewStyle> = {
      default: {
        backgroundColor: theme.colors.card,
        ...SHADOWS.sm,
      },
      elevated: {
        backgroundColor: theme.colors.card,
        ...SHADOWS.md,
      },
      outlined: {
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      filled: {
        backgroundColor: theme.colors.surface,
      },
    };

    return [base, variants[variant], style];
  }, [variant, theme, paddingValue, style]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const Component = onPress && !disabled ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={disabled}
    >
      <Animated.View style={[cardStyle, animatedStyle]}>
        {children}
      </Animated.View>
    </Component>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
  },
  header: {
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
});

export const Card = Object.assign(CardRoot, {
  Content: CardContent,
  Header: CardHeader,
  Footer: CardFooter,
  Divider: CardDivider,
});