import React, { FC, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../components/BottomSheetComponent';
import Header from '../components/Header';
import { ActionType } from '../services/models';
import { userReducer } from '../helpers/redux/userSlice';
import auth from '@react-native-firebase/auth';
import { isValidEmail } from '../helpers/helper';
import Spinner from 'react-native-loading-spinner-overlay';


const SettingsScreen: FC<any>=({ route, navigation }) => {

  const dispatch = useDispatch();

  const user: any = useSelector((state: any) => state.userReducer.user)
  const action: ActionType = {
    type: 'Save',
    label: 'Save'
  }

  const [email, setEmail] = useState(user.email)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [emailError, setEmailError] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [emailChangedSuccess, setEmailChangedSuccess] = useState('');
  const [passwordChangedSuccess, setPasswordChangedSuccess] = useState('');

  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')

  const isFormValidate = () => {

    if (!email) {
      setEmailError("Email Can't be empty")
      return false
    } else if (!isValidEmail(email)) {
      setEmailError('Incorrect Email format')
      return false
    } else {
      setEmailError('')
    }

    if (!currentPassword) {
      setCurrentPasswordError("Password can't be empty")
      return false
    } else {
      setCurrentPasswordError('')
    }

    if (!newPassword) {
      setNewPasswordError("Password can't be empty")
      return false
    } else if (newPassword.length < 8){
      setNewPasswordError('Password should be longer than 8')
      return false
    } else {
      setNewPasswordError('')
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("No match password")
      return false
    } else {
      setNewPasswordError('')
    }

    return true
  }

  const onSetAuthUser = (user: any) => {
    dispatch(
      userReducer({user})
    );
  }  

  const reauthenticate = (password: string) => {
    const user: any = auth().currentUser;
    const cred = auth.EmailAuthProvider.credential(
      user.email, password);
    return user.reauthenticateWithCredential(cred);
  }

  const changePassword = (currentPassword: string, newPassword: string) => {
    setIsLoading(true)
    setLoadingText('Saving')
    reauthenticate(currentPassword).then(() => {
      var user: any = auth().currentUser;
      user.updatePassword(newPassword).then(() => {
        console.log("Password updated!");
        setPasswordChangedSuccess("Password updated!")
        setIsLoading(false)
        setLoadingText('')
      }).catch((error: any) => {
        if (error.code === 'auth/wrong-password') {
          setCurrentPasswordError('Incorrect password')
        } else if (error.code === 'auth/user-mismatch') {
          setCurrentPasswordError('Incorrect email or password')
        } else {
          setCurrentPasswordError(error.toString())
        }
        setIsLoading(false)
        setLoadingText('')
      });
    }).catch((error: any) => {
      if (error.code === 'auth/wrong-password') {
        setCurrentPasswordError('Incorrect password')
      } else if (error.code === 'auth/user-mismatch') {
        setCurrentPasswordError('Incorrect email or password')
      } else {
        setCurrentPasswordError(error.toString())
      }
      setIsLoading(false)
      setLoadingText('')
    });
  }
  const changeEmail = (currentPassword: string, newEmail: string) => {
    setIsLoading(true)
    setLoadingText('Saving')
    reauthenticate(currentPassword).then(() => {
      const user: any = auth().currentUser;
      user.updateEmail(newEmail).then(() => {
        setEmailChangedSuccess("Email updated!")
        console.log("Email updated!");
        const newUser = {
          uid: user.uid,
          email: newEmail,
          displayName: user.displayName,
        }

        onSetAuthUser(newUser)
        setIsLoading(false)
        setLoadingText('')
      }).catch((error: any) => { 
        if (error.code === 'auth/wrong-password') {
          setCurrentPasswordError('Incorrect password')
        } else if (error.code === 'auth/user-mismatch') {
          setCurrentPasswordError('Incorrect email or password')
        } else {
          setCurrentPasswordError(error.toString())
        }
        setIsLoading(false)
        setLoadingText('')
       });
    }).catch((error: any) => { 
      if (error.code === 'auth/wrong-password') {
        setCurrentPasswordError('Incorrect password')
      } else if (error.code === 'auth/user-mismatch') {
        setCurrentPasswordError('Incorrect email or password')
      } else {
        setCurrentPasswordError(error.toString())
      }
      setIsLoading(false)
      setLoadingText('')
     });
  }

  const onEmail = (email: string) => {
    setEmailError('')
    setEmail(email)
  }

  const onCurrentPassword = (text: string) => {    
    setCurrentPassword(text)
    setCurrentPasswordError('')
  }

  const onNewPassword = (text: string) => {    
    setNewPassword(text)
    setNewPasswordError('')
  }

  const onConfirmPassword = (text: string) => {    
    setConfirmPassword(text)
    setConfirmPasswordError('')
  }

  const onSave = async() => {
    if (!isFormValidate()) {
      return false
    }

    changeEmail(currentPassword, email)
    if (email !== user.email) {
      changeEmail(currentPassword, email)
    }

    changePassword(currentPassword, newPassword)

  }

  const onSignout = async() => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!')
      });
  }
  return (
    <View style={styles.page}>
      <Header
        title={"Account"}
        back={false}
        action={action}
        onSearch={() => {}}
        onBack={() => {}}
        onSave={onSave}
        onMore={() => {}}
      />
      <Spinner
        visible={isLoading}
        textContent={`${loadingText}...`}
        textStyle={styles.spinnerTextStyle}
      />
      <View style={styles.container}>
        <View style={styles.formStyle}>
          <View style={styles.groupWrapper}>
            <Text>Email</Text>
            <TextInput
              style={styles.formFieldStyle}
              onChangeText={(text) => {onEmail(text)}}
              underlineColorAndroid="transparent"
              placeholder={'Type your email...'}
              placeholderTextColor={"#ccc"}
              value={email}
            />
            {emailError && (
              <Text style={styles.error}>{emailError}</Text>
            )}
          </View>
          <View style={styles.groupWrapper}>
            <Text>Current Password</Text>
            <TextInput
              style={styles.formFieldStyle}
              onChangeText={(text) => {onCurrentPassword(text)}}
              underlineColorAndroid="transparent"
              placeholder={'Type your current password...'}
              placeholderTextColor={"#ccc"}
              secureTextEntry={true}
            />
            {currentPasswordError && (
              <Text style={styles.error}>{currentPasswordError}</Text>
            )}
          </View>
          <View style={styles.groupWrapper}>
            <Text>New Password</Text>
            <TextInput
              style={styles.formFieldStyle}
              onChangeText={(text) => {onNewPassword(text)}}
              underlineColorAndroid="transparent"
              placeholder={'Type your new password...'}
              placeholderTextColor={"#ccc"}
              secureTextEntry={true}
            />
            {newPasswordError && (
              <Text style={styles.error}>{newPasswordError}</Text>
            )}
          </View>
          <View style={styles.groupWrapper}>
            <Text>Confirm New Password</Text>
            <TextInput
              style={styles.formFieldStyle}
              onChangeText={(text) => {onConfirmPassword(text)}}
              underlineColorAndroid="transparent"
              placeholder={'Type your new password again...'}
              placeholderTextColor={"#ccc"}
              secureTextEntry={true}
            />
            {confirmPasswordError && (
              <Text style={styles.error}>{confirmPasswordError}</Text>
            )}
          </View>

          {emailChangedSuccess && (
            <Text style={styles.success}>{emailChangedSuccess}</Text>
          )}

          {passwordChangedSuccess && (
            <Text style={styles.success}>{passwordChangedSuccess}</Text>
          )}

        </View>
        <View style={styles.pricingStyle}>
          <Text>Pricing Plans</Text>
        </View>

        <View >
          <TouchableOpacity
            onPress={onSignout}
          >
            <View style={styles.buttonWrapper}>
              <Text style={styles.button}>{'Sign out'}</Text>
            </View>
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  formStyle: {
    width: '100%',
    padding: 20,
    marginBottom: 0,
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
    width: '100%',
    paddingHorizontal: 15,
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
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  },
  pricingStyle: {
    width: '90%',
    padding: 20,
    minHeight: 200,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
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
});

export default SettingsScreen;