import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Footer from '../components/BottomSheetComponent';
import Header from '../components/Header';
import { ActionType } from '../services/models';


const SettingsScreen: FC=(props) => {
  const action: ActionType = {
    type: 'Save',
    label: 'Save'
  }
  return (
    <View style={styles.page}>
      <Header
        title={"Account"}
        back={false}
        action={action}
        onSearch={() => {}}
        onBack={() => {}}
        onSave={() => {}}
        onMore={() => {}}
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  pricingStyle: {
    width: '100%',
    padding: 20,
    marginBottom: 10,
  },
});

export default SettingsScreen;