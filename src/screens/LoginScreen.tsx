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
import Spinner from 'react-native-loading-spinner-overlay';
import { userReducer } from '../helpers/redux/userSlice';
import { isValidEmail } from '../helpers/helper';
import auth from '@react-native-firebase/auth';
const screenWidth = Dimensions.get('window').width;

const LoginScreen: FC<any> = (props) => {

  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
    
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')

  const title = 'Welcome'

  const onSetAuthUser = (user: any) => {
    dispatch(
      userReducer({user})
    );
  }  

  const onEmail = (email: string) => {
    setEmailError('')
    setEmail(email)
  }

  const onPassword = (text: string) => {    
    setPassword(text)
    setEmailError('')
  }

  const onLogin = async () => {
    
    if (!isValidEmail(email)) {
      setEmailError('Incorrect Email format')
      return
    } else {
      setEmailError('')
    }

    if (!password) {
      setPasswordError('No password')
      return
    } else {
      setPasswordError('')
    }

    setIsLoading(true)
    setLoadingText('Loading')

    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {        
        //console.log('---Login---response:', response.user);

        // success?

        const user = {
          uid: response.user.uid,
          email: response.user.email,
          displayName: response.user.displayName,
        }

        onSetAuthUser(user)
        setIsLoading(false)
        setLoadingText('')
      })
      .catch(error => {
        console.log('--Login--error----', error)
        if (error.code === 'auth/user-not-found') {          
          setPasswordError('The user does not exist.')
        } else if (error.code === 'auth/wrong-password') {
          setPasswordError('The password is invalid.')
        } else {
          //setPasswordError(error.code)          
        }
        setIsLoading(false)
        setLoadingText('')
    });
  }  

  const onSignup = () => {
    props.navigation.navigate('Signup')
  }  

  const forgetPassword = () => {
    props.navigation.navigate('ForgotPassword')
  }

  useEffect(() => {
    
  }, []);

  return (
    <View
      style={styles.page}
    >
      <Spinner
        visible={isLoading}
        textContent={`${loadingText}...`}
        textStyle={styles.spinnerTextStyle}
      />
      <Header
        title={"Login"}
        back={false}
        onSearch={() => {}}
        onBack={() => {}}
        onSave={() => {}}
        onMore={() => {}}
      />
      <View style={styles.container}>
      {/* <Text>{title}</Text> */}
        <View style={styles.groupWrapper}>
          
          <Text>Email*</Text>
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
        </View>
        <View style={styles.groupWrapper}>
          <Text>Password*</Text>
          <TextInput
            style={styles.formFieldStyle}
            onChangeText={(text) => {onPassword(text)}}
            underlineColorAndroid="transparent"
            placeholder={'Password'}
            placeholderTextColor={"#ccc"}
            secureTextEntry={true}
          />
          {passwordError && (
            <Text style={styles.error}>{passwordError}</Text>
          )}
        </View>

        {/* <View style={styles.spaceVertical}></View>

        <View style={styles.groupWrapper}>
          <TouchableOpacity
            onPress={forgetPassword}
          >
            <Text style={styles.link}>{'Forgot password?'}</Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.spaceVertical}></View>
        
        <View style={styles.groupWrapper}>
          <TouchableOpacity
            onPress={onLogin}
          >
            <View style={styles.buttonWrapper}>
              <Text style={styles.button}>{'Log in'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.spaceVertical}></View>

        <View style={styles.groupWrapper}>
          <Text style={{marginRight: 20}}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={onSignup}
          >
            <Text style={styles.link}>{'Sign up'}</Text>
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
    marginVertical: 0,
  },
  spaceVertical: {
    width: '100%',
    height: 20,
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

export default LoginScreen;