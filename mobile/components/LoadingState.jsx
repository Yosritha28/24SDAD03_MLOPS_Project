import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { THEME } from '../config/theme';

/**
 * LoadingState component for async processes
 */
export default function LoadingState({
  title = 'Analyzing Resume...',
  message = 'Extracting document text and computing compatibility scores.',
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.spinnerWrapper}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    padding: THEME.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: THEME.spacing.lg,
  },
  spinnerWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.base,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
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
    maxWidth: 280,
  },
});

