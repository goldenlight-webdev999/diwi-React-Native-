import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import { headerTitle } from '../services/constants';

const HomeScreen: FC=(props) => {
  return (
    <SafeAreaView >
      <Header title={headerTitle} hasSearch={true}></Header>
      <View style={styles.container}>
        <Text style={styles.textStyle}>Home Screen</Text>
        <Icon name="home" color={'#ccc'} size={50} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    color: '#000',
  }
});

export default HomeScreen;