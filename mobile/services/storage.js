import AsyncStorage from '@react-native-async-storage/async-storage';

const APPLICATIONS_KEY = 'resumeiq_mobile_applications';
const RECENT_ANALYSIS_KEY = 'resumeiq_mobile_recent_analysis';
const CUSTOM_API_URL_KEY = 'resumeiq_mobile_api_url';

export const INITIAL_MOCK_APPLICATIONS = [
  {
    id: 'app-01',
    jobRole: 'Frontend Engineer',
    company: 'TechCorp',
    date: '2025-08-12',
    matchScore: 87,
    status: 'Applied',
    details: {
      description: 'Develop and maintain the web UI for the main product.',
      notes: 'Submitted via company portal.',
    },
  },
  {
    id: 'app-02',
    jobRole: 'Full-Stack Developer',
    company: 'InnovateX',
    date: '2025-09-01',
    matchScore: 92,
    status: 'Under Review',
    details: {
      description: 'Work on both frontend and backend services.',
      notes: 'HR reviewing application.',
    },
  },
  {
    id: 'app-03',
    jobRole: 'UI/UX Designer',
    company: 'Creative Labs',
    date: '2025-07-20',
    matchScore: null,
    status: 'Shortlisted',
    details: {
      description: 'Design user interfaces for mobile apps.',
      notes: 'Shortlisted for interview next week.',
    },
  },
  {
    id: 'app-04',
    jobRole: 'Data Analyst',
    company: 'Enterprise Insights',
    date: '2025-06-15',
    matchScore: 78,
    status: 'Rejected',
    details: {
      description: 'Analyze data trends for the marketing team.',
      notes: 'Position filled.',
    },
  },
];

export const StorageService = {
  // Load applications list
  async getApplications() {
    try {
      const data = await AsyncStorage.getItem(APPLICATIONS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Seed with initial applications on first launch
      await AsyncStorage.setItem(APPLICATIONS_KEY, JSON.stringify(INITIAL_MOCK_APPLICATIONS));
      return INITIAL_MOCK_APPLICATIONS;
    } catch (e) {
      console.warn('StorageService.getApplications error:', e);
      return INITIAL_MOCK_APPLICATIONS;
    }
  },

  // Save new application after successful analysis
  async addApplication(newApp) {
    try {
      const current = await this.getApplications();
      const updated = [newApp, ...current];
      await AsyncStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('StorageService.addApplication error:', e);
      return [];
    }
  },

  // Store last analysis result for quick dashboard resume
  async saveRecentAnalysis(analysisResult) {
    try {
      await AsyncStorage.setItem(RECENT_ANALYSIS_KEY, JSON.stringify(analysisResult));
    } catch (e) {
      console.warn('StorageService.saveRecentAnalysis error:', e);
    }
  },

  async getRecentAnalysis() {
    try {
      const data = await AsyncStorage.getItem(RECENT_ANALYSIS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // Custom API URL override persisted locally
  async getCustomApiUrl() {
    try {
      return await AsyncStorage.getItem(CUSTOM_API_URL_KEY);
    } catch (e) {
      return null;
    }
  },

  async setCustomApiUrl(url) {
    try {
      if (url) {
        await AsyncStorage.setItem(CUSTOM_API_URL_KEY, url);
      } else {
        await AsyncStorage.removeItem(CUSTOM_API_URL_KEY);
      }
    } catch (e) {
      console.warn('StorageService.setCustomApiUrl error:', e);
    }
  },
};

