import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Header from '../components/Header';
import { actionType } from '../services/models';


const SettingsScreen: FC=(props) => {
  const action: actionType = {
    type: '1',
    label: 'Save'
  }
  return (
    <SafeAreaView>
      <Header title={"Account"} back={false} action={action} onSearch={() => {}} onBack={() => {}}></Header>
      <View style={styles.container}>
        <View style={styles.formStyle}>
          <Text>Email</Text>
          <TextInput
            style={styles.formFieldStyle}
            onChangeText={(text) => {}}
            underlineColorAndroid="transparent"
            placeholder={'Type your email...'}
            placeholderTextColor={"#ccc"}
          />
          <Text>Current Password</Text>
          <TextInput
            style={styles.formFieldStyle}
            onChangeText={(text) => {}}
            underlineColorAndroid="transparent"
            placeholder={'Type your current password...'}
            placeholderTextColor={"#ccc"}
            secureTextEntry={true}
          />
          <Text>New Password</Text>
          <TextInput
            style={styles.formFieldStyle}
            onChangeText={(text) => {}}
            underlineColorAndroid="transparent"
            placeholder={'Type your new password...'}
            placeholderTextColor={"#ccc"}
            secureTextEntry={true}
          />
          <Text>Confirm New Password</Text>
          <TextInput
            style={styles.formFieldStyle}
            onChangeText={(text) => {}}
            underlineColorAndroid="transparent"
            placeholder={'Type your new password again...'}
            placeholderTextColor={"#ccc"}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.pricingStyle}>
          <Text>Pricing Plans</Text>
        </View>
      </View>      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  },
  pricingStyle: {
    width: '100%',
    padding: 20,
    marginBottom: 10,
  },
});

export default SettingsScreen;