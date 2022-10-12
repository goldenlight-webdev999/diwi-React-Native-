import React, { FC, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Main from './src/screens/HomeScreen';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './src/components/Tabs';
import Navigations from './src/components/HomeStackNav';


const App: FC=() => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500)
  }, []);

  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
};

export default App;
