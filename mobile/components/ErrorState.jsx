import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { THEME } from '../config/theme';
import Button from './Button';

/**
 * ErrorState component for displaying errors with optional retry
 */
export default function ErrorState({
  title = 'Analysis Failed',
  message,
  onRetry,
  retryLabel = 'Try Again',
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {onRetry && (
        <Button
          title={retryLabel}
          onPress={onRetry}
          variant="danger"
          style={styles.retryButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.dangerBg,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
    padding: THEME.spacing.lg,
    alignItems: 'center',
    marginVertical: THEME.spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.sm,
  },
  icon: {
    fontSize: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.danger,
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: THEME.spacing.base,
  },
  retryButton: {
    minWidth: 140,
    height: 42,
  },
});

