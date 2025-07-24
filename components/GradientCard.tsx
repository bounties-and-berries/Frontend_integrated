import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface GradientCardProps {
  children: React.ReactNode;
  gradientColors?: string[];
  style?: ViewStyle;
  innerStyle?: ViewStyle;
}

export default function GradientCard({ 
  children, 
  gradientColors, 
  style, 
  innerStyle 
}: GradientCardProps) {
  const { theme } = useTheme();
  const colors = gradientColors || theme.colors.gradient.primary;

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={colors}
        style={[styles.gradient, innerStyle]}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    borderRadius: 16,
    padding: 20,
  },
});