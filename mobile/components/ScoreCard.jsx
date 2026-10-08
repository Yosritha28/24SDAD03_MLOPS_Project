import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { THEME } from '../config/theme';

/**
 * ScoreCard component to prominently present scores (Overall, Skill, Keyword, Experience)
 */
export default function ScoreCard({
  score,
  label,
  subtitle,
  variant = 'large', // 'large' | 'compact'
  color,
}) {
  const numericScore = typeof score === 'number' ? score : parseInt(score, 10) || 0;

  // Adaptive color based on score thresholds if no explicit color provided
  let scoreColor = color;
  if (!scoreColor) {
    if (numericScore >= 80) scoreColor = THEME.colors.success;
    else if (numericScore >= 60) scoreColor = THEME.colors.warning;
    else scoreColor = THEME.colors.danger;
  }

  if (variant === 'compact') {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.compactBadge, { borderColor: scoreColor }]}>
          <Text style={[styles.compactScoreText, { color: scoreColor }]}>
            {numericScore}%
          </Text>
        </View>
        <Text style={styles.compactLabel} numberOfLines={1}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.largeContainer}>
      <View style={[styles.scoreRing, { borderColor: scoreColor }]}>
        <Text style={[styles.largeScoreText, { color: scoreColor }]}>
          {numericScore}%
        </Text>
        <Text style={styles.ringLabel}>MATCH</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.largeLabel}>{label || 'Resume Match Score'}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  largeContainer: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    padding: THEME.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.lg,
    marginBottom: THEME.spacing.base,
  },
  scoreRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface2,
  },
  largeScoreText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  ringLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
  textContainer: {
    flex: 1,
  },
  largeLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },

  // Compact variant
  compactContainer: {
    flex: 1,
    backgroundColor: THEME.colors.surface2,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  compactBadge: {
    borderWidth: 2,
    borderRadius: THEME.radius.full,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 2,
    marginBottom: THEME.spacing.xs,
  },
  compactScoreText: {
    fontSize: 16,
    fontWeight: '700',
  },
  compactLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
});

