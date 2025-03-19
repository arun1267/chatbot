import React, { createContext, useState, useEffect, useRef } from 'react';
import apiService from '../api/apiService';

export const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationDetails, setConversationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Cache for conversation details to avoid redundant API calls
  const detailsCache = useRef(new Map());
  
  // Fetch all conversations on initial load
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
        
        // If we have conversations, select the first one by default
        if (conversationsWithIndex.length > 0) {
          setSelectedConversation(conversationsWithIndex[0]);
          fetchConversationDetails(conversationsWithIndex[0].id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  
  // Fetch conversation details
  const fetchConversationDetails = async (conversationId) => {
    try {
      // Check if we already have the details cached
      if (detailsCache.current.has(conversationId)) {
        setConversationDetails(detailsCache.current.get(conversationId));
        return;
      }
      
      setDetailsLoading(true);
      const details = await apiService.conversations.getDetails(conversationId);
      
      // Cache the details for future use
      detailsCache.current.set(conversationId, details);
      
      setConversationDetails(details);
      setDetailsLoading(false);
    } catch (err) {
      console.error('Error fetching conversation details:', err);
      setError(err.message);
      setDetailsLoading(false);
    }
  };
  
  // Select a conversation by index
  const selectConversationByIndex = (index) => {
    if (index >= 0 && index < conversations.length) {
      setSelectedIndex(index);
      setSelectedConversation(conversations[index]);
      fetchConversationDetails(conversations[index].id);
    }
  };
  
  // Select a conversation by id
  const selectConversationById = (id) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setSelectedIndex(conversation.index);
      setSelectedConversation(conversation);
      fetchConversationDetails(id);
    }
  };
  
  return (
    <ConversationContext.Provider
      value={{
        conversations,
        selectedIndex,
        selectedConversation,
        conversationDetails,
        loading,
        detailsLoading,
        error,
        selectConversationByIndex,
        selectConversationById
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}; 