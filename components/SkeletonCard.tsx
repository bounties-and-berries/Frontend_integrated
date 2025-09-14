import React, { useEffect } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

interface SkeletonCardProps {
  style?: ViewStyle;
  height?: number;
  width?: number | `${number}%` | 'auto';
  lines?: number;
  showAvatar?: boolean;
}

export default function SkeletonCard({ 
  style, 
  height = 120, 
  width = '100%',
  lines = 3,
  showAvatar = false
}: SkeletonCardProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const baseSkeletonStyle: ViewStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    height,
  };

  const combinedStyle = StyleSheet.flatten([
    baseSkeletonStyle,
    width !== undefined && { width },
    style,
  ]);

  const lineStyle = {
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginBottom: 8,
  };

  return (
    <Animated.View style={[combinedStyle, animatedStyle]}>
      <View style={StyleSheet.flatten([{ flexDirection: 'row' }, { marginHorizontal: -6 }])}
        onLayout={() => {}}>
        <View style={{ width: 6 }} />
        {showAvatar && (
          <>
            <View style={StyleSheet.flatten([
              lineStyle,
              {
                width: 40,
                height: 40,
                borderRadius: 20,
                marginBottom: 0,
              }
            ])} />
            <View style={{ width: 12 }} />
          </>
        )}
        <View style={{ flex: 1 }}>
          {Array.from({ length: lines }).map((_, index) => (
            <View
              key={index}
              style={StyleSheet.flatten([
                lineStyle,
                {
                  height: 12,
                  width: index === lines - 1 ? '60%' : '100%',
                  marginBottom: index === lines - 1 ? 0 : 8,
                }
              ])}
            />
          ))}
        </View>
        <View style={{ width: 6 }} />
      </View>
    </Animated.View>
  );
}