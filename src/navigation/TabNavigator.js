import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, Platform, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Easing } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ChatScreen from '../screens/ChatScreen';
import { colors } from '../constants/colors';
import { AnimatedTabIcon } from '../components/AnimatedTabIcon';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: insets.bottom,
    }}>
      {/* Glassmorphic Bottom Bar 2025 Style */}
      <View style={{
        marginHorizontal: 0,
        marginBottom: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        ...(Platform.OS === 'ios' && { backdropFilter: 'blur(20px)' }),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 18,
        elevation: 10,
      }}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={40} tint="light" style={{ flex: 1 }}>
            <TabContent state={state} descriptors={descriptors} navigation={navigation} />
          </BlurView>
        ) : (
          <TabContent state={state} descriptors={descriptors} navigation={navigation} />
        )}
      </View>
    </View>
  );
};

const TabContent = ({ state, descriptors, navigation }) => {
  return (
    <View style={{
      flexDirection: 'row',
      height: 86,
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'space-around',
      position: 'relative',
    }}>
      {/* Elegant notch matching theme */}
      <View style={{
        position: 'absolute',
        top: -60,
        left: '50%',
        marginLeft: -55,
        width: 110,
        height: 55,
        backgroundColor: Platform.OS === 'ios' ? 'rgba(250, 250, 250, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        borderTopLeftRadius: 55,
        borderTopRightRadius: 55,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      }} />
      
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Icon mapping
        const getIconName = (routeName, focused) => {
          switch (routeName) {
            case 'Library':
              return focused ? 'library' : 'library-outline';
            case 'Home':
              return focused ? 'map' : 'map-outline';
            case 'Chat':
              return focused ? 'chatbubbles' : 'chatbubbles-outline';
            default:
              return 'circle';
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 22,
              backgroundColor: 'transparent',
              minHeight: 62,
              transform: [{ scale: isFocused ? 1.06 : 1 }],
            }}
            activeOpacity={0.7}
          >
            {/* Icon with proper spacing */}
            <View style={{ marginBottom: 6 }}>
              <AnimatedTabIcon
                name={getIconName(route.name, isFocused)}
                size={24}
                color={isFocused ? colors.primary : colors.textMedium}
                focused={isFocused}
              />
            </View>
            
            {/* Label with SpotBox typography */}
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 12,
                fontWeight: isFocused ? '700' : '600',
                color: isFocused ? colors.primary : colors.textMedium,
                textAlign: 'center',
                letterSpacing: 0.2,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const FloatingCameraButton = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
  };

  const handlePressOut = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start(() => navigation.navigate('Camera'));
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: insets.bottom + 120,
        left: '50%',
        transform: [{ translateX: -39 }, { scale: scaleAnim }],
        width: 78,
        height: 78,
        borderRadius: 39,
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
      }}
    >
      <TouchableOpacity
        style={{ flex: 1, width: '100%', height: '100%', borderRadius: 39 }}
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      />
    </Animated.View>
  );
};

export const TabNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tab.Screen 
          name="Library" 
          component={LibraryScreen}
          options={{
            tabBarLabel: 'Library',
          }}
        />
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen 
          name="Chat" 
          component={ChatScreen}
          options={{
            tabBarLabel: 'Chat',
          }}
        />
      </Tab.Navigator>
      <FloatingCameraButton />
    </View>
  );
}; 