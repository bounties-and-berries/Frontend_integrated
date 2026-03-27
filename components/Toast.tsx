import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react-native';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type: ToastType;
  onHide: () => void;
}

export default function Toast({ visible, message, type, onHide }: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-150);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(insets.top + (Platform.OS === 'ios' ? 10 : 20), {
        damping: 15,
        stiffness: 120,
      });
      opacity.value = withTiming(1, { duration: 250 });

      const timer = setTimeout(() => {
        hide();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hide = () => {
    translateY.value = withTiming(-150, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(onHide)();
      }
    });
    opacity.value = withTiming(0, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const getColors = () => {
    switch (type) {
      case 'success':
        return { bg: '#E8F5E9', border: '#A5D6A7', text: '#2E7D32', icon: '#4CAF50' };
      case 'error':
        return { bg: '#FFEBEE', border: '#EF9A9A', text: '#C62828', icon: '#F44336' };
      default:
        return { bg: '#E3F2FD', border: '#90CAF9', text: '#1565C0', icon: '#2196F3' };
    }
  };

  const getIcon = () => {
    const colors = getColors();
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color={colors.icon} />;
      case 'error':
        return <AlertCircle size={20} color={colors.icon} />;
      default:
        return <Info size={20} color={colors.icon} />;
    }
  };

  const colors = getColors();

  return (
    <Animated.View style={[styles.container, animatedStyle, { backgroundColor: colors.bg, borderColor: colors.border }]} pointerEvents={visible ? "auto" : "none"}>
      <View style={styles.content}>
        {getIcon()}
        <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      </View>
      <TouchableOpacity onPress={hide} style={styles.closeButton}>
        <X size={16} color={colors.text} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: Platform.OS === 'web' ? Math.min(400, width * 0.9) : width * 0.9,
    borderWidth: 1,
    borderRadius: 12,
    zIndex: 999999, // Ensure it floats above absolutely everything
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
});
