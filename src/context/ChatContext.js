import React, { createContext, useState, useContext, useEffect } from 'react';
import { getConversations, getMessages, sendMessageApi, createConversation } from '../services/apiChat';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext({
  conversations: [],
  messages: {},
  loadConversations: () => {},
  loadMessages: () => {},
  sendMessage: () => {},
  startConversation: () => {},
});

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});

  const loadConversations = async () => {
    if (!user) return;
    try {
      const convs = await getConversations();
      setConversations(convs);
    } catch (error) {
      console.error('Konuşmalar yüklenemedi:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const msgs = await getMessages(conversationId);
      setMessages(prev => ({ ...prev, [conversationId]: msgs }));
    } catch (error) {
      console.error('Mesajlar yüklenemedi:', error);
    }
  };

  const sendMessage = async (conversationId, text) => {
    try {
      const msg = await sendMessageApi(conversationId, text);
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId]||[]), msg]
      }));
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
    }
  };

  const startConversation = async (participantId) => {
    try {
      const conv = await createConversation(participantId);
      // Konuşma oluşturulduktan sonra güncel konuşmaları tekrar yükle
      await loadConversations();
      return conv;
    } catch (error) {
      console.error('Konuşma başlatılamadı:', error);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  return (
    <ChatContext.Provider value={{ conversations, messages, loadConversations, loadMessages, sendMessage, startConversation }}>
      {children}
    </ChatContext.Provider>
  );
}; 