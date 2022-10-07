import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Main from './src/screens/Main';


const App: FC=() => {
  

  return (
    <SafeAreaView style={{backgroundColor:'white',flex:1}}>
      <Main/>
    </SafeAreaView>
  );
};

export default App;
