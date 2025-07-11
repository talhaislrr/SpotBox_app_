import React, { useState, useRef, useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChatContext } from '../context/ChatContext';

import { colors } from '../constants/colors';
import { springConfigs, timingConfigs } from '../constants/animations';
import { chatConversationStyles } from '../styles/chatConversationStyles';
const headerImageCopy = require('../../assets/image copy.png');
const messageImageCopy2 = require('../../assets/image copy 2.png');

const ChatConversationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { conversations, messages: allMessages, loadMessages, sendMessage } = useContext(ChatContext);
  const { conversationId, user } = route.params;
  const [inputText, setInputText] = useState('');

  // Basit animasyonlar
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: timingConfigs.fadeIn.duration, useNativeDriver: true }).start();
  }, []);
  
  // Mesajları yükle
  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId);
    }
  }, [conversationId]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    try {
      await sendMessage(conversationId, inputText.trim());
      setInputText('');
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      chatConversationStyles.messageContainer,
      item.isMe ? chatConversationStyles.myMessageContainer : chatConversationStyles.theirMessageContainer,
      !item.isMe && { flexDirection: 'column', alignItems: 'flex-start' }
    ]}>
      {!item.isMe && (
        <View style={[
          chatConversationStyles.messageAvatarContainer,
          user.name === 'Durul' && { backgroundColor: 'transparent' }
        ]}>
          <Image 
            source={user.name === 'Durul' ? messageImageCopy2 : user.avatar} 
            style={[
              chatConversationStyles.messageAvatar,
              user.name === 'Durul' && { backgroundColor: 'transparent' }
            ]}
            resizeMode="cover"
          />
        </View>
      )}
      <View
        style={[
          chatConversationStyles.messageBubble,
          item.isMe ? chatConversationStyles.myBubble : chatConversationStyles.theirBubble,
        ]}
      >
        <Text style={chatConversationStyles.messageText}>{item.text}</Text>
        <Text style={chatConversationStyles.timeText}>{item.time}</Text>
      </View>
    </View>
  );

  // Raw mesajları uygun formata çevir
  const chatMessages = (allMessages[conversationId] || []).map(m => ({
    id: m._id,
    text: m.text,
    isMe: m.senderId === user.id,
    time: new Date(m.timestamp).toLocaleTimeString(),
  }));
  
  return (
    <SafeAreaView style={chatConversationStyles.container}>
      {/* Header */}
      <View style={chatConversationStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={chatConversationStyles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={[
          chatConversationStyles.avatarContainer,
          user.name === 'Durul' && { backgroundColor: 'transparent' }
        ]}>
          <Image 
            source={user.name === 'Durul' ? headerImageCopy : user.avatar} 
            style={[
              chatConversationStyles.headerAvatar,
              user.name === 'Durul' && { backgroundColor: 'transparent' }
            ]}
            resizeMode="cover"
          />
        </View>
        
        <View style={chatConversationStyles.userInfoContainer}>
          <Text style={chatConversationStyles.headerTitle}>{user.name}</Text>
          <Text style={chatConversationStyles.lastSeenText}>
            {user.isOnline ? 'Çevrimiçi' : 'Son görülme: 5dk önce'}
          </Text>
        </View>
        
        <View style={chatConversationStyles.headerButtons}>
          <TouchableOpacity style={chatConversationStyles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>  
        <FlatList
          data={chatMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={chatConversationStyles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
        style={chatConversationStyles.inputBar}
      >
        <TouchableOpacity style={chatConversationStyles.plusButton}>
          <Ionicons name="add" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TextInput
          style={chatConversationStyles.textInput}
          placeholder="Mesaj yaz..."
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={chatConversationStyles.sendButton} onPress={handleSend}>
          <Ionicons name="paper-plane" size={22} color={colors.white} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatConversationScreen; 