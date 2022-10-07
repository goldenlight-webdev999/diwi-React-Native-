import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  View
} from 'react-native';


const Capture: FC=(props) => {
  return (
    <SafeAreaView >
      <View style={{flex:1}}>
        <StatusBar backgroundColor='white'/>
        <Text style={styles.textstyle}>Capture</Text>
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

export default Capture;