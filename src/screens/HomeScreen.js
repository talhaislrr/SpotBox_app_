import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, StatusBar, Alert, Animated, TouchableOpacity, SafeAreaView, Modal, Text, TextInput, StyleSheet, Platform, Dimensions, Image, FlatList, useWindowDimensions } from 'react-native';
// CloudImage kullanımı kaldırıldı; native Image bileşeni ile URL’den gösteriliyor
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Circle, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import throttle from 'lodash.throttle';

import { colors } from '../constants/colors';
import { defaultRegions } from '../constants/mapStyles';
import { springConfigs, timingConfigs } from '../constants/animations';
import { homeScreenStyles } from '../styles/homeScreenStyles';
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest, sendFriendRequest } from '../services/apiUsers';
import { BoxesContext } from '../context/BoxesContext';

const generateHtml = (lat, lng, styleJson) => `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, width=device-width, height=device-height, user-scalable=no" />
    <style>html,body,#map{margin:0;padding:0;height:100%;}</style>
    <script>
      function init(){
        const map=new google.maps.Map(document.getElementById('map'),{
          center:{lat:${lat},lng:${lng}},
          zoom:14,
          styles:${JSON.stringify(styleJson)}
        });
      }
      window.onerror=function(e){document.body.innerHTML='<div style="display:flex;justify-content:center;align-items:center;height:100%;font-family:sans-serif;text-align:center;"><div><h2>Harita yüklenemedi</h2><p>'+e+'</p></div></div>';};
    </script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBXJcpzOL26QD1mucMjiyDFiaV1konkcyk&callback=init"></script>
  </head>
  <body>
    <div id="map"></div>
  </body>
</html>`;

