import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { THEME } from '../config/theme';
import {
  Button,
  Card,
  StatusBadge,
  SectionHeader,
  EmptyState,
} from '../components';
import { StorageService } from '../services/storage';

/**
 * Screen 6: Applications Screen
 * Mobile application tracking list with filtering and details modal.
 */
export default function ApplicationsScreen({ navigation }) {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = useCallback(async () => {
    const list = await StorageService.getApplications();
    setApplications(list || []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchApplications();
    }, [fetchApplications])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };

  const filteredApps = applications.filter((app) => {
    if (filter === 'All') return true;
    return app.status?.toLowerCase() === filter.toLowerCase();
  });

  const filterOptions = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Rejected'];

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
        <SectionHeader
          eyebrow="JOB PIPELINE"
          title="Applications"
          subtitle="Track submitted resumes and interview statuses"
        />

        {/* Status Filter Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setFilter(opt)}
              style={[
                styles.filterPill,
                filter === opt ? styles.filterPillActive : null,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === opt ? styles.filterTextActive : null,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Application Cards List */}
        {filteredApps.length > 0 ? (
          filteredApps.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => setSelectedApp(item)}
            >
              <Card style={styles.appCard}>
                <View style={styles.appCardTop}>
                  <View style={styles.appMainInfo}>
                    <Text style={styles.jobRoleText}>{item.jobRole}</Text>
                    <Text style={styles.companyText}>
                      {item.company || 'ResumeIQ Platform'}
                    </Text>
                  </View>
                  <StatusBadge status={item.status} />
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.appCardBottom}>
                  <Text style={styles.dateText}>📅 {item.date}</Text>

                  {item.matchScore !== null && item.matchScore !== undefined ? (
                    <View style={styles.scorePill}>
                      <Text style={styles.scorePillLabel}>Match:</Text>
                      <Text style={styles.scorePillVal}>{item.matchScore}%</Text>
                    </View>
                  ) : (
                    <Text style={styles.noScoreText}>Score pending</Text>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <EmptyState
            icon="🗂️"
            title="No Applications Found"
            message={
              filter === 'All'
                ? 'You have not submitted or scanned any resumes yet.'
                : `No applications matching status "${filter}".`
            }
            actionLabel="Scan Resume"
            onAction={() => navigation.navigate('Upload')}
          />
        )}

      </ScrollView>

      {/* APPLICATION DETAILS MODAL */}
      <Modal
        visible={!!selectedApp}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedApp(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedApp && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalEyebrow}>APPLICATION DETAILS</Text>
                    <Text style={styles.modalTitle}>{selectedApp.jobRole}</Text>
                    <Text style={styles.modalCompany}>
                      {selectedApp.company || 'ResumeIQ Platform'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedApp(null)}
                    style={styles.closeModalBtn}
                  >
                    <Text style={styles.closeModalText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalStatusRow}>
                  <View>
                    <Text style={styles.detailLabel}>Current Status</Text>
                    <StatusBadge status={selectedApp.status} />
                  </View>

                  {selectedApp.matchScore !== null && (
                    <View style={styles.modalScoreBox}>
                      <Text style={styles.detailLabel}>Compatibility</Text>
                      <Text style={styles.modalScoreVal}>
                        {selectedApp.matchScore}%
                      </Text>
                    </View>
                  )}
                </View>

                {selectedApp.details?.description && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Job Description / Role</Text>
                    <Text style={styles.detailText}>
                      {selectedApp.details.description}
                    </Text>
                  </View>
                )}

                {selectedApp.details?.notes && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Candidate Notes</Text>
                    <Text style={styles.detailText}>
                      {selectedApp.details.notes}
                    </Text>
                  </View>
                )}

                <View style={styles.modalFooter}>
                  <Button
                    title="Close Details"
                    onPress={() => setSelectedApp(null)}
                    variant="secondary"
                    style={{ width: '100%' }}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: THEME.spacing.lg,
    paddingVertical: 2,
  },
  filterPill: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  filterPillActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFF',
  },
  appCard: {
    marginBottom: THEME.spacing.md,
  },
  appCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  appMainInfo: {
    flex: 1,
    paddingRight: 8,
  },
  jobRoleText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  companyText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: THEME.colors.surfaceBorder,
    marginVertical: 8,
  },
  appCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scorePillLabel: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  scorePillVal: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.success,
  },
  noScoreText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontStyle: 'italic',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.radius.xl,
    borderTopRightRadius: THEME.radius.xl,
    padding: THEME.spacing.xl,
    borderTopWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.base,
  },
  modalEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.secondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  modalCompany: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    fontWeight: '700',
  },
  modalStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface2,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    marginBottom: THEME.spacing.base,
  },
  modalScoreBox: {
    alignItems: 'flex-end',
  },
  modalScoreVal: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.success,
  },
  detailSection: {
    marginBottom: THEME.spacing.md,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    lineHeight: 19,
  },
  modalFooter: {
    marginTop: THEME.spacing.base,
    paddingTop: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
  },
});

