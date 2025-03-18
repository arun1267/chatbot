import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SmallTile from '../components/tiles/SmallTile';
import MediumTile from '../components/tiles/MediumTile';
import LargeTile from '../components/tiles/LargeTile';
import ConversationAnalytics from '../components/ConversationAnalytics';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeContext } from '../context/ThemeContext';
import { ConversationContext } from '../context/ConversationContext';
import apiService from '../api/apiService';
import '../styles/Dashboard.css';
import DailyVolumeChartComponent from '../components/charts/DailyVolumeChartComponent';
import { dailyCallVolumeByMonth } from '../api/mockData';
import ConversationTile from '../components/ConversationTile';

// Icons (you can replace these with actual icons)
const CallIcon = () => <span className="text-pink-500 dark:text-blue-400">📞</span>;
const DropIcon = () => <span className="text-red-500 dark:text-red-400">❌</span>;
const ConnectIcon = () => <span className="text-green-500 dark:text-green-400">✅</span>;

const Dashboard = () => {
  console.log('Dashboard component rendering');
  const navigate = useNavigate();
  
  // Wrap context usage in try/catch to debug potential context issues
  let darkMode, selectConversationById;
  try {
    const themeContext = useContext(ThemeContext);
    darkMode = themeContext?.darkMode;
    console.log('Theme context loaded, darkMode:', darkMode);
    
    const conversationContext = useContext(ConversationContext);
    selectConversationById = conversationContext?.selectConversationById;
    console.log('Conversation context loaded');
  } catch (error) {
    console.error('Error accessing context:', error);
  }
  
  const [dashboardData, setDashboardData] = useState(null);
  const [recentConversations, setRecentConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const clientName = "Chatbot Factory Analytics - BEFACH International"; // Add client name for header

  useEffect(() => {
    console.log('Dashboard useEffect running');
    
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    console.log('Is authenticated in Dashboard:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('User is not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data');
        setLoading(true);
        const data = await apiService.dashboard.getStats();
        console.log('Dashboard data received:', data);
        setDashboardData(data);
        
        // Fetch recent conversations separately
        try {
          console.log('Fetching recent conversations');
          const conversationsData = await apiService.conversations.getRecent();
          console.log('Recent conversations received:', conversationsData);
          
          // Add index to each conversation for reference
          const conversationsWithIndex = conversationsData.map((conversation, index) => ({
            ...conversation,
            index
          }));
          setRecentConversations(conversationsWithIndex);
        } catch (convErr) {
          console.error('Error fetching recent conversations:', convErr);
          // Don't fail the whole dashboard if just conversations fail
          setRecentConversations([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    console.log('Logout clicked');
    localStorage.removeItem('isAuthenticated');
    console.log('Authentication removed from localStorage');
    navigate('/login');
  };

  // Handle conversation tile click
  const handleConversationClick = (conversation) => {
    console.log("Dashboard: Conversation clicked, ID:", conversation.id);
    
    // Use window.location for direct navigation to ensure a fresh load
    window.location.href = `/conversation-insights?index=${conversation.index}`;
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <header className="flex justify-between items-center p-4 border-b shadow-sm" 
        style={{ 
          backgroundColor: 'var(--color-bg-primary)', 
          borderColor: darkMode ? '#2d3748' : '#e2e8f0',
          color: 'var(--color-text-primary)'
        }}>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{clientName}</h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity"
            style={{ 
              background: `linear-gradient(to right, var(--color-gradient-primary), var(--color-gradient-secondary))` 
            }}
          >
            Logout
          </button>
        </div>
      </header>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="p-4">
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
            Error loading dashboard data: {error}
          </div>
        </div>
      ) : (
        <>
          {/* Small tiles in a grid with exact widths */}
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <SmallTile 
                  title={
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-blue-500 text-xl">💬</span>
                      <span className="text-sm">Total Conversations</span>
                    </div>
                  }
                  value={
                    <div className="text-center mt-2">
                      {dashboardData?.total_calls || 0}
                    </div>
                  }
                />
              </div>
              <div>
                <SmallTile 
                  title={
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-sm">Completed</span>
                    </div>
                  }
                  value={
                    <div className="text-center mt-2">
                      {dashboardData?.calls_connected || 0}
                    </div>
                  }
                />
              </div>
              <div>
                <SmallTile 
                  title={
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-red-500 text-xl">⊘</span>
                      <span className="text-sm">Abandoned</span>
                    </div>
                  }
                  value={
                    <div className="text-center mt-2">
                      {dashboardData?.calls_dropped || 0}
                    </div>
                  }
                />
              </div>
              <div>
                <SmallTile 
                  title={
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-purple-500 text-xl">⏱</span>
                      <span className="text-sm">Average Length</span>
                    </div>
                  }
                  value={
                    <div className="text-center mt-2">
                      {`${Math.floor((dashboardData?.avg_duration || 0) / 60)}m ${(dashboardData?.avg_duration || 0) % 60}s`}
                    </div>
                  }
                />
              </div>
              <div>
                <SmallTile 
                  title={
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-yellow-500 text-xl">📊</span>
                      <span className="text-sm">Completion Rate</span>
                    </div>
                  }
                  value={
                    <div className="text-center mt-2">
                      {`${dashboardData?.success_rate || 0}%`}
                    </div>
                  }
                />
              </div>
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-4">
            <LargeTile title={<span className="text-gray-900 dark:text-white">Daily Volume</span>}>
              <div className="h-full w-full rounded-lg" 
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)',
                  overflow: 'hidden'
                }}>
                <DailyVolumeChartComponent data={dailyCallVolumeByMonth} />
              </div>
            </LargeTile>
            {/* <LargeTile title={<span className="text-gray-900 dark:text-white">Daily Volume</span>}>
              <div className="h-full w-full rounded-lg" 
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)',
                  overflow: 'hidden'
                }}>
                <DailyVolumeChartComponent data={dailyCallVolumeByMonth} />
              </div>
            </LargeTile> */}
          </div>

          <div className="p-4 mt-4">
            <ConversationAnalytics />
          </div>

          {/* Recent Conversations */}
          {/* {recentConversations.length > 0 && (
            <div className="p-4 mb-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Recent Conversations</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentConversations.map((conversation) => (
                  <div key={conversation.id}>
                    <ConversationTile 
                      conversation={conversation} 
                      index={conversation.index}
                      onClick={handleConversationClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

export default Dashboard; 