import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import ConversationTile from './ConversationTile';
import apiService from '../api/apiService';
import '../styles/ConversationAnalytics.css';
import { useNavigate } from 'react-router-dom';

const ConversationAnalytics = () => {
  const { darkMode } = useContext(ThemeContext);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await apiService.conversations.getInsights();
        
        // Add index to each conversation for reference
        const conversationsWithIndex = data.map((conversation, index) => ({
          ...conversation,
          index
        }));
        
        setConversations(conversationsWithIndex);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  
  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    // Navigate to the conversation insights page with the conversation index
    // window.location.href = `/conversation-insights?index=${conversation.index}`;
    navigate(`/conversation-insights?index=${conversation.index}`, { replace: true });
  };

  return (
    <div className="rounded-lg shadow-md p-6 tile-glow" 
      style={{ 
        background: `linear-gradient(to right, ${darkMode ? 'rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8)' : 'rgba(243, 232, 255, 0.5), rgba(252, 231, 243, 0.5)'})`,
        color: 'var(--color-text-primary)'
      }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Recent Conversations</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-4">
          Error loading conversations: {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {conversations.map((conversation, index) => (
            <ConversationTile 
              key={conversation.id} 
              conversation={conversation} 
              index={index}
              onClick={() => handleConversationClick(conversation)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationAnalytics; 