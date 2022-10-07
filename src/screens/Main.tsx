import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  View
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Account from './Account';
import Capture from './Capture';


const Main: FC=(props) => {
  return (
    <SafeAreaView >
      <View style={{flex:1}}>
        <StatusBar backgroundColor='white'/>
        <Text style={styles.textstyle}>Main</Text>
      </View>
    </SafeAreaView>
  );
};
 
const styles=StyleSheet.create({
  textstyle:{
    textAlign:'center',
    fontSize:18,
  }
})

export default Main;