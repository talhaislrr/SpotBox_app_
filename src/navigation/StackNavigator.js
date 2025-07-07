import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TabNavigator } from './TabNavigator';
import CameraScreen from '../screens/CameraScreen';
import { customTransitions } from './CustomTransitions';

const Stack = createStackNavigator();



const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'vertical',
        cardStyleInterpolator: customTransitions.slideVertical,
        animationEnabled: true,
        animationTypeForReplace: 'push',
        presentation: 'modal',
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={TabNavigator}
        options={{
          cardStyleInterpolator: customTransitions.fade,
        }}
      />
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{
          cardStyleInterpolator: customTransitions.slideVertical,
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />
    </Stack.Navigator>
  );
};

export const StackNavigator = () => {
  return (
    <SafeAreaProvider>
      <MainStack />
    </SafeAreaProvider>
  );
}; 