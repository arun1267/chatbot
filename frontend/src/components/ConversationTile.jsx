import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/Tiles.css';
import { useNavigate } from 'react-router-dom';

const ConversationTile = ({ conversation, index, onClick }) => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  // Format duration from seconds to minutes and seconds
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  // Format timestamp to readable date/time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    // Check if date is yesterday
    else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    // Otherwise return full date
    else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
        `, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };
  
  // Determine sentiment styling
  const getSentimentStyle = () => {
    switch(conversation.sentiment.toLowerCase()) {
      case 'positive':
        return {
          bg: darkMode ? 'bg-green-900' : 'bg-green-100',
          text: darkMode ? 'text-green-200' : 'text-green-800',
          border: darkMode ? 'border-green-700' : 'border-green-200'
        };
      case 'negative':
        return {
          bg: darkMode ? 'bg-red-900' : 'bg-red-100',
          text: darkMode ? 'text-red-200' : 'text-red-800',
          border: darkMode ? 'border-red-700' : 'border-red-200'
        };
      case 'neutral':
        return {
          bg: darkMode ? 'bg-blue-900' : 'bg-blue-100',
          text: darkMode ? 'text-blue-200' : 'text-blue-800',
          border: darkMode ? 'border-blue-700' : 'border-blue-200'
        };
      default:
        return {
          bg: darkMode ? 'bg-gray-800' : 'bg-gray-100',
          text: darkMode ? 'text-gray-200' : 'text-gray-800',
          border: darkMode ? 'border-gray-700' : 'border-gray-200'
        };
    }
  };
  
  // Determine impact styling
  const getImpactStyle = () => {
    if (!conversation.impact) return null;
    
    switch(conversation.impact.toLowerCase()) {
      case 'high':
        return {
          bg: darkMode ? 'bg-red-900' : 'bg-red-100',
          text: darkMode ? 'text-red-200' : 'text-red-800'
        };
      case 'medium':
        return {
          bg: darkMode ? 'bg-yellow-900' : 'bg-yellow-100',
          text: darkMode ? 'text-yellow-200' : 'text-yellow-800'
        };
      case 'low':
        return {
          bg: darkMode ? 'bg-blue-900' : 'bg-blue-100',
          text: darkMode ? 'text-blue-200' : 'text-blue-800'
        };
      default:
        return {
          bg: darkMode ? 'bg-gray-800' : 'bg-gray-100',
          text: darkMode ? 'text-gray-200' : 'text-gray-800'
        };
    }
  };
  
  const sentimentStyle = getSentimentStyle();
  const impactStyle = getImpactStyle();
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Tile clicked, using onClick handler");
    
    // Always use the onClick handler if provided
    if (onClick) {
      onClick(conversation);
    }
  };
  
  return (
    <div 
      className="conversation-tile tile-glow rounded-lg p-4 cursor-pointer transition-all duration-200"
      style={{ 
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        borderLeft: `4px solid ${conversation.sentiment.toLowerCase() === 'positive' 
          ? 'var(--color-sentiment-positive)' 
          : conversation.sentiment.toLowerCase() === 'negative' 
            ? 'var(--color-sentiment-negative)' 
            : 'var(--color-sentiment-neutral)'}`
      }}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg" style={{ color: 'var(--color-text-primary)' }}>{conversation.person_name}</h3>
        <div className="flex space-x-1">
          {conversation.flags && (
            <span className="px-1 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {conversation.flags}
            </span>
          )}
          <span 
            className={`px-2 py-1 text-xs rounded-full ${sentimentStyle.bg} ${sentimentStyle.text} border ${sentimentStyle.border}`}
          >
            {conversation.sentiment}
          </span>
        </div>
      </div>
      
      <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>{conversation.summary}</p>
      
      {conversation.supporting_quote && (
        <p className="text-xs italic mb-3 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
          "{conversation.supporting_quote}"
        </p>
      )}
      
      <div className="flex justify-between items-center text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
        <span>{conversation.start_time ? formatTimestamp(conversation.start_time) : ''}</span>
        <div className="flex items-center space-x-2">
          {conversation.impact && (
            <span className={`px-1.5 py-0.5 text-xs rounded-full ${impactStyle.bg} ${impactStyle.text}`}>
              {conversation.impact}
            </span>
          )}
          <span>{conversation.duration_seconds ? formatDuration(conversation.duration_seconds) : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default ConversationTile; 