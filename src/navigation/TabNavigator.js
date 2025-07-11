import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CustomBottomBar from '../components/CustomBottomBar';
import SwipeableScreenContainer from '../components/SwipeableScreenContainer';
import FeedScreen from '../screens/FeedScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();

/**
 * Bottom‑tab navigator that houses Home (swipeable), Library and Chat.
 * The actual Home screen stack is rendered by SwipeableScreenContainer.
 */
export const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{ headerShown: false }}
    detachInactiveScreens
    tabBar={(props) => <CustomBottomBar {...props} />}
  >
    <Tab.Screen
      name="Library"
      component={FeedScreen}
      options={{ tabBarLabel: 'Gönderiler' }}
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
);

export default TabNavigator;