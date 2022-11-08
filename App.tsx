import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/helpers/redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DiwiApp from './DiwiApp';


const App: FC=() => {

  return (
    <Provider store={store}>
      <DiwiApp />
    </Provider>
  );
};

export default App;
