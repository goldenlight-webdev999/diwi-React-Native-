import React, { FC, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './src/components/Tabs';
import { Provider } from 'react-redux';
import { store } from './src/helpers/redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const App: FC=() => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500)
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Tabs />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
