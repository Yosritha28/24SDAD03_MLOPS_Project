import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { THEME } from '../config/theme';
import { Button, Card, SectionHeader } from '../components';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';
import { getApiBaseUrl, setApiBaseUrl } from '../config/api';

/**
 * Screen 7: Profile / Settings Screen
 * Manages user profile, API connection configuration (for physical phone LAN IP),
 * backend diagnostics, and about info.
 */
export default function ProfileScreen() {
  const [currentUrl, setCurrentUrl] = useState(getApiBaseUrl());
  const [inputUrl, setInputUrl] = useState(getApiBaseUrl());
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    // Check if custom URL was previously stored
    StorageService.getCustomApiUrl().then((saved) => {
      if (saved) {
        setInputUrl(saved);
        setCurrentUrl(saved);
        setApiBaseUrl(saved);
      }
    });
  }, []);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    try {
      // Temporarily set testing url
      setApiBaseUrl(inputUrl);
      const res = await ApiService.checkHealth();
      setConnectionStatus(res);
      if (res.success) {
        setCurrentUrl(inputUrl);
        await StorageService.setCustomApiUrl(inputUrl);
      }
    } catch (err) {
      setConnectionStatus({ success: false, error: err.message });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleResetDefault = async () => {
    await StorageService.setCustomApiUrl(null);
    const defaultUrl = 'http://127.0.0.1:8000';
    setInputUrl(defaultUrl);
    setCurrentUrl(defaultUrl);
    setApiBaseUrl(defaultUrl);
    setConnectionStatus(null);
    Alert.alert('Reset', 'API URL reset to default host.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <ScrollView contentContainerStyle={styles.container}>
        
        <SectionHeader
          eyebrow="PREFERENCES & SYSTEM"
          title="Profile & Settings"
          subtitle="Configure network endpoints, view backend diagnostics, and app info."
        />

        {/* User Card */}
        <Card style={styles.card}>
          <View style={styles.userRow}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Candidate Profile</Text>
              <Text style={styles.userRole}>Software Engineer Applicant</Text>
              <Text style={styles.userEmail}>candidate@resumeiq.ai</Text>
            </View>
          </View>
        </Card>

        {/* Backend Connectivity Configuration */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Backend API Configuration</Text>
          <Text style={styles.cardSub}>
            Physical phones cannot access <Text style={{ color: THEME.colors.secondary }}>127.0.0.1</Text>.
            Set your computer's LAN IP address below (e.g. <Text style={{ color: THEME.colors.secondary }}>http://192.168.1.15:8000</Text>).
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>API Base URL</Text>
            <TextInput
              style={styles.textInput}
              value={inputUrl}
              onChangeText={setInputUrl}
              placeholder="http://192.168.1.X:8000"
              placeholderTextColor={THEME.colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {connectionStatus && (
            <View
              style={[
                styles.statusBox,
                {
                  backgroundColor: connectionStatus.success
                    ? THEME.colors.successBg
                    : THEME.colors.dangerBg,
                  borderColor: connectionStatus.success
                    ? THEME.colors.success
                    : THEME.colors.danger,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusBoxTitle,
                  {
                    color: connectionStatus.success
                      ? THEME.colors.success
                      : THEME.colors.danger,
                  },
                ]}
              >
                {connectionStatus.success ? '✓ Connected Successfully' : '✕ Connection Failed'}
              </Text>
              <Text style={styles.statusBoxDetail}>
                {connectionStatus.success
                  ? `FastAPI responded OK at ${connectionStatus.endpoint}`
                  : connectionStatus.error}
              </Text>
            </View>
          )}

          <View style={styles.apiActionsRow}>
            <Button
              title="Test Connection"
              onPress={handleTestConnection}
              loading={testingConnection}
              style={{ flex: 1 }}
            />
            <Button
              title="Reset"
              onPress={handleResetDefault}
              variant="outline"
              style={{ width: 80 }}
            />
          </View>
        </Card>

        {/* System Architecture Specifications */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>System Architecture</Text>
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Backend Framework</Text>
              <Text style={styles.infoVal}>FastAPI (Python 3.10+)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Analyze Endpoint</Text>
              <Text style={styles.infoVal}>POST /api/resume/analyze</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>AI Recommendation Model</Text>
              <Text style={styles.infoVal}>gemini-2.5-flash</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Document Parsers</Text>
              <Text style={styles.infoVal}>pypdf & python-docx</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Mobile Client</Text>
              <Text style={styles.infoVal}>React Native 0.76 + Expo 52</Text>
            </View>
          </View>
        </Card>

        {/* About Card */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>About ResumeIQ</Text>
          <Text style={styles.aboutText}>
            ResumeIQ is an AI-driven career intelligence platform engineered to close the gap between job seekers and hiring requirements. Built with advanced NLP parsing, regex tokenizers, and Gemini AI.
          </Text>
          <Text style={styles.versionText}>Mobile Version 1.0.0 (Build 2026.1)</Text>
        </Card>

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
  card: {
    marginBottom: THEME.spacing.base,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
    lineHeight: 18,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  userRole: {
    fontSize: 13,
    color: THEME.colors.secondary,
    marginTop: 1,
  },
  userEmail: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: THEME.spacing.md,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: THEME.colors.surface2,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    borderRadius: THEME.radius.md,
    paddingHorizontal: THEME.spacing.md,
    height: 46,
    fontSize: 14,
    color: THEME.colors.textPrimary,
  },
  statusBox: {
    borderWidth: 1,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  statusBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  statusBoxDetail: {
    fontSize: 12,
    color: THEME.colors.textPrimary,
  },
  apiActionsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  infoList: {
    marginTop: THEME.spacing.sm,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
  },
  infoKey: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  aboutText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 20,
    marginTop: 6,
  },
  versionText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: THEME.spacing.md,
  },
});

