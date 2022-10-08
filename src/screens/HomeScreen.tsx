import React, { FC } from 'react';
import {
  Text,
  View
} from 'react-native';

const HomeScreen: FC=(props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
};

export default HomeScreen;