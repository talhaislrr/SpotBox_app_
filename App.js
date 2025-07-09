import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BoxesProvider } from './src/context/BoxesContext';
import { ChatProvider } from './src/context/ChatContext';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { StackNavigator as MainStack } from './src/navigation/StackNavigator';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return (
    <NavigationContainer>
      {user ? (
        <BoxesProvider>
          <ChatProvider>
            <MainStack />
          </ChatProvider>
        </BoxesProvider>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
} 