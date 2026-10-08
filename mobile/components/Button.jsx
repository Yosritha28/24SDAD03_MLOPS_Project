import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { THEME } from '../config/theme';

/**
 * Reusable Button component for mobile
 * Supports variants: primary, secondary, outline, ghost, danger
 */
export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) {
  const isInteractive = !loading && !disabled;

  let btnBg = THEME.colors.primary;
  let borderColor = 'transparent';
  let textColor = THEME.colors.textPrimary;

  if (variant === 'secondary') {
    btnBg = THEME.colors.surface2;
    borderColor = THEME.colors.surfaceBorder;
    textColor = THEME.colors.textPrimary;
  } else if (variant === 'outline') {
    btnBg = 'transparent';
    borderColor = THEME.colors.surfaceBorder;
    textColor = THEME.colors.textPrimary;
  } else if (variant === 'ghost') {
    btnBg = 'transparent';
    borderColor = 'transparent';
    textColor = THEME.colors.textSecondary;
  } else if (variant === 'danger') {
    btnBg = THEME.colors.dangerBg;
    borderColor = THEME.colors.danger;
    textColor = THEME.colors.danger;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={isInteractive ? onPress : undefined}
      style={[
        styles.button,
        {
          backgroundColor: btnBg,
          borderColor: borderColor,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: textColor }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.sm,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

