import React, { FC } from 'react';
import {
  SafeAreaView,
  Text,
  View
} from 'react-native';

const HomeScreen: FC=(props) => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;