import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
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
 * Screen 4: Analysis Result Screen
 * Displays Overall Match Score, Skill/Keyword/Experience breakdowns,
 * Matched/Missing Skills, Strengths, and AI Recommendations.
 */
export default function ResultScreen({ route, navigation }) {
  const result = route.params?.result;

  if (!result || !result.analysis) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="📄"
            title="No Analysis Selected"
            message="Please scan a resume first to view detailed results."
            actionLabel="Scan Resume"
            onAction={() => navigation.navigate('Upload')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const { filename, analysis } = result;
  const advanced = analysis.advanced_analysis || {};
  const matchedSkills = analysis.skills || [];
  const missingSkills = analysis.missing_skills || [];
  const strengths = analysis.strengths || [];
  const recommendations = analysis.recommendations || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Top Header */}
        <SectionHeader
          eyebrow="AI SCORE REPORT"
          title="Analysis Results"
          subtitle={`Analyzed: ${filename || 'resume.pdf'}`}
          rightAction={
            <Button
              title="Full Report"
              onPress={() => navigation.navigate('Report', { result })}
              variant="outline"
              style={styles.headerReportBtn}
            />
          }
        />

        {/* 1. OVERALL MATCH SCORE */}
        <ScoreCard
          score={analysis.score}
          label="Overall Match Score"
          subtitle="Compatibility between your resume and the target job description."
        />

        {/* 2. ADVANCED METRIC BREAKDOWN */}
        {advanced && (
          <View style={styles.subScoresContainer}>
            <ScoreCard
              variant="compact"
              score={advanced.skill_match_score || analysis.score}
              label="Skill Match"
            />
            <ScoreCard
              variant="compact"
              score={advanced.keyword_match_score || 0}
              label="Keywords"
            />
            <ScoreCard
              variant="compact"
              score={advanced.experience_match_score || 0}
              label="Experience"
            />
          </View>
        )}

        {/* 3. MATCHED SKILLS */}
        <Card style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Matched Skills ({matchedSkills.length})</Text>
            <Text style={styles.matchSubhead}>Detected in document</Text>
          </View>

          {matchedSkills.length > 0 ? (
            <View style={styles.tagsWrapper}>
              {matchedSkills.map((skill, index) => (
                <SkillTag key={`${skill}-${index}`} name={skill} type="matched" />
              ))}
            </View>
          ) : (
            <Text style={styles.noSkillsText}>No direct skills matched in the document.</Text>
          )}
        </Card>

        {/* 4. MISSING SKILLS / GAPS */}
        <Card style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardTitle, { color: THEME.colors.warning }]}>
              Missing Skills / Gaps ({missingSkills.length})
            </Text>
            <Text style={styles.matchSubhead}>Required by Job Description</Text>
          </View>

          {missingSkills.length > 0 ? (
            <View style={styles.tagsWrapper}>
              {missingSkills.map((skill, index) => (
                <SkillTag key={`${skill}-${index}`} name={skill} type="missing" />
              ))}
            </View>
          ) : (
            <Text style={styles.allSkillsMatchedText}>
              ✓ Excellent! All required core skills were identified.
            </Text>
          )}
        </Card>

        {/* 5. STRENGTHS */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Key Strengths</Text>
          {strengths.length > 0 ? (
            <View style={styles.listContainer}>
              {strengths.map((item, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bulletCheck}>✓</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noSkillsText}>No explicit strengths detected.</Text>
          )}
        </Card>

        {/* 6. AI RECOMMENDATIONS */}
        <Card style={[styles.card, styles.recommendationsCard]}>
          <View style={styles.aiBadgeRow}>
            <View style={styles.aiIconBadge}>
              <Text style={styles.aiIconText}>AI</Text>
            </View>
            <Text style={styles.cardTitle}>Career Recommendations</Text>
          </View>

          {recommendations.length > 0 ? (
            <View style={styles.listContainer}>
              {recommendations.map((rec, idx) => (
                <View key={idx} style={styles.recommendationItem}>
                  <Text style={styles.recBulb}>💡</Text>
                  <Text style={styles.recText}>{rec}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noSkillsText}>
              Your resume is well-aligned with this role.
            </Text>
          )}
        </Card>

        {/* 7. BOTTOM ACTIONS */}
        <View style={styles.bottomActions}>
          <Button
            title="📄 View Full Detailed Report"
            onPress={() => navigation.navigate('Report', { result })}
            style={styles.fullReportBtn}
          />
          <Button
            title="← Scan Another Resume"
            onPress={() => navigation.navigate('Upload')}
            variant="secondary"
            style={styles.scanAnotherBtn}
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
  headerReportBtn: {
    height: 38,
    paddingHorizontal: 12,
  },
  subScoresContainer: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.base,
  },
  card: {
    marginBottom: THEME.spacing.base,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  matchSubhead: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noSkillsText: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    fontStyle: 'italic',
  },
  allSkillsMatchedText: {
    fontSize: 13,
    color: THEME.colors.success,
    fontWeight: '600',
  },
  listContainer: {
    marginTop: THEME.spacing.sm,
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletCheck: {
    color: THEME.colors.success,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 20,
  },
  recommendationsCard: {
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: THEME.spacing.md,
  },
  aiIconBadge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radius.xs,
  },
  aiIconText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: THEME.colors.surface2,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    gap: 8,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  recBulb: {
    fontSize: 16,
    lineHeight: 22,
  },
  recText: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
    lineHeight: 20,
  },
  bottomActions: {
    marginTop: THEME.spacing.md,
    gap: 10,
  },
  fullReportBtn: {
    height: 50,
  },
  scanAnotherBtn: {
    height: 46,
  },
});