// Ana ekran (Home Screen) - Harita
const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);
  const markerRefs = useRef({});
  
  // Ekran giriş animasyonları
  const mapFadeAnim = useRef(new Animated.Value(0)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const locationButtonSlideAnim = useRef(new Animated.Value(100)).current;
  
  // FAB animasyonları
  const fabScale = useRef(new Animated.Value(1)).current;
  const fabPulse = useRef(new Animated.Value(1)).current;
  const fabRotate = useRef(new Animated.Value(0)).current;
  const fabSlideUp = useRef(new Animated.Value(100)).current;
  
  // Buton animasyonları - dinamik boyutlandırma
  const boxButtonScale = useRef(new Animated.Value(1)).current;
  const mapButtonScale = useRef(new Animated.Value(1.2)).current; // HomeScreen'de olduğumuz için büyük
  const chatButtonScale = useRef(new Animated.Value(1)).current;

  const { boxes, clearBoxes } = useContext(BoxesContext);
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedBoxScreenPos, setSelectedBoxScreenPos] = useState(null);
  const window = useWindowDimensions();
  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  // Seçilen kutu için arkadaşlık isteği gönderme durumu
  const [requestSent, setRequestSent] = useState(false);
  // openBoxId, openBoxScreenPos, showOpenButton state'lerini ve ilgili fonksiyonları kaldır
  // Marker'ın altında buton gösteren render kodunu kaldır

  // Gelen istekleri modal açılınca yükle
  useEffect(() => {
    if (addFriendModalVisible) {
      (async () => {
        try {
          const requests = await getFriendRequests();
          setFriendRequests(requests);
        } catch (error) {
          console.error('İstekler alınamadı:', error);
        }
      })();
    }
  }, [addFriendModalVisible]);
  
  const acceptRequest = async (id) => {
    try {
      await acceptFriendRequest(id);
      setFriendRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('İstek kabul hatası:', error);
    }
  };
  const rejectRequest = async (id) => {
    try {
      await rejectFriendRequest(id);
      setFriendRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('İstek reddetme hatası:', error);
    }
  };
  const [friendQuery, setFriendQuery] = useState('');
  const handleFriendAdd = () => {
    if (!friendQuery.trim()) {
      Alert.alert('Hata', 'Lütfen bir kullanıcı adı veya e-posta girin.');
      return;
    }
    Alert.alert('İstek Gönderildi', `${friendQuery} için arkadaşlık isteği gönderildi.`);
    setFriendQuery('');
    setAddFriendModalVisible(false);
  };
  const [isSwapped, setIsSwapped] = useState(false);

  // Prefetch images so swapping is instant
  useEffect(() => {
    if (selectedBox) {
      Image.prefetch(selectedBox.photos[0]);
      Image.prefetch(selectedBox.photos[1]);
    }
  }, [selectedBox]);

  // Marker'a tıklanınca box'ı ve ekran pozisyonunu kaydet
  const handleBoxPhotoOpen = async (box) => {
    setSelectedBox(box);
    setIsSwapped(false);
    if (mapRef.current && box.location) {
      try {
        const point = await mapRef.current.pointForCoordinate(box.location);
        setSelectedBoxScreenPos(point);
      } catch (e) {
        setSelectedBoxScreenPos(null);
      }
    }
  };

  // Harita hareket ederse veya başka bir yere tıklanırsa butonu gizle
  const handleMapPress = () => {
    setSelectedBox(null);
    setSelectedBoxScreenPos(null);
  };
  
  /**
   * Seçilen kutu sahibine arkadaşlık isteği gönderir.
   */
  const handleSendRequest = async () => {
    try {
      await sendFriendRequest(selectedBox.userId);
      Alert.alert('İstek Gönderildi', `${selectedBox.username} için arkadaşlık isteği gönderildi.`);
      setRequestSent(true);
    } catch (error) {
      Alert.alert('Hata', error.message || 'İstek gönderilemedi.');
    }
  };
  // BoxesContext güncellemelerini konsola yazdır
  useEffect(() => {
    console.log('HomeScreen boxes güncellendi:', boxes);
  }, [boxes]);

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Konum izni verilmedi');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error('Location error:', error);
        setErrorMsg('Konum alınamadı');
      }
    };

    initializeLocation();
    
    // Ekran giriş animasyonlarını başlat
    Animated.stagger(200, [
      Animated.timing(mapFadeAnim, {
        toValue: 1,
        duration: timingConfigs.fadeIn.duration,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        ...springConfigs.gentle,
      }),
      Animated.spring(locationButtonSlideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        ...springConfigs.gentle,
      }),
      Animated.spring(fabSlideUp, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        ...springConfigs.gentle,
      }),
    ]).start();
    
    // FAB pulse animasyonu - sürekli çalışır
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(fabPulse, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fabPulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    
    pulseAnimation.start();
    
    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const currentRegion = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const goToCurrentLocation = async () => {
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      Alert.alert('Hata', 'Konum alınamadı');
    }
  };

  // Buton animasyon sistemi
  const animateButton = (activeButton) => {
    Animated.parallel([
      // Box buton animasyonu
      Animated.spring(boxButtonScale, {
        toValue: activeButton === 'box' ? 1.2 : 1,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
      // Map buton animasyonu
      Animated.spring(mapButtonScale, {
        toValue: activeButton === 'map' ? 1.2 : 1,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
      // Chat buton animasyonu
      Animated.spring(chatButtonScale, {
        toValue: activeButton === 'chat' ? 1.2 : 1,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
    ]).start();
  };

  // Box butonu - Kitaplık ekranına git
  const handleBoxPress = () => {
    animateButton('box');
    navigation.navigate('Library');
  };

  // Chat butonu - Sohbet ekranına git
  const handleChatPress = () => {
    animateButton('chat');
    navigation.navigate('Chat');
  };


  // Butona tıklanınca fotoğraf modalı açılır
  const handleOpenBoxButton = (box) => {
    setSelectedBox(box);
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={homeScreenStyles.fullScreenContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <Animated.View
        style={[
          homeScreenStyles.fullScreenMap,
          {
            opacity: mapFadeAnim,
          },
        ]}
      >
        <View style={homeScreenStyles.fullScreenMap}>
          <MapView
            // MapView yeniden render için key boxes.length'e bağlı
            key={`map-${boxes.length}`}
            ref={mapRef}
            style={homeScreenStyles.fullScreenMap}
            provider={Platform.OS === 'android' ? 'google' : undefined}
            mapType="mutedStandard"
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={false}
            showsScale={false}
            showsBuildings={false}
            showsTraffic={false}
            showsIndoors={false}
            showsPointsOfInterest={false}
            pitchEnabled={false}
            rotateEnabled={false}
            scrollEnabled={true}
            zoomEnabled={true}
            region={currentRegion}
            customMapStyle={[]}
            userInterfaceStyle="dark"
            onPress={handleMapPress}
            onRegionChange={() => {}} // No longer needed
            onRegionChangeComplete={() => {}} // No longer needed
          >
            {/* Kullanıcı konumu marker'ı - Neon Cyan */}
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Konumum"
                description="Şu anda buradayım"
                zIndex={0}
                tracksViewChanges={false}
              >
                <Image
                  source={require('../../assets/current_loc.png')}
                  style={{ width: 48, height: 48 }}
                  resizeMode="contain"
                />
              </Marker>
            )}

            {/* Kullanıcı etrafında yarıçap göstergesi - Neon Cyan */}
            {location && (
              <Circle
                center={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                radius={500}
                strokeColor={colors.primary + '40'}
                strokeWidth={1.5}
                fillColor={colors.primary + '0A'}
              />
            )}

            {/* Context'ten box marker'ları */}
            {boxes.map((box) => (
              <Marker
                key={box._id}
                ref={ref => (markerRefs.current[box._id] = ref)}
                coordinate={box.location}
                zIndex={1}
                onPress={(e) => {
                  // Olayın haritaya yayılmasını engelle
                  e.stopPropagation();
                  // Callout'u manuel olarak göster
                  markerRefs.current[box._id]?.showCallout();
                }}
              >
                <Image
                  source={require('../../assets/box_closed.png')}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
                <Callout tooltip onPress={() => setSelectedBox(box)}>
                  <View style={styles.calloutView}>
                    <Text style={styles.calloutText}>Kutuyu Aç</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>
        {/* Apple harita logosunu kapatmak için küçük Durul Mimoji */}
        <Image
          source={require('../../assets/mimoji_durul.png')}
          style={homeScreenStyles.appleLogoOverlay}
          resizeMode="contain"
          pointerEvents="none"
        />
        {/* MapKit↗︎ dark mode doğrudan etkin; ek overlay kaldırıldı */}
      </Animated.View>

      {/* Üst Header */}
      <Animated.View
        style={[
          homeScreenStyles.headerOverlay,
          { top: insets.top, height: 60, transform: [{ translateY: headerSlideAnim }] },
        ]}
      >
        <SafeAreaView>
          <View style={homeScreenStyles.headerContainer}>
            {/* Sol üst - Profil butonu */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('Profile')}
              style={[homeScreenStyles.modernButton, homeScreenStyles.profileButtonHeader]}
              activeOpacity={0.7}
            >
              <View style={homeScreenStyles.profileImageContainer}>
                <Image 
                  source={require('../../assets/profile_avatar.png')} 
                  style={homeScreenStyles.profileAvatar}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
            
            {/* Orta - Boş alan (Logo bottom'a taşındı) */}
            <View style={{ flex: 1 }} />
            
            {/* Sağ üst - Arkadaşlık isteği butonu (modal veya ekran açılacak) */}
            <TouchableOpacity 
              style={[homeScreenStyles.modernButton, homeScreenStyles.friendRequestButton]}
              onPress={() => setAddFriendModalVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="person-add" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            {/* Tüm kutuları temizle butonu */}
            <TouchableOpacity
              onPress={clearBoxes}
              style={[homeScreenStyles.modernButton, homeScreenStyles.friendRequestButton]}
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={24} color={colors.error} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
      
      {/* Bottom Logo - Kamera butonu tarzı circular design */}
      <View style={homeScreenStyles.logoContainer}>
        <TouchableOpacity 
          style={homeScreenStyles.overlayLogo}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Camera')}
        >
          <Image 
            source={require('../../SpotBox_Logo.png')} 
            style={homeScreenStyles.logoAsset}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      
      {/* Konum Butonu - Bottom bar'ın üstüne sağ tarafa */}
      <Animated.View
        style={[
          homeScreenStyles.locationButtonContainer,
          {
            transform: [{ translateX: locationButtonSlideAnim }],
          },
        ]}
      >
        <Animated.View
          style={homeScreenStyles.locationButton}
        >
          <TouchableOpacity
            style={{ flex: 1, width: '100%', height: '100%', borderRadius: 26, justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={0.7}
            onPressIn={() => {
              Animated.timing(locationButtonSlideAnim, {
                toValue: -4,
                duration: 80,
                useNativeDriver: true,
              }).start();
            }}
            onPressOut={() => {
              Animated.spring(locationButtonSlideAnim, {
                toValue: 0,
                friction: 4,
                useNativeDriver: true,
              }).start();
              goToCurrentLocation();
            }}
          >
            <Image
              source={require('../../assets/location.png')}
              style={homeScreenStyles.locationIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      {/* Box Fotoğraf Modalı */}
      {selectedBox && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setSelectedBox(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedBox(null)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              {/* Fotoğraf wrapper */}
              <View style={styles.photoWrapper}>
                <Image
                  source={{ uri: selectedBox.photos[isSwapped ? 1 : 0] }}
                  style={styles.fullPhoto}
                  resizeMode="cover"
                />
                {/* Arka kamera küçük overlay - tıklayınca yer değiştir */}
                <TouchableOpacity style={styles.thumbWrapper} onPress={() => setIsSwapped(!isSwapped)}>
                  <Image
                    source={{ uri: selectedBox.photos[isSwapped ? 0 : 1] }}
                    style={styles.thumbPhoto}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
              {/* Arkadaş ekle butonu */}
              <TouchableOpacity
                style={[homeScreenStyles.modernButton, homeScreenStyles.friendRequestButton, { alignSelf: 'center', marginTop: 16 }]}
                onPress={handleSendRequest}
                disabled={requestSent}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={requestSent ? 'checkmark' : 'person-add'}
                  size={24}
                  color={requestSent ? colors.accent : colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {addFriendModalVisible && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setAddFriendModalVisible(false)}>
          <View style={styles.friendModalOverlay}>
            <View style={styles.friendModalContent}>
              <TouchableOpacity style={styles.modalClose} onPress={() => setAddFriendModalVisible(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.friendModalTitle}>Arkadaş İstekleri</Text>
              <FlatList
                data={friendRequests}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.requestItem}>
                    <Text style={styles.requestText}>{item.name}</Text>
                    <View style={styles.requestButtons}>
                      <TouchableOpacity onPress={() => acceptRequest(item.id)} style={styles.acceptButton}>
                        <Text style={styles.acceptButtonText}>Kabul Et</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => rejectRequest(item.id)} style={styles.rejectButton}>
                        <Text style={styles.rejectButtonText}>Reddet</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Bekleyen istek yok</Text>}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

// Local styles for modal & callout
const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: Dimensions.get('window').width * 0.9, backgroundColor: '#0E0E0F', borderRadius: 8, padding: 0 },
  modalClose: {
    position: 'absolute', top: 20, left: 20, zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, padding: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 4, elevation: 8,
  },
  photoWrapper: {
    position: 'relative',
    width: '100%',
    height: Dimensions.get('window').height * 0.8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  fullPhoto: { width: '100%', height: '100%' },
  thumbWrapper: { position: 'absolute', top: 16, right: 16, zIndex: 2 },
  thumbPhoto: {
    width: Dimensions.get('window').width * 0.35,
    height: Dimensions.get('window').width * 0.35,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  calloutView: {
    backgroundColor: colors.surfaceGrey,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 100,
    alignItems: 'center',
    borderRadius: 8,
    borderColor: colors.outlineGrey,
    borderWidth: 1,
  },
  calloutText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  friendModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-start', alignItems: 'center' },
  friendModalContent: { width: '90%', backgroundColor: '#0E0E0F', borderRadius: 16, padding: 16, marginTop: 60 },
  friendModalTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 12 },
  requestItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.outlineGrey },
  requestText: { color: colors.textPrimary, fontSize: 16 },
  requestButtons: { flexDirection: 'row' },
  acceptButton: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 8 },
  acceptButtonText: { color: colors.textPrimary, fontWeight: '600' },
  rejectButton: { backgroundColor: colors.error, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  rejectButtonText: { color: colors.textPrimary, fontWeight: '600' },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 16 },
});
export default HomeScreen; 