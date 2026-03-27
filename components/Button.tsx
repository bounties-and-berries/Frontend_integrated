import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { COMPONENTS, SPACING, TYPOGRAPHY } from '@/utils/designSystem';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  containerStyle,
  textStyle: customTextStyle,
}: ButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    ...(fullWidth && { width: '100%' }),
    ...containerStyle,
  }));

  const baseButtonStyle: ViewStyle = {
    height: COMPONENTS.button.height[size],
    borderRadius: COMPONENTS.button.borderRadius,
    paddingHorizontal: COMPONENTS.button.paddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  };

  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: 'transparent',
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    danger: {
      backgroundColor: 'transparent',
    },
  };

  const baseTextStyle: TextStyle = {
    ...TYPOGRAPHY.button,
    textAlign: 'center',
  };

  const variantTextStyles: Record<string, TextStyle> = {
    primary: {
      color: '#FFFFFF',
    },
    secondary: {
      color: theme.colors.text,
    },
    outline: {
      color: theme.colors.primary,
    },
    ghost: {
      color: theme.colors.primary,
    },
    danger: {
      color: '#FFFFFF',
    },
  };

  const getGradientColors = () => {
    if (variant === 'primary') return theme.colors.gradient.primary;
    if (variant === 'danger') return [theme.colors.error, theme.colors.error];
    return undefined;
  };

  const gradientColors = getGradientColors();
  const finalButtonStyle = [baseButtonStyle, variantStyles[variant]];
  const finalTextStyle = [baseTextStyle, variantTextStyles[variant], customTextStyle];
  const textColor = (finalTextStyle.find(s => s && s.color) as TextStyle)?.color || theme.colors.primary;

  const renderContent = () => (
    <>
      {loading && <ActivityIndicator size="small" color={textColor} style={{ marginRight: SPACING.sm }} />}
      {typeof children === 'string' ? <Text style={finalTextStyle}>{children}</Text> : children}
    </>
  );

  const Container = gradientColors ? LinearGradient : (View as any);
  const containerProps = gradientColors
    ? {
        colors: gradientColors,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 },
      }
    : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={disabled || loading}
      style={animatedStyle}
    >
      <Container {...containerProps} style={finalButtonStyle}>
        {renderContent()}
      </Container>
    </TouchableOpacity>
  );
}