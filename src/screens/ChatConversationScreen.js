import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { colors } from '../constants/colors';
import { springConfigs, timingConfigs } from '../constants/animations';
import { chatConversationStyles } from '../styles/chatConversationStyles';

const ChatConversationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params || { user: { name: 'Kullanıcı' } };

  // Mock mesaj verisi
  const [messages, setMessages] = useState([
    { id: '1', text: 'Merhaba!', isMe: false, time: '10:00' },
    { id: '2', text: 'Selam, nasılsın?', isMe: true, time: '10:01' },
    { id: '3', text: 'İyiyim, teşekkürler. Sen?', isMe: false, time: '10:02' },
    { id: '4', text: 'Harikayım, müzik kutunu beğendim 🎵', isMe: true, time: '10:03' },
  ]);
  const [inputText, setInputText] = useState('');

  // Basit animasyonlar
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: timingConfigs.fadeIn.duration,
      useNativeDriver: true,
    }).start();
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isMe: true,
      time: 'Şimdi',
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        chatConversationStyles.messageBubble,
        item.isMe ? chatConversationStyles.myBubble : chatConversationStyles.theirBubble,
      ]}
    >
      <Text style={chatConversationStyles.messageText}>{item.text}</Text>
      <Text style={chatConversationStyles.timeText}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={chatConversationStyles.container}>
      {/* Header */}
      <View style={chatConversationStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={chatConversationStyles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={chatConversationStyles.headerTitle}>{user.name}</Text>
      </View>

      {/* Messages */}
      <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
        <FlatList
          data={messages}
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
        <TouchableOpacity style={chatConversationStyles.sendButton} onPress={sendMessage}>
          <Ionicons name="paper-plane" size={22} color={colors.white} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatConversationScreen; 