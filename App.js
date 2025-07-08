import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { StackNavigator } from './src/navigation/StackNavigator';
import { BoxesProvider } from './src/context/BoxesContext';

// SpotBox - Konum Tabanlı Müzik Uygulaması
export default function App() {
  return (
    <SafeAreaProvider>
      <BoxesProvider>
        <NavigationContainer>
          <StackNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </BoxesProvider>
    </SafeAreaProvider>
  );
} 