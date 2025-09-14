import React, { useEffect } from 'react';
import { View, ViewStyle, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

interface PageTransitionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animationType?: 'slideRight' | 'slideLeft' | 'fade' | 'scale';
  duration?: number;
  delay?: number;
  direction?: 'forward' | 'backward';
}

export default function PageTransition({ 
  children, 
  style,
  animationType = 'slideRight',
  duration = 350,
  delay = 0,
  direction = 'forward'
}: PageTransitionProps) {
  // Initialize animation values based on type and direction
  const getInitialTranslateX = () => {
    if (animationType === 'slideRight') return direction === 'forward' ? screenWidth : -screenWidth;
    if (animationType === 'slideLeft') return direction === 'forward' ? -screenWidth : screenWidth;
    return 0;
  };
  
  const translateX = useSharedValue(getInitialTranslateX());
  const opacity = useSharedValue(animationType === 'fade' ? 0 : 1);
  const scale = useSharedValue(animationType === 'scale' ? 0.9 : 1);

  useEffect(() => {
    const startAnimation = () => {
      const timingConfig = {
        duration,
        easing: Easing.out(Easing.cubic), // Smooth ease-out for natural feel
      };
      
      const springConfig = {
        damping: 25,
        stiffness: 120,
        mass: 1,
      };

      switch (animationType) {
        case 'slideRight':
        case 'slideLeft':
          // Smooth slide animation with cubic easing
          translateX.value = withTiming(0, timingConfig);
          if (opacity.value !== 1) {
            opacity.value = withTiming(1, { duration: duration * 0.8 });
          }
          break;
        case 'fade':
          opacity.value = withTiming(1, timingConfig);
          break;
        case 'scale':
          scale.value = withSpring(1, springConfig);
          opacity.value = withTiming(1, { duration: duration * 0.8 });
          break;
      }
    };

    if (delay > 0) {
      const timer = setTimeout(startAnimation, delay);
      return () => clearTimeout(timer);
    } else {
      startAnimation();
    }
  }, [animationType, duration, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  }, []);

  return (
    <Animated.View style={[{ flex: 1 }, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}