import React, { FC, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Main from './src/screens/Main';
import SplashScreen from 'react-native-splash-screen';


const App: FC=() => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaView style={{backgroundColor:'green',flex:1}}>
      <Main/>
    </SafeAreaView>
  );
};

export default App;
