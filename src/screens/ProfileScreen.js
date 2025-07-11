import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, Alert, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);
  const [isAvatarOptionsVisible, setAvatarOptionsVisible] = useState(false);
  // Glow animasyonu
  const glowAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  // Gönderiler bölümü için ekran genişliği, boyut ve veri dizisi
  const { width } = Dimensions.get('window');
  const imageSize = (width - 32) / 3;
  const posts = [
    // require('../../assets/IMG_5176.png'), // HATA: Bu resim dosyası bulunamadı.
  ];
  // Kullanıcı istatistikleri (örnek sayılar, gerçek veri ile değiştirilmeli)
  const friendsCount = 128;
  const collagesCount = 24;
  // Sekme durumu: 'posts' veya 'collages'
  const [activeTab, setActiveTab] = useState('posts');
  // Collage verileri (örnek, gerçek verilerle değiştirilmeli)
  const collages = posts;
  // Gösterilen öğeler: aktif sekmeye göre posts veya collages
  const displayedItems = activeTab === 'posts' ? posts : collages;
  // Slider animasyonu için değer
  const sliderAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(sliderAnim, {
      toValue: activeTab === 'posts' ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>  
      <View style={styles.header}>  
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={{ width: 48 }} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Animated.View style={[
          styles.avatarContainer,
          {
            borderWidth: 3,
            borderColor: colors.white,
            shadowColor: colors.white,
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [5, 15] }),
            shadowOpacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.6] }),
            transform: [{ scale: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }) }],
            elevation: 10,
          },
        ]}>
          <TouchableOpacity onPress={() => setAvatarOptionsVisible(true)} style={{ flex: 1 }}>
            <Image source={require('../../assets/profile_avatar.png')} style={styles.avatar} />
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.name}>{user ? user.name : 'Kullanıcı'}</Text>
        {/* Konum bilgisi */}
        <TouchableOpacity style={styles.locationContainer} onPress={() => navigation.navigate('Map')}>
          <Ionicons name="location-sharp" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
          <Text style={styles.locationText}>İstanbul, İstanbul, Beşiktaş {'>'}</Text>
        </TouchableOpacity>
        {/* Kullanıcı istatistikleri */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>{user ? user.postsCount : 0}</Text>
            <Text style={styles.statLabel}>Gönderi</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>{user ? user.friendsCount : 0}</Text>
            <Text style={styles.statLabel}>Arkadaş</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>{user ? user.collagesCount : 0}</Text>
            <Text style={styles.statLabel}>Kolaj</Text>
          </View>
        </View>
        {/* Avatar seçenekleri */}
        <Modal visible={isAvatarOptionsVisible} transparent animationType="fade" onRequestClose={() => setAvatarOptionsVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setAvatarOptionsVisible(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View style={styles.avatarOptionsBox}>
            <TouchableOpacity onPress={() => { setAvatarOptionsVisible(false); navigation.navigate('ProfileEdit'); }} style={styles.avatarOptionItem}>
              <Text style={styles.avatarOptionText}>Profil Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setAvatarOptionsVisible(false); Alert.alert('Profil Fotoğrafı', 'Profil fotoğrafını değiştirme özelliği henüz hazır değil.'); }} style={styles.avatarOptionItem}>
              <Text style={styles.avatarOptionText}>Profil Fotoğrafını Değiştir</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/* Gönderi sekmeleri: grid ve kolaj ikonları */}
        <View style={styles.postsToggle}>
          <TouchableOpacity onPress={() => setActiveTab('posts')}>
            <Ionicons name="grid-outline" size={24} color={activeTab === 'posts' ? colors.textPrimary : colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('collages')}>
            <Ionicons name="albums-outline" size={24} color={activeTab === 'collages' ? colors.textPrimary : colors.textSecondary} />
          </TouchableOpacity>
        </View>
        {/* İçerik slider'ı: gönderiler ve kolaj */}
        <View style={styles.sliderWrapper}>
          <Animated.View style={[styles.sliderContainer, {
            width: width * 2,
            transform: [{
              translateX: sliderAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -width] })
            }]
          }]}>  
            {/* Gönderiler */}
            <View style={{ width: width }}>
              <View style={styles.postsGrid}>
                {posts.map((post, idx) => (
                  <Image key={idx} source={post} style={[styles.postImage, { width: imageSize, height: imageSize }]} />
                ))}
              </View>
            </View>
            {/* Kolaj placeholder */}
            <View style={{ width: width }}>
              <View style={styles.collagesContainer}>
                <Text style={styles.collagePlaceholder}>Yeni boxlar bırak{"\n"}Yeni kolajlar oluştur</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backBlack,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceGrey,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineGrey,
  },
  closeButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.surfaceGrey,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    // artık kullanılmıyor
  },
  locationContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  optionList: {
    width: '100%',
  },
  optionItem: {
    paddingVertical: 12,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  bubbleContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  bubbleButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bubbleText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  avatarOptionsBox: {
    position: 'absolute',
    top: 150,
    alignSelf: 'center',
    backgroundColor: colors.surfaceGrey,
    borderRadius: 8,
    paddingVertical: 8,
    width: '80%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  avatarOptionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatarOptionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  postsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  postImage: {
    // Gönderiler arasında net çizgiler için border
    borderWidth: 1,
    borderColor: colors.outlineGrey,
  },
  // Slider wrapper için görünümü kırpmak ve dolgu vermek
  sliderWrapper: {
    width: '100%',
    overflow: 'hidden',
    marginBottom: 16,
  },
  // Slider içeriği yatayda yan yana
  sliderContainer: {
    flexDirection: 'row',
  },
  // Kolaj placeholder kutusu
  collagesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  collagePlaceholder: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  postsToggle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
}); 