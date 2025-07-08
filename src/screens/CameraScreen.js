import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, StatusBar, Animated, TouchableOpacity, Text, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';

import { colors } from '../constants/colors';
import { springConfigs, timingConfigs } from '../constants/animations';
import { cameraStyles } from '../styles/cameraStyles';
import { BoxesContext } from '../context/BoxesContext';

const CameraScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('front'); // Önce ön kamera
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [location, setLocation] = useState(null);
  const [currentStep, setCurrentStep] = useState('ready'); // 'ready', 'front', 'countdown', 'back', 'complete'
  
  const cameraRef = useRef(null);
  const { addBox } = useContext(BoxesContext);
  
  // Kamera ekranı giriş animasyonu
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const countdownAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: timingConfigs.easeInOut.duration,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        ...springConfigs.gentle,
      }),
    ]).start();
    
    // Konum iznini al
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Hata', 'Konum izni gerekli');
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const startCaptureSequence = async () => {
    if (isCapturing) return;
    
    setIsCapturing(true);
    setCurrentStep('front');
    
    try {
      // 1. Ön kameradan fotoğraf çek
      const frontPhoto = await cameraRef.current?.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      if (frontPhoto) {
        setCapturedPhotos([frontPhoto]);
        
        // 2. Arka kameraya geç ve geri sayım başlat
        setFacing('back');
        setCurrentStep('countdown');
        
        // 3 saniye geri sayım
        for (let i = 3; i > 0; i--) {
          setCountdown(i);
          
          // Geri sayım animasyonu
          Animated.sequence([
            Animated.timing(countdownAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(countdownAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ]).start();
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // 3. Arka kameradan fotoğraf çek
        setCurrentStep('back');
        const backPhoto = await cameraRef.current?.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (backPhoto) {
          setCapturedPhotos([frontPhoto, backPhoto]);
          setCurrentStep('complete');
        }
      }
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Hata', 'Fotoğraf çekilemedi');
    }
    
    setIsCapturing(false);
    setCountdown(0);
  };

  const sendPhotos = async () => {
    if (!location) {
      Alert.alert('Hata', 'Konum bilgisi alınamadı');
      return;
    }
    
    if (capturedPhotos.length < 2) {
      Alert.alert('Hata', 'Her iki fotoğraf da çekilmeli');
      return;
    }
    
    // Box verisi oluştur
    const boxData = {
      id: Date.now().toString(),
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      photos: capturedPhotos,
      timestamp: new Date().toISOString(),
    };
    
    // Context'e ekle (ve opsiyonel backend'e gönder)
    addBox(boxData);
    console.log('Box bırakıldı:', boxData);
    
    Alert.alert(
      'Box Bırakıldı! 📦',
      'Fotoğrafların haritaya yerleştirildi.',
      [
        {
          text: 'Tamam',
          onPress: () => {
            // TabNavigator içindeki Home ekranına dön
            navigation.navigate('Main', { screen: 'Home' });
          },
        },
      ]
    );
  };

  const resetCapture = () => {
    setCapturedPhotos([]);
    setCurrentStep('ready');
    setFacing('front');
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={cameraStyles.permissionContainer}>
        <Text style={cameraStyles.permissionText}>Kamera iznine ihtiyacımız var</Text>
        <TouchableOpacity style={cameraStyles.permissionButton} onPress={requestPermission}>
          <Text style={cameraStyles.permissionButtonText}>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View 
      style={[
        cameraStyles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      <CameraView 
        ref={cameraRef}
        style={cameraStyles.camera} 
        facing={facing}
      />
      
      {/* Geri sayım overlay */}
      {countdown > 0 && (
        <Animated.View 
          style={[
            cameraStyles.countdownOverlay,
            {
              opacity: countdownAnim,
              transform: [{ scale: countdownAnim }],
            },
          ]}
        >
          <Text style={cameraStyles.countdownText}>{countdown}</Text>
        </Animated.View>
      )}
      
      {/* Durum göstergesi */}
      <View style={cameraStyles.statusBar}>
        <View style={cameraStyles.statusContainer}>
          <Text style={cameraStyles.statusText}>
            {currentStep === 'ready' && 'Hazır'}
            {currentStep === 'front' && 'Ön kamera çekiliyor...'}
            {currentStep === 'countdown' && `Arka kamera ${countdown}s`}
            {currentStep === 'back' && 'Arka kamera çekiliyor...'}
            {currentStep === 'complete' && 'Tamamlandı! 📦'}
          </Text>
        </View>
      </View>
      
      {/* Üst kontroller */}
      <View style={cameraStyles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={cameraStyles.closeButton}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={cameraStyles.headerCenter}>
          <Text style={cameraStyles.headerTitle}>SpotBox</Text>
        </View>
        
        <TouchableOpacity 
          onPress={resetCapture}
          style={cameraStyles.resetButton}
        >
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Alt kontroller */}
      <View style={cameraStyles.footer}>
        <View style={cameraStyles.controls}>
          {/* Sol - Fotoğraf önizleme */}
          <View style={cameraStyles.previewContainer}>
            {capturedPhotos.length > 0 && (
              <View style={cameraStyles.photoCount}>
                <Text style={cameraStyles.photoCountText}>
                  {capturedPhotos.length}/2
                </Text>
              </View>
            )}
          </View>
          
          {/* Orta - Capture/Send Butonu */}
          <TouchableOpacity 
            style={[
              cameraStyles.captureButton,
              isCapturing && cameraStyles.capturingButton,
              currentStep === 'complete' && cameraStyles.completeButton,
            ]}
            onPress={currentStep === 'complete' ? sendPhotos : startCaptureSequence}
            disabled={isCapturing}
          >
            {currentStep === 'complete' ? (
              <Image 
                source={require('../../assets/box_closed.png')}
                style={cameraStyles.boxIcon}
                resizeMode="contain"
              />
            ) : (
              <View style={[
                cameraStyles.captureButtonInner,
                isCapturing && cameraStyles.capturingButtonInner,
              ]} />
            )}
          </TouchableOpacity>
          
          {/* Sağ - Boş alan */}
          <View style={cameraStyles.emptySpace} />
        </View>
      </View>
    </Animated.View>
  );
};

export default CameraScreen; 