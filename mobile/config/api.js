import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * ResumeIQ Centralized API Configuration
 * 
 * Rules:
 * 1. Physical devices on local Wi-Fi cannot resolve `127.0.0.1` or `localhost`.
 *    Set `CUSTOM_API_IP` below to your computer's local network IP (e.g., '192.168.1.5').
 * 2. Android Emulators map host computer localhost to `10.0.2.2:8000`.
 * 3. iOS Simulators or Web map directly to `127.0.0.1:8000`.
 */

// REPLACE with your computer's local IP address when testing on a physical phone via Expo Go
// e.g., '192.168.1.5' or '10.0.0.12'
export const CUSTOM_API_IP = null;

const getHostUri = () => {
  // Expo auto-detects debugger host IP when running via expo start
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (debuggerHost) {
    return debuggerHost.split(':')[0];
  }
  return null;
};

const getDefaultBaseUrl = () => {
  if (CUSTOM_API_IP) {
    return `http://${CUSTOM_API_IP}:8000`;
  }

  const detectedHost = getHostUri();
  if (detectedHost && detectedHost !== 'localhost' && detectedHost !== '127.0.0.1') {
    return `http://${detectedHost}:8000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }

  return 'http://127.0.0.1:8000';
};

export const API_CONFIG = {
  BASE_URL: getDefaultBaseUrl(),
  ENDPOINTS: {
    HEALTH: '/',
    ANALYZE: '/api/resume/analyze',
  },
  TIMEOUT_MS: 30000,
};

/**
 * Allows runtime update of the API Base URL from the Settings/Profile screen.
 */
let currentBaseUrl = API_CONFIG.BASE_URL;

export const setApiBaseUrl = (newUrl) => {
  if (newUrl) {
    currentBaseUrl = newUrl.replace(/\/+$/, '');
  }
};

export const getApiBaseUrl = () => currentBaseUrl;

