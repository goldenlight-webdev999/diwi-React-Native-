import React, { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Header from '../components/Header';
import { itemReducer } from "../helpers/redux/itemSlice";
import { getAllItems } from '../services/api';
import { totalItemsReducer } from '../helpers/redux/totalItemsSlice';
import Spinner from 'react-native-loading-spinner-overlay';
const screenWidth = Dimensions.get('window').width;


const ForgotPasswordScreen: FC<any> = (props) => {

  const dispatch = useDispatch();

  const [items, setItems] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
 
  const title = 'Forgot your password?'

  const onGoDetail = (item: any) => {
    dispatch(
      itemReducer({item: item})
    );
    props.navigation.navigate('Detail')
  }

  const isFormValidate = () => {
    

    if (!password) {
      setPasswordError('')
      return false;
    }
    return true
  }

  const onEmail = (text: string) => {
    const strongRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
    if (!strongRegex.test(text)) {
      setEmailError('Incorrect Email format')
    } else {
      setEmailError('')
    }

    setEmail(text)
  }

  const onPassword = (text: string) => {
    if (!password) {
      setPasswordError('No password')      
    } else {
      setPasswordError('')
    }
    
    setPassword(text)
  }

  const onLogin = async () => {

    if (!emailError || !passwordError) {
      return
    }    
    // const response = await getAllItems('look')
    
    // if (response.data && response.data.data) {
      
    //   dispatch(
    //     totalItemsReducer({items: response.data.data})
    //   );
    // }
  }  

  const onGoback = () => {
    props.navigation.navigate('Login')
  }  

  const forgetPassword = () => {
    //props.navigation.navigate('ForgotPassword')
  }

  useEffect(() => {
    
  }, []);

  return (
    <View
      style={styles.page}
    >      
      <Header
        title={"Rest Password"}
        back={true}
        onSearch={() => {}}
        onBack={onGoback}
        onSave={() => {}}
        onMore={() => {}}
      />
      <View style={styles.container}>
        <View style={styles.groupWrapper}>
          <Text>{title}</Text>
          <TextInput
            style={styles.formFieldStyle}
            onChangeText={(text) => {onEmail(text)}}
            //onBlur={(e) => {onEmail(password)}}
            underlineColorAndroid="transparent"
            placeholder={'Email address'}
            placeholderTextColor={"#ccc"}
          />
          {emailError && (
            <Text style={styles.error}>{emailError}</Text>
          )}

          <TouchableOpacity
            onPress={onLogin}
          >
            <View style={styles.buttonWrapper}>
              <Text style={styles.button}>{'Send'}</Text>
            </View>
          </TouchableOpacity>

        </View>
        <View style={styles.groupWrapper}>
          <Text style={{marginRight: 20}}>Go back to</Text>
          <TouchableOpacity
            onPress={onGoback}
          >
            <Text style={styles.link}>{'Log in'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  page: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingHorizontal: 40,
    padding: 10,
    zIndex: 1,
  },
  groupWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginVertical: 10,
  },
  formFieldStyle: {
    height: 40,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    color: '#000',
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    width: screenWidth - 80,
    paddingHorizontal: 15,
  },
  link: {
    color: "#b637ab",
    textDecorationLine: 'underline',
  },
  button: {    
    color: '#fff',
  },
  buttonWrapper: {
    color: "#fff",
    backgroundColor: '#b637ab',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  error: {
    color: 'red',
  }

});

export default ForgotPasswordScreen;