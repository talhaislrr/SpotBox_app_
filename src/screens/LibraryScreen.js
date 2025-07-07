import React, { useEffect, useRef } from 'react';
import { SafeAreaView, Animated, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../constants/colors';
import { springConfigs, timingConfigs, tabAnimationValues } from '../constants/animations';
import { globalStyles } from '../styles/globalStyles';

const LibraryScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(tabAnimationValues.translate.right)).current;
  
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

  return (
    <SafeAreaView style={globalStyles.container}>
      <Animated.View
        style={[
          { flex: 1 },
          {
            backgroundColor: colors.background,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={globalStyles.content}>
          <Text style={globalStyles.title}>Kütüphane</Text>
          <Text style={globalStyles.subtitle}>Müzik koleksiyonun</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LibraryScreen; 