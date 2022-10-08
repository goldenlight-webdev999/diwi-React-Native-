import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CaptureScreen from '../screens/CaptureScreen';
 
const Tab = createBottomTabNavigator();

const Tabs: FC=(props) => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Capture" component={CaptureScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
 


export default Tabs;