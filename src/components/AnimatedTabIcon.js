import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/colors';
import { globalStyles } from '../styles/globalStyles';

export const AnimatedTabIcon = ({ name, size, color, focused }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Premium micro-interaction animasyonu
      Animated.sequence([
        // İlk önce küçült
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        // Sonra büyüt ve bounce effect
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.2,
            tension: 200,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 1,
            tension: 200,
            friction: 6,
            useNativeDriver: true,
          }),
        ]),
        // Son olarak normal boyuta dön
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Hafif dönüş animasyonu
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Unfocused olduğunda normal boyuta dön
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '12deg'],
  });

  const bounceTranslateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
  });

  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          { rotate: rotation },
          { translateY: bounceTranslateY },
        ],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}; 