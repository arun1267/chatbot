import { API_ENDPOINTS, ENV } from './config';
import { 
  dashboardStats, 
  conversationInsights, 
  conversationDetails,
  callMetrics,
  dailyCallVolumeByMonth,
  mockAnalytics,
  mockConversations
} from './mockData';

// Error handling helper
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

// Helper to simulate API delay for mock data
const mockDelay = (data) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, 500); // Simulate network delay
  });
};

// API service object with methods for different API calls
const apiService = {
  // Authentication methods
  auth: {
    login: async (credentials) => {
      if (ENV.USE_MOCK_DATA) {
        // Simple mock login that accepts any credentials
        await mockDelay(null);
        return { success: true, token: 'mock-token-12345' };
      }
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      return handleResponse(response);
    },
    
    signup: async (userData) => {
      if (ENV.USE_MOCK_DATA) {
        await mockDelay(null);
        return { success: true, message: 'Account created successfully' };
      }
      
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
    
    logout: async () => {
      if (ENV.USE_MOCK_DATA) {
        await mockDelay(null);
        return { success: true };
      }
      
      const response = await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },
  
  // Dashboard data methods
  dashboard: {
    getStats: async () => {
      if (ENV.USE_MOCK_DATA) {
        return mockDelay(dashboardStats);
      }
      
      const response = await fetch(API_ENDPOINTS.DASHBOARD_STATS, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
    
    getCallMetrics: async (timeRange = 'daily') => {
      if (ENV.USE_MOCK_DATA) {
        const mockMetrics = callMetrics[timeRange] || callMetrics.daily;
        return mockDelay(mockMetrics);
      }
      
      const url = new URL(API_ENDPOINTS.CALL_METRICS);
      if (timeRange) {
        url.searchParams.append('timeRange', timeRange);
      }
      
      const response = await fetch(url, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
    
    getDailyCallVolume: async () => {
      if (ENV.USE_MOCK_DATA) {
        return mockDelay(dailyCallVolumeByMonth);
      }
      
      const response = await fetch(API_ENDPOINTS.DAILY_CALL_VOLUME, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },
  
  // Conversation data methods
  conversations: {
    getInsights: async () => {
      if (ENV.USE_MOCK_DATA) {
        // Add index to each conversation for reference
        const conversationsWithIndex = conversationInsights.map((conversation, index) => ({
          ...conversation,
          index
        }));
        return mockDelay(conversationsWithIndex);
      }
      
      const response = await fetch(API_ENDPOINTS.CONVERSATION_INSIGHTS, {
        credentials: 'include',
      });
      const data = await handleResponse(response);
      
      // Add index to each conversation for reference
      return data.map((conversation, index) => ({
        ...conversation,
        index
      }));
    },
    
    getRecent: async (limit = 5) => {
      if (ENV.USE_MOCK_DATA) {
        // Return a subset of the conversation insights as recent conversations
        const recentConversations = conversationInsights
          .slice(0, limit)
          .map((conversation, index) => ({
            ...conversation,
            index
          }));
        return mockDelay(recentConversations);
      }
      
      const url = new URL(API_ENDPOINTS.CONVERSATION_INSIGHTS);
      url.searchParams.append('limit', limit);
      url.searchParams.append('recent', true);
      
      const response = await fetch(url, {
        credentials: 'include',
      });
      const data = await handleResponse(response);
      
      // Add index to each conversation for reference
      return data.map((conversation, index) => ({
        ...conversation,
        index
      }));
    },
    
    getDetails: async (conversationId) => {
      if (ENV.USE_MOCK_DATA) {
        const detail = conversationDetails.find(d => d.conversation_id === conversationId);
        return mockDelay(detail || conversationDetails[0]);
      }
      
      const url = new URL(API_ENDPOINTS.CONVERSATION_DETAILS);
      url.searchParams.append('id', conversationId);
      
      const response = await fetch(url, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },
  
  // User data methods
  user: {
    getProfile: async () => {
      if (ENV.USE_MOCK_DATA) {
        return mockDelay({
          id: 'user-001',
          name: 'Demo User',
          email: 'demo@example.com',
          role: 'admin',
          created_at: '2023-01-15T10:30:00Z'
        });
      }
      
      const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
    
    updateProfile: async (profileData) => {
      if (ENV.USE_MOCK_DATA) {
        return mockDelay({
          ...profileData,
          updated_at: new Date().toISOString()
        });
      }
      
      const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        credentials: 'include',
      });
      return handleResponse(response);
    },
  },
};

export const fetchChatAnalytics = async () => {
  // Simulating API call
  return mockAnalytics;
};

export const fetchConversationHistory = async () => {
  // Simulating API call
  return mockConversations;
};

export default apiService; 