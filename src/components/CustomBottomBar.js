import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { colors, colorCombinations } from '../constants/colors';

const CustomBottomBar = ({ state, descriptors, navigation }) => {
  const homeRoute = navigation.getState().routes.find(r => r.name === 'Home');
  const currentScreen = homeRoute?.params?.currentScreen || 'Home';

  return (
    <View style={styles.container}>
      {state.routes.map((route) => {
        const isFocused = route.name === currentScreen;
        
        // Buton basıldığında doğru ekrana yönlendir
        const onPress = () => {
          // Hangi butona basıldıysa o ekrana git
          navigation.setParams({ navigateTo: route.name });
        };
        
        let iconSource;
        let label;
        switch (route.name) {
          case 'Home':
            iconSource = require('../../assets/image.png');
            label = 'Harita';
            break;
          case 'Library':
            iconSource = require('../../assets/reels_assets.png');
            label = 'Gönderiler';
            break;
          case 'Chat':
            iconSource = require('../../assets/image_chat.png');
            label = 'Mesajlar';
            break;
          default:
            iconSource = require('../../assets/image.png');
            label = route.name;
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.button}
            activeOpacity={0.7}
          >
            <Image
              source={iconSource}
              style={[
                styles.icon,
                !isFocused && { opacity: 0.4 }
              ]}
              resizeMode="contain"
            />
            <Text style={[
              styles.label, 
              { color: isFocused ? colors.textPrimary : colors.textSecondary }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.surfaceGrey,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineGrey,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
    paddingHorizontal: 12,
    zIndex: 9999,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 24,
    position: 'relative',
    marginHorizontal: 4,
  },
  icon: {
    width: 24,
    height: 24,
    zIndex: 2,
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CustomBottomBar; 