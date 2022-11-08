import React, { FC, useEffect, useMemo, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './src/components/Tabs';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/helpers/redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initItemsData } from './src/services/constants';
import { getAllItems } from './src/services/api';
import { totalItemsReducer } from './src/helpers/redux/totalItemsSlice';
import { friendsReducer } from './src/helpers/redux/friendsSlice';
import { userReducer } from './src/helpers/redux/userSlice';
import LoginScreen from './src/screens/LoginScreen';
import AuthStackNav from './src/components/AuthStackNav';
import auth from '@react-native-firebase/auth';


const DiwiApp: FC<any> = (props) => {
  
  const dispatch = useDispatch();
  const [user, setUser] = useState();

  const onAuthStateChanged = (user: any) => {

    if (user && user.uid) {
      dispatch(
        userReducer({user:{
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }})
      );
  
      initGetData(user.uid)
    }
    setUser(user);
  }

  useEffect(() => {    
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);


  const [items, setItems] = useState(initItemsData);
  const [friends, setFriends] = useState([] as any[]);
  const [isLoaded, setIsLoaded] = useState(false);
 

  const initGetData = async(userId: string) => {
    setIsLoaded(false)
    const looksResponse: any = await getAllItems('look', userId)
    if (looksResponse.data && looksResponse.data.success) {
      setItems(looksResponse.data.data)
    } else if (looksResponse.data.error) {
      const errorMsg = looksResponse.data.message
      setItems([])
      console.log(errorMsg)
    } else {
      setItems([])
      console.log(looksResponse)
    }

    const friendsResponse: any = await getAllItems('friend', userId)
    if (friendsResponse.data && friendsResponse.data.success) {
      setFriends(friendsResponse.data.data)
    } else if (friendsResponse.data.error) {
      const errorMsg = friendsResponse.data.message
      setFriends([])
      console.log(errorMsg)
    } else {
      console.log(friendsResponse)
      setFriends([])
    }

    setIsLoaded(true)
  }
  
  useEffect(() => {    
    setTimeout(() => {
      SplashScreen.hide();
    }, 500)
  }, []);

  useEffect(() => {
    dispatch(
      totalItemsReducer({items: items})
    );
    dispatch(
      friendsReducer({friends: friends})
    );
  }, [items, friends]);

  return (
    <SafeAreaProvider>
      {user ? (
        <NavigationContainer>
          <Tabs />
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          <AuthStackNav />
        </NavigationContainer>
      )}
      
    </SafeAreaProvider>
  );
};

export default DiwiApp;
