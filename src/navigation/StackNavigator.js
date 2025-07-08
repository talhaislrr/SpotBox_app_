import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TabNavigator } from './TabNavigator';
import CameraScreen from '../screens/CameraScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import MapScreen from '../screens/MapScreen';
import ChatConversationScreen from '../screens/ChatConversationScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      detachInactiveScreens: true,
    }}
  >
    {/* Bottom‑tab container */}
    <Stack.Screen
      name="Main"
      component={TabNavigator}
      options={{ presentation: 'card' }}   /* full‑screen */
    />

    {/* Camera modal */}
    <Stack.Screen
      name="Camera"
      component={CameraScreen}
      options={{
        presentation: 'modal',
        gestureDirection: 'vertical',
        unmountOnBlur: true,
      }}
    />
    {/* Profile modal */}
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        presentation: 'modal',
        gestureDirection: 'vertical',
        unmountOnBlur: true,
      }}
    />
    {/* Profile Düzenle ekranı */}
    <Stack.Screen
      name="ProfileEdit"
      component={ProfileEditScreen}
      options={{ presentation: 'modal', gestureDirection: 'vertical', unmountOnBlur: true }}
    />

    {/* Map full‑screen */}
    <Stack.Screen
      name="Map"
      component={MapScreen}
      options={{ presentation: 'card' }}
    />

    {/* Chat conversation full‑screen */}
    <Stack.Screen
      name="ChatConversation"
      component={ChatConversationScreen}
      options={{ presentation: 'card' }}
    />
  </Stack.Navigator>
);

export const StackNavigator = () => (
  <SafeAreaProvider>
    <MainStack />
  </SafeAreaProvider>
);