import React, { useState, useEffect, useRef } from 'react';
import { View, StatusBar, Animated, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { colors } from '../constants/colors';
import { springConfigs, timingConfigs } from '../constants/animations';
import { cameraStyles } from '../styles/cameraStyles';

const CameraScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  
  // Kamera ekranı giriş animasyonu
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
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
  }, []);

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
      
      <CameraView style={cameraStyles.camera} facing={facing} />
      
      {/* Üst kontroller */}
      <View style={cameraStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={cameraStyles.closeButton}>
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFacing(facing === 'back' ? 'front' : 'back')} style={cameraStyles.flipButton}>
          <Ionicons name="camera-reverse" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Alt kontroller */}
      <View style={cameraStyles.footer}>
        <View style={cameraStyles.controls}>
          <View style={cameraStyles.emptySpace} />
          <TouchableOpacity style={cameraStyles.captureButton}>
            <View style={cameraStyles.captureButtonInner} />
          </TouchableOpacity>
          <View style={cameraStyles.emptySpace} />
        </View>
      </View>
    </Animated.View>
  );
};

export default CameraScreen; 