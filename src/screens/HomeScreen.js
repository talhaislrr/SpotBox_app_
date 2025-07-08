import React, { useState, useEffect, useRef } from 'react';
import { View, StatusBar, Image, Alert, Animated, TouchableOpacity, SafeAreaView, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../constants/colors';
import { defaultRegions } from '../constants/mapStyles';
import { springConfigs, timingConfigs } from '../constants/animations';
import { homeScreenStyles } from '../styles/homeScreenStyles';

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

  // Map butonu - Harita ekranına git
  const handleMapPress = () => {
    animateButton('map');
    navigation.navigate('Map');
  };

  // Chat butonu - Sohbet ekranına git
  const handleChatPress = () => {
    animateButton('chat');
    navigation.navigate('Chat');
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
              >
                <View style={{
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: colors.textPrimary,
                }}>
                  <View style={{
                    backgroundColor: colors.textPrimary,
                    borderRadius: 6,
                    width: 8,
                    height: 8,
                  }} />
                </View>
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

            {/* Örnek müzik spot'ları - Secondary Magenta */}
            <Marker
              coordinate={{
                latitude: currentRegion.latitude + 0.005,
                longitude: currentRegion.longitude + 0.005,
              }}
              title="Müzik Spot"
              description="Popüler müzik"
            >
              <View style={{
                backgroundColor: colors.secondary,
                borderRadius: 12,
                width: 24,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: colors.textPrimary,
              }}>
                <View style={{
                  backgroundColor: colors.textPrimary,
                  borderRadius: 6,
                  width: 8,
                  height: 8,
                }} />
              </View>
            </Marker>

            <Marker
              coordinate={{
                latitude: currentRegion.latitude - 0.008,
                longitude: currentRegion.longitude + 0.004,
              }}
              title="Müzik Spot"
              description="Rock müzik"
            >
              <View style={{
                backgroundColor: colors.accent,
                borderRadius: 12,
                width: 24,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: colors.textPrimary,
              }}>
                <View style={{
                  backgroundColor: colors.textPrimary,
                  borderRadius: 6,
                  width: 8,
                  height: 8,
                }} />
              </View>
            </Marker>

            <Marker
              coordinate={{
                latitude: currentRegion.latitude + 0.004,
                longitude: currentRegion.longitude - 0.006,
              }}
              title="Müzik Spot"
              description="Jazz müzik"
            >
              <View style={{
                backgroundColor: '#8FA2B0',
                borderRadius: 12,
                width: 24,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1.5,
                borderColor: 'white',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 1.5,
              }}>
                <View style={{
                  backgroundColor: 'white',
                  borderRadius: 4,
                  width: 8,
                  height: 8,
                }} />
              </View>
            </Marker>
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
            
            {/* Sağ üst - Arkadaşlık isteği butonu */}
            <TouchableOpacity 
              style={[homeScreenStyles.modernButton, homeScreenStyles.friendRequestButton]}
              activeOpacity={0.7}
            >
              <View style={homeScreenStyles.buttonGlow}>
                <Image 
                  source={require('../../assets/request.png')} 
                  style={homeScreenStyles.friendRequestIcon}
                  resizeMode="contain"
                />
                <View style={homeScreenStyles.notificationBadge}>
                  <Text style={homeScreenStyles.badgeText}>3</Text>
                </View>
              </View>
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
    </View>
  );
};

export default HomeScreen; 