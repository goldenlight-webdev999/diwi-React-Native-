import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';


const CaptureScreen: FC=(props) => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Capture</Text>
    </SafeAreaView>
  );
};

export default CaptureScreen;