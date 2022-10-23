import React, { FC } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNav from '../components/HomeStackNav';
import SettingsScreen from '../screens/SettingsScreen';
import CaptureScreen from '../screens/CaptureScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { itialCaptureParams } from '../services/constants';
 
const Tab = createBottomTabNavigator();

const Tabs: FC=(props) => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStackNav"
      screenOptions={{ headerShown: false, tabBarActiveTintColor: '#0a0a23', tabBarShowLabel: false, }}
    > 
      <Tab.Screen
        name="CaptureStackNav"
        component={CaptureScreen}
        initialParams={itialCaptureParams}
        options={{
          tabBarLabel: 'Capture',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="camera-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="HomeStackNav"
        component={HomeStackNav}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dots-grid" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsStackNav"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
 


export default Tabs;