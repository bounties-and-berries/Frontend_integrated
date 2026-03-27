import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { COMPONENTS, SPACING, TYPOGRAPHY } from '@/utils/designSystem';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  disabled = false,
  secureTextEntry = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...rest
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const borderColor = useSharedValue(theme.colors.border);

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withTiming(theme.colors.primary, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withTiming(theme.colors.border, { duration: 200 });
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      borderColor: error ? theme.colors.error : borderColor.value,
    };
  });

  const styles = useMemo(() => StyleSheet.create({
    container: {
      marginBottom: SPACING.md,
      ...containerStyle,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: COMPONENTS.input.borderRadius,
      paddingHorizontal: COMPONENTS.input.paddingHorizontal,
      minHeight: COMPONENTS.input.height,
      backgroundColor: disabled ? theme.colors.surface : theme.colors.card,
      opacity: disabled ? 0.6 : 1,
    },
    input: {
      flex: 1,
      ...TYPOGRAPHY.body,
      color: disabled ? theme.colors.textSecondary : theme.colors.text,
    },
    label: {
      ...TYPOGRAPHY.bodySmall,
      color: error ? theme.colors.error : theme.colors.textSecondary,
      marginBottom: SPACING.xs,
      fontWeight: '500',
    },
    error: {
      ...TYPOGRAPHY.caption,
      color: theme.colors.error,
      marginTop: SPACING.xs,
    },
    icon: {
      marginRight: SPACING.sm,
    },
    rightIconContainer: {
      marginLeft: SPACING.sm,
    },
  }), [theme, error, disabled, containerStyle]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const finalRightIcon =
    secureTextEntry ? (
      <TouchableOpacity onPress={togglePasswordVisibility} style={styles.rightIconContainer}>
        <Ionicons
          name={isPasswordVisible ? 'eye-off' : 'eye'}
          size={20}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>
    ) : rightIcon ? (
      <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress} style={styles.rightIconContainer}>
        {rightIcon}
      </TouchableOpacity>
    ) : null;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[styles.inputContainer, animatedContainerStyle]}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          editable={!disabled}
          secureTextEntry={!isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {finalRightIcon}
      </Animated.View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}