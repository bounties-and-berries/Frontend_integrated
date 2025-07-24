import React from 'react';
import { TouchableOpacity, ViewStyle, Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
}

export default function AnimatedCard({ 
  children, 
  style, 
  onPress, 
  disabled = false 
}: AnimatedCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95);
      opacity.value = withTiming(0.8, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1);
      opacity.value = withTiming(1, { duration: 150 });
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