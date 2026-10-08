import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { THEME } from '../config/theme';
import { Button, Card, SectionHeader, LoadingState, ErrorState } from '../components';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';

/**
 * Screen 3: Resume Upload Screen
 * Handles PDF/DOCX file picking, Job Description text entry, and POST /api/resume/analyze
 */
export default function UploadScreen({ navigation }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Pick Document (PDF / DOCX)
  const handlePickDocument = async () => {
    try {
      setErrorMessage(null);
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile({
          uri: file.uri,
          name: file.name,
          mimeType: file.mimeType,
          size: file.size,
        });
      }
    } catch (err) {
      console.warn('Document picker error:', err);
      Alert.alert('File Picker', 'Unable to open file picker. Please try again.');
    }
  };

  // Submit Analysis Request
  const handleAnalyze = async () => {
    if (!selectedFile) {
      Alert.alert('Resume Required', 'Please select a PDF or DOCX resume document first.');
      return;
    }

    if (!jobDescription.trim()) {
      Alert.alert('Job Description Required', 'Please enter or paste the target job description.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const responseData = await ApiService.analyzeResume(selectedFile, jobDescription);

      // Save to mobile recent analysis cache
      await StorageService.saveRecentAnalysis(responseData);

      // Append to mobile applications tracking (same as web Upload.jsx appendAnalysisToApplications)
      const now = new Date();
      await StorageService.addApplication({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        jobRole: 'Resume Analysis',
        company: 'ResumeIQ',
        date: now.toISOString().slice(0, 10),
        matchScore: responseData?.analysis?.score ?? null,
        status: 'Applied',
        details: {
          description: jobDescription.slice(0, 140) + '...',
          notes: `Analyzed document: ${selectedFile.name}`,
        },
      });

      // Navigate to Result screen with the returned analysis payload
      navigation.navigate('Result', { result: responseData });
    } catch (err) {
      console.error('Analysis failed:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during resume analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setJobDescription('');
    setErrorMessage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          
          <SectionHeader
            eyebrow="ANALYSIS WORKSPACE"
            title="Scan & Score Resume"
            subtitle="Upload your resume and compare against job requirements."
          />

          {/* STEP 1: RESUME SELECTION */}
          <Card style={styles.card}>
            <Text style={styles.stepTitle}>1. Select Resume Document</Text>
            <Text style={styles.stepSubtitle}>Supported formats: PDF, DOCX</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePickDocument}
              style={[
                styles.uploadBox,
                selectedFile ? styles.uploadBoxSelected : null,
              ]}
            >
              <Text style={styles.uploadIcon}>{selectedFile ? '📄' : '📁'}</Text>
              <Text style={styles.uploadButtonText}>
                {selectedFile ? 'Change Selected Document' : 'Browse Files (PDF / DOCX)'}
              </Text>
            </TouchableOpacity>

            {selectedFile && (
              <View style={styles.selectedFilePill}>
                <View style={styles.selectedFileInfo}>
                  <Text style={styles.selectedFileName} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  {selectedFile.size && (
                    <Text style={styles.selectedFileSize}>
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => setSelectedFile(null)}>
                  <Text style={styles.removeFileBtn}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>

          {/* STEP 2: JOB DESCRIPTION INPUT */}
          <Card style={styles.card}>
            <View style={styles.jdHeaderRow}>
              <Text style={styles.stepTitle}>2. Target Job Description</Text>
              {jobDescription.length > 0 && (
                <Text style={styles.charCount}>{jobDescription.length} chars</Text>
              )}
            </View>
            <Text style={styles.stepSubtitle}>
              Paste key qualifications, responsibilities, or the full job posting.
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder="Paste job description here (e.g., We are looking for a Software Engineer with Python, React, Docker...)"
              placeholderTextColor={THEME.colors.textMuted}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              value={jobDescription}
              onChangeText={(text) => {
                setJobDescription(text);
                if (errorMessage) setErrorMessage(null);
              }}
            />
          </Card>

          {/* ERROR NOTIFICATION */}
          {errorMessage && (
            <ErrorState
              title="Analysis Could Not Complete"
              message={errorMessage}
              onRetry={handleAnalyze}
              retryLabel="Retry Analysis"
            />
          )}

          {/* LOADING STATE INDICATOR */}
          {loading && (
            <LoadingState
              title="Analyzing Your Resume..."
              message="Parsing document text and comparing technical skills against job requirements."
            />
          )}

          {/* ACTION BUTTONS */}
          <View style={styles.actionContainer}>
            <Button
              title="⚡ Analyze Resume"
              onPress={handleAnalyze}
              loading={loading}
              disabled={loading || !selectedFile || !jobDescription.trim()}
              style={styles.analyzeButton}
            />

            {(selectedFile || jobDescription) && !loading && (
              <Button
                title="Clear Form"
                onPress={handleClear}
                variant="ghost"
                style={{ marginTop: 8 }}
              />
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
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
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 2,
  },
  stepSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
  },
  uploadBox: {
    backgroundColor: THEME.colors.surface2,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
    borderStyle: 'dashed',
    borderRadius: THEME.radius.md,
    paddingVertical: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadBoxSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(108, 99, 255, 0.08)',
  },
  uploadIcon: {
    fontSize: 28,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.secondary,
  },
  selectedFilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surface2,
    borderRadius: THEME.radius.md,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 10,
    marginTop: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  selectedFileInfo: {
    flex: 1,
    paddingRight: 8,
  },
  selectedFileName: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  selectedFileSize: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  removeFileBtn: {
    fontSize: 16,
    color: THEME.colors.danger,
    padding: 4,
  },
  jdHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  textInput: {
    backgroundColor: THEME.colors.surface2,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    padding: THEME.spacing.md,
    fontSize: 14,
    color: THEME.colors.textPrimary,
    minHeight: 140,
    lineHeight: 20,
  },
  actionContainer: {
    marginTop: THEME.spacing.sm,
  },
  analyzeButton: {
    height: 52,
  },
});

