import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';


const CaptureScreen: FC=(props) => {
  return (
    <SafeAreaView >      
      <View style={styles.container}>
        <Text>Capture here!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default CaptureScreen;