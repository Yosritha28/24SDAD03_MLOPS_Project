import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { THEME } from '../config/theme';
import { Button, Card, ScoreCard, StatusBadge, SectionHeader } from '../components';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';
import { getApiBaseUrl } from '../config/api';

/**
 * Screen 2: Home / Dashboard
 * Displays welcome summary, quick upload action, recent analysis, and application statistics.
 */
export default function HomeScreen({ navigation }) {
  const [recentAnalysis, setRecentAnalysis] = useState(null);
  const [applications, setApplications] = useState([]);
  const [backendOnline, setBackendOnline] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      const [storedAnalysis, storedApps, health] = await Promise.all([
        StorageService.getRecentAnalysis(),
        StorageService.getApplications(),
        ApiService.checkHealth(),
      ]);

      setRecentAnalysis(storedAnalysis);
      setApplications(storedApps || []);
      setBackendOnline(health.success);
    } catch (e) {
      console.warn('HomeScreen data load error:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const totalApps = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const underReviewCount = applications.filter((a) => a.status === 'Under Review').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.colors.primary}
          />
        }
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingEyebrow}>RESUMEIQ MOBILE</Text>
            <Text style={styles.greetingTitle}>Welcome Back</Text>
          </View>
          <View
            style={[
              styles.backendPill,
              {
                backgroundColor: backendOnline
                  ? THEME.colors.successBg
                  : backendOnline === false
                  ? THEME.colors.dangerBg
                  : THEME.colors.surface2,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: backendOnline
                    ? THEME.colors.success
                    : backendOnline === false
                    ? THEME.colors.danger
                    : THEME.colors.warning,
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: backendOnline
                    ? THEME.colors.success
                    : backendOnline === false
                    ? THEME.colors.danger
                    : THEME.colors.textMuted,
                },
              ]}
            >
              {backendOnline ? 'API Online' : backendOnline === false ? 'API Offline' : 'Checking'}
            </Text>
          </View>
        </View>

        {/* Quick Action Hero Card */}
        <Card style={styles.actionHeroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>AI RESUME SCANNER</Text>
            <Text style={styles.heroHeading}>Match Your Resume With Any Job</Text>
            <Text style={styles.heroBody}>
              Upload your document and get instant score breakdowns, strengths, and AI recommendations.
            </Text>
            <Button
              title="⚡ Analyze Resume Now"
              onPress={() => navigation.navigate('Upload')}
              style={styles.heroButton}
            />
          </View>
        </Card>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <Card style={styles.statMiniCard}>
            <Text style={styles.statNumber}>{totalApps}</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </Card>
          <Card style={styles.statMiniCard}>
            <Text style={[styles.statNumber, { color: THEME.colors.success }]}>
              {shortlistedCount}
            </Text>
            <Text style={styles.statLabel}>Shortlisted</Text>
          </Card>
          <Card style={styles.statMiniCard}>
            <Text style={[styles.statNumber, { color: THEME.colors.warning }]}>
              {underReviewCount}
            </Text>
            <Text style={styles.statLabel}>In Review</Text>
          </Card>
        </View>

        {/* Recent Analysis Section */}
        <View style={styles.sectionWrapper}>
          <SectionHeader
            eyebrow="LATEST SCAN"
            title="Recent Analysis"
            subtitle="Your most recent scan result"
            rightAction={
              recentAnalysis && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Result', { result: recentAnalysis })
                  }
                >
                  <Text style={styles.linkText}>View Details →</Text>
                </TouchableOpacity>
              )
            }
          />

          {recentAnalysis ? (
            <Card style={styles.recentAnalysisCard}>
              <View style={styles.recentAnalysisHeader}>
                <View style={styles.recentDocInfo}>
                  <Text style={styles.recentFilename} numberOfLines={1}>
                    📄 {recentAnalysis.filename}
                  </Text>
                  <Text style={styles.recentSub}>
                    {recentAnalysis.analysis?.skills?.length || 0} matched skills •{' '}
                    {recentAnalysis.analysis?.missing_skills?.length || 0} missing
                  </Text>
                </View>
                <View style={styles.scoreBadgeBox}>
                  <Text style={styles.scoreBadgeText}>
                    {recentAnalysis.analysis?.score || 0}%
                  </Text>
                </View>
              </View>

              <View style={styles.recentActionsRow}>
                <Button
                  title="View Breakdown"
                  onPress={() =>
                    navigation.navigate('Result', { result: recentAnalysis })
                  }
                  variant="secondary"
                  style={styles.recentBtn}
                />
                <Button
                  title="Full Report"
                  onPress={() =>
                    navigation.navigate('Report', { result: recentAnalysis })
                  }
                  variant="outline"
                  style={styles.recentBtn}
                />
              </View>
            </Card>
          ) : (
            <Card style={styles.emptyRecentCard}>
              <Text style={styles.emptyIcon}>📄</Text>
              <Text style={styles.emptyRecentTitle}>No analysis yet</Text>
              <Text style={styles.emptyRecentText}>
                Upload your resume in the Scanner tab to generate your first match report.
              </Text>
              <Button
                title="Start First Scan"
                onPress={() => navigation.navigate('Upload')}
                variant="secondary"
                style={{ marginTop: 12, height: 40 }}
              />
            </Card>
          )}
        </View>

        {/* Active Applications Preview */}
        <View style={styles.sectionWrapper}>
          <SectionHeader
            eyebrow="TRACKER"
            title="Active Applications"
            subtitle="Recent job submissions"
            rightAction={
              <TouchableOpacity onPress={() => navigation.navigate('Applications')}>
                <Text style={styles.linkText}>See All ({totalApps}) →</Text>
              </TouchableOpacity>
            }
          />

          {applications.slice(0, 3).map((app) => (
            <Card key={app.id} style={styles.appCard}>
              <View style={styles.appHeaderRow}>
                <View style={styles.appTitleBox}>
                  <Text style={styles.appRoleText}>{app.jobRole}</Text>
                  <Text style={styles.appCompanyText}>
                    {app.company || 'ResumeIQ Candidate'} • {app.date}
                  </Text>
                </View>
                <StatusBadge status={app.status} />
              </View>

              {app.matchScore !== null && (
                <View style={styles.appScoreRow}>
                  <Text style={styles.appScoreLabel}>Compatibility Match:</Text>
                  <Text style={styles.appScoreVal}>{app.matchScore}%</Text>
                </View>
              )}
            </Card>
          ))}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  greetingEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.secondary,
    letterSpacing: 1.2,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
  },
  backendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    gap: 6,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionHeroCard: {
    backgroundColor: THEME.colors.surface,
    borderColor: 'rgba(108, 99, 255, 0.3)',
    marginBottom: THEME.spacing.base,
  },
  heroContent: {
    padding: THEME.spacing.xs,
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.secondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 8,
  },
  heroBody: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 19,
    marginBottom: THEME.spacing.base,
  },
  heroButton: {
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
  },
  statMiniCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.md,
    marginBottom: 0,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  sectionWrapper: {
    marginBottom: THEME.spacing.lg,
  },
  linkText: {
    color: THEME.colors.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  recentAnalysisCard: {
    padding: THEME.spacing.base,
  },
  recentAnalysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  recentDocInfo: {
    flex: 1,
    paddingRight: 12,
  },
  recentFilename: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  recentSub: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  scoreBadgeBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
  scoreBadgeText: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  recentActionsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  recentBtn: {
    flex: 1,
    height: 40,
  },
  emptyRecentCard: {
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  emptyIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  emptyRecentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  emptyRecentText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
  appCard: {
    marginBottom: THEME.spacing.sm,
  },
  appHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  appTitleBox: {
    flex: 1,
    paddingRight: 8,
  },
  appRoleText: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  appCompanyText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  appScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
    paddingTop: 8,
  },
  appScoreLabel: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  appScoreVal: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.success,
  },
});

