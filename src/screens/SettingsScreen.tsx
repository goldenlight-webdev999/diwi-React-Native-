import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Header from '../components/Header';


const ScreenScreen: FC=(props) => {
  return (
    <SafeAreaView>
      <Header title={"Account"}></Header>
      <View style={styles.container}>
        <Text>Account</Text>
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

export default ScreenScreen;