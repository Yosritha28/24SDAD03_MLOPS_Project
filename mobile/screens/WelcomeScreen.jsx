import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { THEME } from '../config/theme';
import { Button, Card, SectionHeader } from '../components';

/**
 * Screen 1: Splash / Welcome Screen
 * Highlights ResumeIQ branding, AI value proposition, and quick entry into app.
 */
export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        
        {/* Brand Header */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>AI</Text>
          </View>
          <Text style={styles.logo}>
            Resume<Text style={styles.logoHighlight}>IQ</Text>
          </Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.eyebrow}>CAREER INTELLIGENCE PLATFORM</Text>
          <Text style={styles.headline}>
            Optimize your resume for any role with precision AI
          </Text>
          <Text style={styles.subtext}>
            Upload your resume, compare against real job descriptions, and unlock actionable skill gap analysis in seconds.
          </Text>
        </View>

        {/* Feature Highlights */}
        <View style={styles.featureGrid}>
          <Card style={styles.featureCard}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIcon}>⚡</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Instant Match Scoring</Text>
              <Text style={styles.featureDesc}>
                Get an instant compatibility percentage comparing your skills to the JD.
              </Text>
            </View>
          </Card>

          <Card style={styles.featureCard}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIcon}>🎯</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Skill Gap Detection</Text>
              <Text style={styles.featureDesc}>
                Spot missing technical requirements and keywords before applying.
              </Text>
            </View>
          </Card>

          <Card style={styles.featureCard}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIcon}>💡</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>AI Recommendations</Text>
              <Text style={styles.featureDesc}>
                Receive intelligent, contextual advice to stand out to hiring managers.
              </Text>
            </View>
          </Card>
        </View>

        {/* CTA Footer */}
        <View style={styles.ctaContainer}>
          <Button
            title="Get Started →"
            onPress={() => navigation.replace('MainTabs')}
            style={styles.ctaButton}
          />
          <Text style={styles.footnote}>
            Connected with FastAPI & Gemini 2.5 AI backend
          </Text>
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
    flexGrow: 1,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.xl,
    paddingBottom: THEME.spacing.xxl,
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: THEME.spacing.lg,
  },
  logoBadge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: THEME.radius.xs,
  },
  logoBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  logoHighlight: {
    color: THEME.colors.secondary,
  },
  heroSection: {
    marginVertical: THEME.spacing.md,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.secondary,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtext: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    lineHeight: 22,
  },
  featureGrid: {
    marginVertical: THEME.spacing.md,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    gap: THEME.spacing.md,
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 16,
  },
  ctaContainer: {
    marginTop: THEME.spacing.lg,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    height: 52,
    marginBottom: 12,
  },
  footnote: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
});

