import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { THEME } from '../config/theme';

/**
 * StatusBadge component matching web application status pills
 */
export default function StatusBadge({ status }) {
  const norm = (status || '').toLowerCase();

  let bg = THEME.colors.surface2;
  let text = THEME.colors.textSecondary;
  let dot = THEME.colors.textMuted;

  if (norm === 'applied') {
    bg = 'rgba(56, 189, 248, 0.12)';
    text = '#38BDF8';
    dot = '#38BDF8';
  } else if (norm === 'under review') {
    bg = THEME.colors.warningBg;
    text = THEME.colors.warning;
    dot = THEME.colors.warning;
  } else if (norm === 'shortlisted' || norm === 'healthy' || norm === 'online') {
    bg = THEME.colors.successBg;
    text = THEME.colors.success;
    dot = THEME.colors.success;
  } else if (norm === 'rejected' || norm === 'degraded' || norm === 'offline') {
    bg = THEME.colors.dangerBg;
    text = THEME.colors.danger;
    dot = THEME.colors.danger;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text style={[styles.text, { color: text }]}>{status || 'Unknown'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
    alignSelf: 'flex-start',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

