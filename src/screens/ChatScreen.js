import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Animated, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/colors';
import { springConfigs, timingConfigs, tabAnimationValues } from '../constants/animations';
import { chatScreenStyles } from '../styles/chatScreenStyles';

const ChatScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(tabAnimationValues.translate.left)).current;
  
  // Mock data - sohbet listesi
  const [chatList] = useState([
    { 
      id: 1, 
      name: 'Ayşe', 
      lastMessage: 'Box\'ını açtım, harika fotoğraf! 📸', 
      time: '2dk önce',
      isOnline: true, 
      avatar: '👩',
      unreadCount: 2 
    },
    { 
      id: 2, 
      name: 'Mehmet', 
      lastMessage: 'Yakında yeni box bıraktım, kontrol et', 
      time: '5dk önce',
      isOnline: false, 
      avatar: '👨',
      unreadCount: 0 
    },
    { 
      id: 3, 
      name: 'Zeynep', 
      lastMessage: 'Merhaba! Nasılsın?', 
      time: '1s önce',
      isOnline: true, 
      avatar: '👱‍♀️',
      unreadCount: 1 
    },
  ]);
  
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
    <TouchableOpacity style={chatScreenStyles.chatCard} activeOpacity={0.7}>
      <View style={chatScreenStyles.chatInfo}>
        <View style={chatScreenStyles.avatarContainer}>
          <Text style={chatScreenStyles.avatar}>{item.avatar}</Text>
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
        <TouchableOpacity style={chatScreenStyles.fab} activeOpacity={0.8}>
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ChatScreen; 
