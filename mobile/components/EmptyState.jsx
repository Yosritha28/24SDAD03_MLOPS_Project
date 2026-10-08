import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { THEME } from '../config/theme';
import Button from './Button';

/**
 * EmptyState component when no records or data are available
 */
export default function EmptyState({
  icon = '📭',
  title = 'No Data Available',
  message = 'There are no items to display at this time.',
  actionLabel,
  onAction,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="secondary"
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    padding: THEME.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: THEME.spacing.md,
  },
  icon: {
    fontSize: 40,
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: THEME.spacing.base,
    maxWidth: 280,
  },
  button: {
    minWidth: 160,
  },
});

