import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import CustomBottomBar from '../components/CustomBottomBar';
import SwipeableScreenContainer from '../components/SwipeableScreenContainer';

import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomBottomBar {...props} />}
      >
        <Tab.Screen 
          name="Library" 
          component={LibraryScreen}
          options={{ tabBarLabel: 'Library' }}
        />
        <Tab.Screen 
          name="Home" 
          component={SwipeableScreenContainer}
          options={{ tabBarLabel: 'Explore' }}
        />
        <Tab.Screen 
          name="Chat" 
          component={ChatScreen}
          options={{ tabBarLabel: 'Social' }}
        />
      </Tab.Navigator>
    </View>
  );
}; 