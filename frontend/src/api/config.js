// Environment configuration
const getEnvVariable = (name, defaultValue) => {
  try {
    // Check if window._env_ exists (sometimes used for runtime env variables)
    if (typeof window !== 'undefined' && window._env_ && window._env_[name]) {
      return window._env_[name];
    }
    
    // Check if process.env exists (standard Create React App approach)
    if (typeof process !== 'undefined' && process.env && process.env[name]) {
      return process.env[name];
    }
  } catch (e) {
    console.warn(`Error accessing environment variable ${name}:`, e);
  }
  
  // Return default if nothing else works
  return defaultValue;
};

// Determine if we're in production
const isProduction = getEnvVariable('REACT_APP_ENVIRONMENT', 'local') === 'production' ||
                    getEnvVariable('NODE_ENV', 'development') === 'production';

// Environment settings
export const ENV = {
  ENVIRONMENT: getEnvVariable('REACT_APP_ENVIRONMENT', 'local'),
  USE_MOCK_DATA: getEnvVariable('REACT_APP_USE_MOCK_DATA', (!isProduction).toString()) === 'true',
  IS_PRODUCTION: isProduction
};

// API base URL configuration
const API_BASE_URL = getEnvVariable('REACT_APP_API_URL', 'http://localhost:8000');

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Dashboard data
  DASHBOARD_STATS: `${API_BASE_URL}/dashboard/stats`,
  CALL_METRICS: `${API_BASE_URL}/dashboard/call-metrics`,
  
  // Conversation data
  CONVERSATION_INSIGHTS: `${API_BASE_URL}/conversation-insights`,
  CONVERSATION_DETAILS: `${API_BASE_URL}/conversation-details`,
  
  // User data
  USER_PROFILE: `${API_BASE_URL}/user/profile`,
  
  // Add to API_ENDPOINTS
  DAILY_CALL_VOLUME: `${API_BASE_URL}/dashboard/daily-call-volume`,
};

export default API_BASE_URL; 