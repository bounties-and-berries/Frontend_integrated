import React, { useEffect } from 'react';
import { TouchableOpacity, ViewStyle, Text, StyleProp } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  delay?: number; // Added delay prop for staggered animations
  skipEntranceAnimation?: boolean; // Added prop to skip entrance animation
}

export default function AnimatedCard({
  children,
  style,
  onPress,
  disabled = false,
  delay = 0,
  skipEntranceAnimation = false
}: AnimatedCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(skipEntranceAnimation ? 1 : 0.95);
  const opacity = useSharedValue(skipEntranceAnimation ? 1 : 0.3);
  const pressScale = useSharedValue(1);
  const pressOpacity = useSharedValue(1);

  // Entrance animation
  useEffect(() => {
    if (!skipEntranceAnimation) {
      const startAnimation = () => {
        scale.value = withSpring(1, {
          damping: 20,
          stiffness: 300,
          mass: 0.8,
        });
        opacity.value = withTiming(1, {
          duration: 400,
        });
      };

      if (delay > 0) {
        const timer = setTimeout(startAnimation, delay);
        return () => clearTimeout(timer);
      } else {
        startAnimation();
      }
    }
  }, [delay, skipEntranceAnimation, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pressScale.value }],
    opacity: opacity.value * pressOpacity.value,
  }), []);

  const handlePressIn = () => {
    if (!disabled) {
      pressScale.value = withSpring(0.95, {
        damping: 15,
        stiffness: 400,
      });
      pressOpacity.value = withTiming(0.8, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      pressScale.value = withSpring(1, {
        damping: 15,
        stiffness: 400,
      });
      pressOpacity.value = withTiming(1, { duration: 150 });
    }
  };

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  };

  const renderChildren = () => {
    if (typeof children === 'string' || typeof children === 'number') {
      return <Text>{children}</Text>;
    }
    return children;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={disabled}
      >
        <Animated.View style={[cardStyle, style, animatedStyle]}>
          {renderChildren()}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={[cardStyle, style, animatedStyle]}>
      {renderChildren()}
    </Animated.View>
  );
}