import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { THEME } from '../config/theme';

/**
 * SkillTag component for matched, missing, or keyword tags
 */
export default function SkillTag({ name, type = 'matched' }) {
  const isMatched = type === 'matched';
  const isMissing = type === 'missing';

  let bg = THEME.colors.surface2;
  let borderColor = THEME.colors.surfaceBorder;
  let textColor = THEME.colors.textPrimary;
  let prefix = '•';

  if (isMatched) {
    bg = THEME.colors.successBg;
    borderColor = 'rgba(52, 211, 153, 0.3)';
    textColor = THEME.colors.success;
    prefix = '✓';
  } else if (isMissing) {
    bg = THEME.colors.dangerBg;
    borderColor = 'rgba(248, 113, 113, 0.3)';
    textColor = THEME.colors.danger;
    prefix = '⚠';
  }

  return (
    <View style={[styles.tag, { backgroundColor: bg, borderColor }]}>
      <Text style={[styles.prefix, { color: textColor }]}>{prefix}</Text>
      <Text style={[styles.text, { color: textColor }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    gap: 6,
  },
  prefix: {
    fontSize: 12,
    fontWeight: '700',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});

