import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Trophy, Star, TrendingUp, Users, Award, Target, Zap } from 'lucide-react-native';

export default function LoadingScreen() {
  const { theme } = useTheme();
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);
  const rotation = useSharedValue(0);
  const iconScale = useSharedValue(0.5);
  const iconOpacity = useSharedValue(0);

  React.useEffect(() => {
    // Main logo animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
    
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.7, { duration: 1000 })
      ),
      -1,
      false
    );

    // Rotation animation for dynamic effect
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1,
      false
    );

    // Icon animations with delays
    iconScale.value = withDelay(500, withTiming(1, { duration: 800 }));
    iconOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: iconOpacity.value,
  }));

  const floatingIconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(rotation.value, [0, 360], [0, -20], Extrapolate.CLAMP) },
      { scale: interpolate(iconScale.value, [0.5, 1], [0.8, 1.2], Extrapolate.CLAMP) }
    ],
    opacity: iconOpacity.value,
  }));

  return (
    <LinearGradient
      colors={theme.colors.gradient.primary}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Animated Icons around the logo */}
        <Animated.View style={[styles.floatingIcon, styles.iconTopLeft, floatingIconStyle]}>
          <Trophy size={24} color={theme.colors.card} />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, styles.iconTopRight, floatingIconStyle]}>
          <Star size={24} color={theme.colors.card} />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, styles.iconBottomLeft, floatingIconStyle]}>
          <TrendingUp size={24} color={theme.colors.card} />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, styles.iconBottomRight, floatingIconStyle]}>
          <Award size={24} color={theme.colors.card} />
        </Animated.View>

        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          <View style={styles.logoWrapper}>
            <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
              <Target size={40} color={theme.colors.card} />
            </Animated.View>
            <Text style={[styles.logo, { color: theme.colors.card }]}>
              B & B
            </Text>
          </View>
          <Text style={[styles.tagline, { color: theme.colors.card }]}>
            Because you're more than marks
          </Text>
        </Animated.View>
        
        <Text style={[styles.subtitle, { color: theme.colors.card }]}>
          Loading your journey...
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  logo: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    opacity: 0.9,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
    marginTop: 20,
  },
  floatingIcon: {
    position: 'absolute',
    opacity: 0.7,
  },
  iconTopLeft: {
    top: -60,
    left: -80,
  },
  iconTopRight: {
    top: -60,
    right: -80,
  },
  iconBottomLeft: {
    bottom: -60,
    left: -80,
  },
  iconBottomRight: {
    bottom: -60,
    right: -80,
  },
});