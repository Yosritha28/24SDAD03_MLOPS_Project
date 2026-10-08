import React from 'react';
import { StyleSheet, View } from 'react-native';
import { THEME } from '../config/theme';

/**
 * Reusable Card component for mobile
 * Wraps content in a dark surface with subtle border and elevation.
 */
export default function Card({ children, style, variant = 'surface', ...props }) {
  const backgroundColor =
    variant === 'surface2' ? THEME.colors.surface2 : THEME.colors.surface;

  return (
    <View style={[styles.card, { backgroundColor }, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    padding: THEME.spacing.base,
    marginBottom: THEME.spacing.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
});

