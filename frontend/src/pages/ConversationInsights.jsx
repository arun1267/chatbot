import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { ConversationContext } from '../context/ConversationContext';
import ThemeToggle from '../components/ThemeToggle';
import ConversationTile from '../components/ConversationTile';
import { useLocation, useNavigate } from 'react-router-dom';

const ConversationInsights = () => {
  const { darkMode } = useContext(ThemeContext);
  const { 
    conversations, 
    selectedIndex, 
    selectedConversation, 
    conversationDetails, 
    loading, 
    detailsLoading, 
    error, 
    selectConversationByIndex 
  } = useContext(ConversationContext);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the index from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const urlIndex = queryParams.get('index') ? parseInt(queryParams.get('index'), 10) : null;
  
  // Update selected conversation when URL changes
  useEffect(() => {
    if (!loading && conversations.length > 0) {
      if (urlIndex !== null && urlIndex >= 0 && urlIndex < conversations.length) {
        // If we have a valid index in the URL, select that conversation
        selectConversationByIndex(urlIndex);
      } else {
        // If no valid index, select the first conversation and update URL
        selectConversationByIndex(0);
        navigate('/conversation-insights?index=0', { replace: true });
      }
    }
  }, [urlIndex, loading, conversations, navigate, selectConversationByIndex]);
  
  // Handle conversation selection
  const handleConversationSelect = (conversation) => {
    selectConversationByIndex(conversation.index);
    
    // Update URL without causing a page reload
    navigate(`/conversation-insights?index=${conversation.index}`, { replace: true });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };
  
  // Format quotes for display
  const formatQuotes = (quotes) => {
    if (!quotes || !Array.isArray(quotes) || quotes.length === 0) {
      return <p className="text-gray-500 dark:text-gray-400 text-left">No quotes available</p>;
    }
    
    return (
      <ul className="list-disc pl-5 space-y-1 text-left">
        {quotes.map((quote, index) => (
          <li key={index} className="text-sm text-gray-900 dark:text-white">{quote}</li>
        ))}
      </ul>
    );
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Format transcript for display
  const formatTranscript = (transcript) => {
    if (!transcript) {
      return <p className="text-gray-500 dark:text-gray-400 text-left">No transcript available</p>;
    }
    
    // Split the transcript by new lines
    const lines = transcript.split('\n');
    
    return (
      <div className="space-y-3">
        {lines.map((line, index) => {
          // Check if line starts with "System:" or "User:"
          if (line.startsWith('System:')) {
            return (
              <div key={index} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-md border-l-4 border-red-500 text-left">
                <p className="text-gray-900 dark:text-white">{line}</p>
              </div>
            );
          } else if (line.startsWith('User:')) {
            return (
              <div key={index} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-md border-l-4 border-green-500 text-left">
                <p className="text-gray-900 dark:text-white">{line}</p>
              </div>
            );
          } else if (line.trim() === '') {
            // Skip empty lines
            return null;
          } else {
            // For other lines (continuation of previous speaker)
            return (
              <div key={index} className="pl-4 text-left">
                <p className="text-gray-900 dark:text-white">{line}</p>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <header className="flex justify-between items-center p-4 border-b shadow-sm" 
        style={{ 
          backgroundColor: 'var(--color-bg-primary)', 
          borderColor: darkMode ? '#2d3748' : '#e2e8f0',
          color: 'var(--color-text-primary)'
        }}>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Conversation Insights</h1>
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
      
      <div className="container mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-4">
            Error: {error}
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md p-6 tile-glow"
            style={{ 
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)'
            }}>
            <p className="text-lg text-center text-gray-500 dark:text-gray-400">
              No conversation data available. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Conversation List */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md p-4 tile-glow"
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)'
                }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Recent Conversations</h2>
                
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id} 
                      className={`cursor-pointer transition-colors ${selectedConversation?.id === conversation.id ? 'ring-2 ring-primary-500' : ''}`}
                    >
                      <ConversationTile 
                        conversation={conversation} 
                        index={conversation.index} 
                        onClick={handleConversationSelect}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Conversation Details */}
            <div className="md:col-span-2">
              {selectedConversation ? (
                <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md p-6 tile-glow"
                  style={{ 
                    backgroundColor: 'var(--color-bg-primary)',
                    color: 'var(--color-text-primary)'
                  }}>
                  {detailsLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
                    </div>
                  ) : conversationDetails ? (
                    <div>
                      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Conversation Details</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Overview */}
                        <div>
                          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Overview</h3>
                          <div className="space-y-2 text-left">
                            <p><span className="font-medium text-gray-700 dark:text-gray-300">Beneficiary:</span> <span style={{ color: 'var(--color-text-primary)' }}>{conversationDetails.person_name}</span></p>
                            <p><span className="font-medium text-gray-700 dark:text-gray-300">Case Worker:</span> <span style={{ color: 'var(--color-text-primary)' }}>{conversationDetails.agent_name}</span></p>
                            <p><span className="font-medium text-gray-700 dark:text-gray-300">Topic:</span> <span style={{ color: 'var(--color-text-primary)' }}>{conversationDetails.topic}</span></p>
                            <p><span className="font-medium text-gray-700 dark:text-gray-300">Date:</span> <span style={{ color: 'var(--color-text-primary)' }}>{formatTimestamp(conversationDetails.start_time)}</span></p>
                            <p><span className="font-medium text-gray-700 dark:text-gray-300">Duration:</span> <span style={{ color: 'var(--color-text-primary)' }}>{Math.floor(conversationDetails.duration_seconds / 60)}m {conversationDetails.duration_seconds % 60}s</span></p>
                          </div>
                        </div>
                        
                        {/* Analysis */}
                        <div>
                          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Analysis</h3>
                          <div className="space-y-2 text-left">
                            <p className="flex items-center">
                              <span className="font-medium text-gray-700 dark:text-gray-300">Sentiment:</span> 
                              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                                conversationDetails.sentiment === 'Positive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                conversationDetails.sentiment === 'Negative' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                {conversationDetails.sentiment}
                              </span>
                            </p>
                            
                            <p className="text-left">
                              <span className="font-medium text-gray-700 dark:text-gray-300">Feedback Type:</span> 
                              <span style={{ color: 'var(--color-text-primary)' }}> {conversationDetails.feedback_type.replace('_', ' ')}</span>
                            </p>
                            
                            <p className="flex items-center">
                              <span className="font-medium text-gray-700 dark:text-gray-300">Impact:</span> 
                              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                                conversationDetails.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                conversationDetails.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {conversationDetails.impact}
                              </span>
                            </p>
                            
                            {conversationDetails.flags && (
                              <p className="flex items-center">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Flags:</span> 
                                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                                  conversationDetails.flags === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                  conversationDetails.flags === 'follow-up' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                }`}>
                                  {conversationDetails.flags}
                                </span>
                              </p>
                            )}
                            
                            <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-md border border-yellow-200 dark:border-yellow-800 text-left">
                              <p className="font-medium text-gray-800 dark:text-yellow-200">Suggested Action:</p>
                              <p style={{ color: 'var(--color-text-primary)' }}>{conversationDetails.suggested_action}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Supporting Quotes */}
                      <div className="mb-6">
                        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Supporting Quotes</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                          {formatQuotes(conversationDetails.supporting_quotes)}
                        </div>
                      </div>
                      
                      {/* Transcript */}
                      <div className="mb-6">
                        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Transcript</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg max-h-80 overflow-y-auto shadow-sm">
                          {formatTranscript(conversationDetails.transcript)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <p className="text-lg text-center text-gray-500 dark:text-gray-400">
                        No details available for this conversation
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md p-6 tile-glow flex items-center justify-center h-64"
                  style={{ 
                    backgroundColor: 'var(--color-bg-primary)',
                    color: 'var(--color-text-primary)'
                  }}>
                  <p className="text-lg text-center text-gray-500 dark:text-gray-400">
                    Select a conversation from the list to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationInsights; 