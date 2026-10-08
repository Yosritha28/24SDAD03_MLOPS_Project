import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Share,
  Alert,
} from 'react-native';
import { THEME } from '../config/theme';
import {
  Button,
  Card,
  ScoreCard,
  SkillTag,
  SectionHeader,
  EmptyState,
} from '../components';

/**
 * Screen 5: Detailed Report Screen
 * Mirror of the web Report page (compatibility summary, section analysis, matched keywords, recommendations).
 */
export default function ReportScreen({ route, navigation }) {
  const result = route.params?.result;

  if (!result || !result.analysis) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="📄"
            title="No Report Available"
            message="Please analyze a resume first to view the complete intelligence report."
            actionLabel="Scan Resume"
            onAction={() => navigation.navigate('Upload')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const { filename, analysis } = result;
  const advanced = analysis.advanced_analysis || {};
  const matchedKeywords = advanced.matched_keywords || [];
  const sections = advanced.resume_sections || {};
  const recommendations = analysis.recommendations || [];

  // Share summary report text
  const handleShare = async () => {
    try {
      const reportText = `ResumeIQ Analysis Report for ${filename}\nOverall Compatibility: ${analysis.score}%\nSkill Match: ${advanced.skill_match_score || 'N/A'}%\nKeyword Match: ${advanced.keyword_match_score || 'N/A'}%\n\nGenerated with ResumeIQ AI Platform.`;
      await Share.share({
        message: reportText,
        title: `ResumeIQ Report - ${filename}`,
      });
    } catch (error) {
      Alert.alert('Share Error', 'Could not share the report.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Report Top Header */}
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <Text style={styles.brandLogo}>
              Resume<Text style={styles.brandHighlight}>IQ</Text>
            </Text>
            <View style={styles.reportBadge}>
              <Text style={styles.reportBadgeText}>REPORT</Text>
            </View>
          </View>

          <Button
            title="Share"
            onPress={handleShare}
            variant="outline"
            style={styles.shareBtn}
          />
        </View>

        {/* Title Block */}
        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>COMPREHENSIVE AUDIT</Text>
          <Text style={styles.title}>Resume Compatibility Report</Text>
          <Text style={styles.filenameText}>Document: {filename}</Text>
        </View>

        {/* Big Overall Score Card */}
        <ScoreCard
          score={analysis.score}
          label="Resume Compatibility"
          subtitle="This report summarizes alignment between candidate credentials and the target job description."
        />

        {/* Key Metrics Breakdown Grid */}
        <Card style={styles.card}>
          <Text style={styles.sectionHeading}>Key Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>
                {advanced.skill_match_score ?? analysis.score}%
              </Text>
              <Text style={styles.metricLabel}>Skill Match</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>
                {advanced.keyword_match_score ?? 'N/A'}%
              </Text>
              <Text style={styles.metricLabel}>Keyword Match</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>
                {advanced.experience_match_score ?? 'N/A'}%
              </Text>
              <Text style={styles.metricLabel}>Experience</Text>
            </View>
          </View>
        </Card>

        {/* Matched Keywords Section */}
        <Card style={styles.card}>
          <Text style={styles.sectionHeading}>
            Matched Industry Keywords ({matchedKeywords.length})
          </Text>
          <Text style={styles.sectionSub}>
            High-value domain keywords recognized from the job requirement:
          </Text>

          {matchedKeywords.length > 0 ? (
            <View style={styles.tagsContainer}>
              {matchedKeywords.map((kw, i) => (
                <SkillTag key={i} name={kw} type="matched" />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyNote}>No primary keywords matched.</Text>
          )}
        </Card>

        {/* Resume Sections Verification */}
        <Card style={styles.card}>
          <Text style={styles.sectionHeading}>Resume Section Verification</Text>
          <Text style={styles.sectionSub}>
            Standard ATS-compliant sections found in your resume:
          </Text>

          <View style={styles.sectionsList}>
            {Object.keys(sections).length > 0 ? (
              Object.entries(sections).map(([sec, present]) => (
                <View key={sec} style={styles.sectionRow}>
                  <Text style={styles.sectionName}>
                    {sec.charAt(0).toUpperCase() + sec.slice(1)} Section
                  </Text>
                  <View
                    style={[
                      styles.sectionPill,
                      {
                        backgroundColor: present
                          ? THEME.colors.successBg
                          : THEME.colors.dangerBg,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sectionPillText,
                        {
                          color: present
                            ? THEME.colors.success
                            : THEME.colors.danger,
                        },
                      ]}
                    >
                      {present ? '✓ Present' : '⚠ Missing'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.sectionRow}>
                <Text style={styles.sectionName}>Standard Document Sections</Text>
                <Text style={styles.sectionPillText}>✓ Verified</Text>
              </View>
            )}
          </View>
        </Card>

        {/* AI Recommendations */}
        <Card style={styles.card}>
          <Text style={styles.sectionHeading}>Actionable Recommendations</Text>
          <Text style={styles.sectionSub}>
            Targeted optimizations from the AI heuristics engine:
          </Text>

          {recommendations.length > 0 ? (
            <View style={styles.recsList}>
              {recommendations.map((rec, idx) => (
                <View key={idx} style={styles.recItem}>
                  <Text style={styles.recIcon}>💡</Text>
                  <Text style={styles.recText}>{rec}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyNote}>
              Your resume meets all key criteria for this posting!
            </Text>
          )}
        </Card>

        {/* Navigation Actions */}
        <View style={styles.actionsFooter}>
          <Button
            title="← Back to Analysis"
            onPress={() => navigation.navigate('Result', { result })}
            variant="secondary"
            style={styles.backBtn}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    padding: THEME.spacing.base,
    paddingBottom: THEME.spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: THEME.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogo: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  brandHighlight: {
    color: THEME.colors.secondary,
  },
  reportBadge: {
    backgroundColor: THEME.colors.surface2,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radius.xs,
  },
  reportBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.secondary,
  },
  shareBtn: {
    height: 36,
    paddingHorizontal: 16,
  },
  titleBlock: {
    marginBottom: THEME.spacing.base,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.secondary,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
  },
  filenameText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  card: {
    marginBottom: THEME.spacing.base,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  metricItem: {
    flex: 1,
    backgroundColor: THEME.colors.surface2,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyNote: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    fontStyle: 'italic',
  },
  sectionsList: {
    gap: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface2,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  sectionName: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  sectionPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
  },
  sectionPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  recsList: {
    gap: 10,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: THEME.colors.surface2,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    gap: 8,
  },
  recIcon: {
    fontSize: 16,
    lineHeight: 20,
  },
  recText: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
    lineHeight: 19,
  },
  actionsFooter: {
    marginTop: THEME.spacing.sm,
    marginBottom: THEME.spacing.xl,
  },
  backBtn: {
    height: 48,
  },
});

