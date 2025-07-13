import React, { useEffect, useRef, useContext } from 'react';
import { SafeAreaView, Animated, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

import { colors, colorCombinations } from '../constants/colors';
import { springConfigs, timingConfigs, tabAnimationValues } from '../constants/animations';
import { chatScreenStyles } from '../styles/chatScreenStyles';

// Mimoji imports
const mimojiDurul = require('../../assets/mimoji_durul.png');
const mimojiBlue = require('../../assets/mimoji_blue.png');
const imageCopy = require('../../assets/mimoji_durul.png');

const ChatScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(tabAnimationValues.translate.left)).current;
  
  const { user: authUser } = useContext(AuthContext);
  const { conversations, messages, loadConversations } = useContext(ChatContext);

  useEffect(() => {
    loadConversations();
  }, []);

  const chatList = conversations.map(conv => {
    const convId = conv._id.toString();
    const other = conv.participants.find(p => p._id.toString() !== authUser._id.toString());
    const lastMsgs = messages[convId] || [];
    const last = lastMsgs[lastMsgs.length - 1];
    return {
      id: convId,
      name: other.name,
      avatar: other.avatar || mimojiBlue,
      lastMessage: last ? last.text : 'Yeni sohbet',
      time: last ? new Date(last.timestamp).toLocaleTimeString() : '',
      isOnline: other.isOnline, // optional
      unreadCount: 0, // implement unread later
    };
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: timingConfigs.slideIn.duration,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        ...springConfigs.medium,
      }),
    ]).start();
  }, []);

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={chatScreenStyles.chatCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ChatConversation', { conversationId: item.id, user: item })}
    >
      <View style={chatScreenStyles.chatInfo}>
        <View style={chatScreenStyles.avatarContainer}>
          <View style={[
            chatScreenStyles.avatar,
            item.name === 'Durul' && { backgroundColor: 'transparent' }
          ]}>
            <Image 
              source={item.avatar} 
              style={[
                chatScreenStyles.avatarImage,
                (item.name === 'Ayşe' || item.name === 'Durul') && { 
                  width: 36, 
                  height: 36, 
                  borderRadius: 18,
                  marginHorizontal: 6,
                  marginVertical: 6
                }
              ]}
              resizeMode="cover"
              onLoad={() => console.log(`Avatar yüklendi: ${item.name}`)}
              onError={(error) => console.log(`Avatar yükleme hatası: ${item.name}`, error)}
            />
          </View>
          {item.isOnline && <View style={chatScreenStyles.onlineIndicator} />}
        </View>
        <View style={chatScreenStyles.chatDetails}>
          <Text style={chatScreenStyles.chatName}>{item.name}</Text>
          <Text style={chatScreenStyles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
        </View>
      </View>
      <View style={chatScreenStyles.chatMeta}>
        <Text style={chatScreenStyles.chatTime}>{item.time}</Text>
        {item.unreadCount > 0 && (
          <View style={chatScreenStyles.unreadBadge}>
            <Text style={chatScreenStyles.unreadCount}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={chatScreenStyles.container}>
      <Animated.View
        style={[
          { flex: 1 },
          chatScreenStyles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={chatScreenStyles.header}>
          <Text style={chatScreenStyles.title}>Chat</Text>
        </View>

        {/* Content */}
        <View style={chatScreenStyles.listContainer}>
          <FlatList
            data={chatList}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={chatScreenStyles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={48} color={colors.textLight} />
                <Text style={chatScreenStyles.emptyText}>Henüz sohbet yok</Text>
                <Text style={chatScreenStyles.emptySubtext}>Yakındaki biriyle sohbet başlat!</Text>
              </View>
            }
          />
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity style={chatScreenStyles.fab} activeOpacity={0.8} onPress={() => navigation.navigate('NewChat')}>
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ChatScreen;