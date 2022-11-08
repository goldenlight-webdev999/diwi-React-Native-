import React, { FC } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStackNavigator} from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../services/models';

import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import EditItemScreen from '../screens/EditItemScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import FriendsScreen from '../screens/FriendsScreen';
import AddFriendScreen from '../screens/AddFriendScreen';
import NewItemScreen from '../screens/NewItemScreen';
import CameraScreen from '../screens/CameraScreen';
import MediaScreen from '../screens/MediaScreen';
import CaptureScreen from '../screens/CaptureScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';


const AuthStackNav: FC=(props) => {
  const Stack = createStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStackNav;