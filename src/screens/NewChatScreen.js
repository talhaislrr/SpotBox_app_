import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constants/colors';
import { chatScreenStyles } from '../styles/chatScreenStyles';
import { getMyFriends, acceptFriendRequest, rejectFriendRequest, sendFriendRequest } from '../services/apiUsers';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

const NewChatScreen = () => {
  const navigation = useNavigation();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { startConversation } = useContext(ChatContext);

  // Arkadaş listesini yükleyen fonksiyon
  const loadFriends = async () => {
    setLoading(true);
    try {
      const data = await getMyFriends();
      console.log('Arkadaş listesi API cevabı:', data);
      setFriends(data);
    } catch (error) {
      console.error('Arkadaş listesi yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backBlack }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 16, fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>
          Yeni Mesaj
        </Text>
      </View>
      {loading && !refreshing ? (
        <Text style={{ color: colors.textSecondary, alignSelf: 'center', marginTop: 20 }}>
          Yükleniyor...
        </Text>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          data={friends}
          keyExtractor={(item) => item.id?.toString() || item._id?.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                chatScreenStyles.friendItem,
                {
                  backgroundColor: colors.surfaceGrey,
                  borderRadius: 12,
                  marginVertical: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: colors.outlineGrey,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 4,
                },
              ]}
              onPress={async () => {
                try {
                  const conv = await startConversation(item.id || item._id);
                  // Başlatılan sohbeti NewChat listesinden kaldır
                  setFriends(prev => prev.filter(f => (f.id || f._id) !== (item.id || item._id)));
                  navigation.navigate('ChatConversation', { conversationId: conv._id, user: item });
                } catch (error) {
                  console.error('Konuşma başlatılamadı:', error);
                }
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, marginRight: 12, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 16 }}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={[chatScreenStyles.friendItemText, { fontSize: 18, fontWeight: '600', color: colors.textPrimary }]}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          onRefresh={async () => {
            setRefreshing(true);
            await loadFriends();
            setRefreshing(false);
          }}
          refreshing={refreshing}
          ListEmptyComponent={() => (
            <Text style={{ color: colors.textSecondary, alignSelf: 'center', marginTop: 20 }}>
              Henüz arkadaş bulunamadı.
            </Text>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default NewChatScreen; 