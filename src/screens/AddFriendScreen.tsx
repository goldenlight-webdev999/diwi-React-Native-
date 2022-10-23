import React, { FC, useState } from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Modal from "react-native-modal";
import Header from '../components/Header';
import { ActionType, FriendType, ItemDataType } from '../services/models';
import uuid from 'react-native-uuid';


const AddFriendScreen: FC<any>=({ route, navigation }) => {
  //const item: ItemDataType = route.params;
  const action: ActionType = {
    type: 'Save',
    label: 'Save'
  }

  const [name, setName] = useState('');
  const onBack = () => {
    navigation.navigate('Friends', { new: null, } )
  }

  const onAddFriend = () => {

    if (name === '') {
      return
    }

    const id = uuid.v4();
    const newFriend ={
      id,
      name
    }
    
    navigation.navigate('Friends', { new: newFriend, } )
  } 

  return (
    <>
      <View>
        <Header
          title={"Add Friend"}
          back={true}
          //action={action}
          onSearch={() => {}}
          onSave={() => {}}
          onMore={() => {}}
          onBack={onBack}
        />
        <View style={styles.container}>
          <TextInput
            style={ styles.inputField}
            onChangeText={(text) => {setName(text)}}
            value={name}
            underlineColorAndroid="transparent"
            placeholder={"New Friend's Name"}
            placeholderTextColor={"#ccc"}
          />
          <TouchableOpacity
            onPress={onAddFriend}
            style={styles.addBtnStyle}
          >
            <Text style={styles.addBtnText}>Add Friend</Text>
          </TouchableOpacity>
        </View>
      </View>      
    </>
    
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputField: {
    height: 40,
    borderBottomWidth: 1,
    margin: 5,
    color: '#000',
    backgroundColor: 'transparent',
    width: '100%',
  },
  addBtnStyle: {
    backgroundColor: '#b637ab',
    borderRadius: 20,
    width: '100%',
    paddingVertical: 10,
    marginTop: 20,
  },
  addBtnText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default AddFriendScreen;