import React, { FC, useState, useEffect, useMemo } from 'react';
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
import { isValidEmail } from '../helpers/helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import { userReducer } from '../helpers/redux/userSlice';
import { authUserType, UserType } from '../services/models';
import { createItem } from '../services/api';


const screenWidth = Dimensions.get('window').width;

const SignupScreen: FC<any> = (props) => {

  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
    
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')

  const displayName = useMemo(() => {
    let result = (lastName) ? `${firstName} ${lastName}` : `${firstName}`
    return result
  }, [firstName, lastName]);

  const title = 'Welcome'

  const onSetAuthUser = (user: any) => {
    dispatch(
      userReducer({user})
    );
  }

  const isFormValidate = () => {

    if (!firstName) {
      setFirstNameError("First name can't be empty")
      return false
    } else {
      setEmailError('')
    }

    if (!email) {
      setEmailError("Email Can't be empty")
      return false
    } else if (!isValidEmail(email)) {
      setEmailError('Incorrect Email format')
      return false
    } else {
      setEmailError('')
    }

    if (!password) {
      setPasswordError("Password can't be empty")
      return false
    } else if (password.length < 8){
      setPasswordError('Password should be longer than 8')
      return false
    } else {
      setPasswordError('')
    }

    return true
  }

  const onFirstName = (text: string) => {    
    setFirstName(text)
    setFirstNameError('')
  }

  const onEmail = (email: string) => {
    setEmailError('')
    setEmail(email)
  }

  const onPassword = (text: string) => {    
    setPassword(text)
    setEmailError('')
  }

  const creatNewAppAccount = async(userId: string) => {
    try {
      const userResponse: any = createItem('user', {user_id: userId})
      if (userResponse.data && userResponse.data.success) {
        return true
      }
    } catch (error) {
      console.log(error)
    }
    return false
  }

  // const registerWithEmail = async (email: string, password: string) => {
  //   try {
  //     const {user} = await auth().createUserWithEmailAndPassword(email, password)
  //     await user.sendEmailVerification()
  //     return true
  //   } catch (e) {
  //     console.log(e)
  //     return false
  //   }
  // }

  const onRegister = async () => {

    if (!isFormValidate()) {
      return false
    }

    setIsLoading(true)
    setLoadingText('Loading')

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async(response) => {
        
        const update = {
          displayName
        };
        auth().currentUser?.updateProfile(update)

        //auth().currentUser?.updatePhoneNumber(phoneNumber)

        // success?
        const creatResponse = await creatNewAppAccount(response.user.uid)

        if (creatResponse) {
          const user = {
            uid: response.user.uid,
            email: response.user.email,
            displayName: response.user.displayName,
          }
          onSetAuthUser(user)
        }

        setIsLoading(false)
        setLoadingText('')        
        
      })
      .catch(error => {        
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          setEmailError('That email address is already in use!')
        }
    
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          setEmailError('That email address is invalid!')
        }
    
        console.error(error);


        setIsLoading(false)
        setLoadingText('')
    });
  }  

  const onGoback = () => {
    props.navigation.navigate('Login')
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
        title={"Sign up"}
        back={true}
        onSearch={() => {}}
        onBack={onGoback}
        onSave={() => {}}
        onMore={() => {}}
      />
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <View style={styles.groupWrapper}>
            <Text>First Name*</Text>
            <TextInput
              style={styles.formFieldStyle}
              onChangeText={(text) => {onFirstName(text)}}
              underlineColorAndroid="transparent"
              placeholder={'First name'}
              placeholderTextColor={"#ccc"}
            />
            {firstNameError && (
              <Text style={styles.error}>{firstNameError}</Text>
            )}
          </View>
          <View style={styles.groupWrapper}>
            <Text>Last Name</Text>
            <TextInput
              style={styles.formFieldStyle}
              onChangeText={(text) => {setLastName(text)}}
              underlineColorAndroid="transparent"
              placeholder={'Last name'}
              placeholderTextColor={"#ccc"}
            />
          </View>
          <View style={styles.groupWrapper}>
            <Text>Email*</Text>
            <TextInput
              style={styles.formFieldStyle}
              onChangeText={(text) => {onEmail(text)}}
              underlineColorAndroid="transparent"
              placeholder={'Email address'}
              placeholderTextColor={"#ccc"}
            />
            {emailError && (
              <Text style={styles.error}>{emailError}</Text>
            )}
          </View>
          {/* <View style={styles.groupWrapper}>
            <Text>Phone Number</Text>
            <TextInput
              style={styles.formFieldStyle}
              onChangeText={(text) => {setPhoneNumber(text)}}
              underlineColorAndroid="transparent"
              placeholder={'Phone number'}
              placeholderTextColor={"#ccc"}
            />
          </View> */}
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

          <View style={styles.spaceVertical}></View>

          <View style={styles.groupWrapper}>
            <TouchableOpacity
              onPress={onRegister}
            >
              <View style={styles.buttonWrapper}>
                <Text style={styles.button}>{'Register'}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.spaceVertical}></View>

          <View style={styles.groupWrapper}>
            <Text style={{marginRight: 20}}>Have an account already?</Text>
            <TouchableOpacity
              onPress={onGoback}
            >
              <Text style={styles.link}>{'Login'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
    marginVertical: 5,
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

export default SignupScreen;