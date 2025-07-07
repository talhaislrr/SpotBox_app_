import React, { useState, useEffect, useRef } from 'react';
import { View, StatusBar, Image, Alert, Animated, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapLibreGL from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';

import { colors } from '../constants/colors';
import { defaultRegions } from '../constants/mapStyles';
import { springConfigs, timingConfigs } from '../constants/animations';
import { homeScreenStyles } from '../styles/homeScreenStyles';
import spotboxStyle from '../map/spotboxMapStyle.json';

// Ana ekran (Home Screen) - Harita
const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);
  
  // Ekran giriş animasyonları
  const mapFadeAnim = useRef(new Animated.Value(0)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const locationButtonSlideAnim = useRef(new Animated.Value(100)).current;

  // MapLibre initial setup (disable telemetry)
  MapLibreGL.setTelemetryEnabled(false);

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
    ]).start();
  }, []);

  const currentRegion = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : defaultRegions.istanbul;

  const goToCurrentLocation = async () => {
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      Alert.alert('Hata', 'Konum alınamadı');
    }
  };

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
        <MapLibreGL.MapView
          ref={mapRef}
          style={homeScreenStyles.fullScreenMap}
          styleJSON={spotboxStyle}
          logoEnabled={false}
          attributionEnabled={false}
        >
          <MapLibreGL.Camera
            zoomLevel={12}
            centerCoordinate={[currentRegion.longitude, currentRegion.latitude]}
          />
          <MapLibreGL.UserLocation visible={true} />
        </MapLibreGL.MapView>
      </Animated.View>

      {/* Üst Header */}
      <Animated.View
        style={[
          homeScreenStyles.headerOverlay,
          {
            transform: [{ translateY: headerSlideAnim }],
          },
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
            
            {/* Orta - Logo */}
            <View style={homeScreenStyles.logoContainer}>
              <Image 
                source={require('../../SpotBox_Logo.png')} 
                style={homeScreenStyles.overlayLogo}
                resizeMode="contain"
              />
            </View>
            
            {/* Sağ üst - Arkadaşlık isteği butonu */}
            <TouchableOpacity 
              style={[homeScreenStyles.modernButton, homeScreenStyles.friendRequestButton]}
              activeOpacity={0.7}
            >
              <View style={homeScreenStyles.buttonGlow}>
                <Ionicons name="person-add-outline" size={24} color={colors.primary} />
                <View style={homeScreenStyles.notificationBadge}>
                  <Text style={homeScreenStyles.badgeText}>3</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
      
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
            <View style={{
              position: 'absolute',
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.primary,
              opacity: 0.06,
            }} />
            <Ionicons name="location" size={22} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default HomeScreen; 