import { getApiBaseUrl, API_CONFIG } from '../config/api';

/**
 * ResumeIQ Mobile API Service
 * Encapsulates all network communication with FastAPI.
 */
export const ApiService = {
  /**
   * Health check probe against root endpoint: GET /
   */
  async checkHealth() {
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}${API_CONFIG.ENDPOINTS.HEALTH}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data, endpoint };
    } catch (err) {
      clearTimeout(timeout);
      let message = err.message || 'Cannot reach FastAPI backend';
      if (err.name === 'AbortError') {
        message = 'Connection timed out (8s)';
      }
      return { success: false, error: message, endpoint };
    }
  },

  /**
   * Analyze Resume: POST /api/resume/analyze
   *
   * @param {Object} fileInfo - Object from expo-document-picker:
   *   { uri, name, mimeType or type, size }
   * @param {string} jobDescription - Job requirements string
   */
  async analyzeResume(fileInfo, jobDescription) {
    if (!fileInfo || !fileInfo.uri) {
      throw new Error('Please select a valid resume document (PDF or DOCX).');
    }

    if (!jobDescription || !jobDescription.trim()) {
      throw new Error('Please enter or paste the job description.');
    }

    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}${API_CONFIG.ENDPOINTS.ANALYZE}`;

    // Prepare multipart FormData conforming to React Native standard
    const formData = new FormData();

    // Determine MIME type
    let mimeType = fileInfo.mimeType || fileInfo.type;
    const filename = fileInfo.name || 'resume.pdf';

    if (!mimeType) {
      if (filename.toLowerCase().endsWith('.docx')) {
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (filename.toLowerCase().endsWith('.doc')) {
        mimeType = 'application/msword';
      } else {
        mimeType = 'application/pdf';
      }
    }

    // Attach resume file
    formData.append('resume_file', {
      uri: fileInfo.uri,
      name: filename,
      type: mimeType,
    });

    // Attach job description text
    formData.append('job_description', jobDescription.trim());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          // Do NOT set Content-Type header manually; fetch will auto-generate
          // multipart/form-data with the correct boundary!
          Accept: 'application/json',
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON response from server (HTTP ${response.status}). Response: ${responseText.slice(0, 120)}`
        );
      }

      if (!response.ok) {
        const detailMsg = data?.detail || data?.message || `HTTP ${response.status} Error`;
        throw new Error(detailMsg);
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        throw new Error(
          `Request timed out after ${API_CONFIG.TIMEOUT_MS / 1000} seconds. Check if the backend is running at ${baseUrl}`
        );
      }

      // Network request failed
      if (err.message && err.message.toLowerCase().includes('network request failed')) {
        throw new Error(
          `Cannot connect to backend at ${baseUrl}.\n\nIf using a physical phone, ensure your phone and computer are on the same Wi-Fi and configure your computer's local IP address in Settings.`
        );
      }

      throw err;
    }
  },
};

