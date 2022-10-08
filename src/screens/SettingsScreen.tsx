import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';


const ScreenScreen
: FC=(props) => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </SafeAreaView>
  );
};

export default ScreenScreen;