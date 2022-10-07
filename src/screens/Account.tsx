import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  View
} from 'react-native';


const Account: FC=(props) => {
  return (
    <SafeAreaView >
      <View style={{flex:1}}>
        <StatusBar backgroundColor='white'/>
        <Text style={styles.textstyle}>Account</Text>
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

export default Account;