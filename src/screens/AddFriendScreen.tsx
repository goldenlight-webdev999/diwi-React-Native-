import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  View
} from 'react-native';
import Modal from "react-native-modal";
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import { createItem } from '../services/api';
import { userReducer } from '../helpers/redux/userSlice';
import { ActionType, FriendType, ItemDataType } from '../services/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { checkStorage, saveStorage } from '../helpers/helper';

const AddFriendScreen: FC<any>=({ route, navigation }) => {
  const user: any = useSelector((state: any) => state.userReducer.user)

  // -------Guide modals----------
  const [openStep5Modal, setOpenStep5Modal] = useState(false)
  
  const action: ActionType = {
    type: 'Save',
    label: 'Save'
  }

  const [name, setName] = useState('');
  const onBack = () => {
    navigation.navigate('Friends')
  }

  const showTutorModals = async () => {

    const isVisitedStep5 = await checkStorage('step5')
    if (!isVisitedStep5) {
      setOpenStep5Modal(true)      
    }
  }
  
  const onCloseStep5Modal = () => {
    setOpenStep5Modal(false)
    saveStorage('step5')
  }

  const onAddFriend = async() => {
    
    if (name === '') {
      return
    }
    
    try {
      const friendResponse = await createItem('friend', {name, user_id: user.uid})
      if (friendResponse.data && friendResponse.data.success) {
        
        const newFriend = friendResponse.data.data
        navigation.navigate('Friends', {new: newFriend})
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {   
    showTutorModals()
  }, [])

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
        <Modal
          isVisible={openStep5Modal}
          animationIn='fadeIn'
          animationOut='fadeOut'
          hasBackdrop={false}
          style={styles.step5ModalWrapper}
        >
          <View style={styles.guideWrapper}>
            <TouchableOpacity
              onPress={onCloseStep5Modal}
              style={styles.close}
            >
              <View>
                <Text style={styles.closeText}> { 'Dismiss' } </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.guideTitle}> Step 5: Add \ Create Friends </Text>
            <Text style={styles.guideDescription}> { "Add and create a friends list. Then you can attach them to your look or event. Don't forget to save!" } </Text>
            <View style={styles.step5ModalArrow}>
              <Icon name="menu-up" color={'#b637ab'} size={40} />
            </View>
            
          </View>
        </Modal>
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
  step5ModalWrapper: {
    justifyContent: "flex-start",
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 240 : 200,
  },
  guideWrapper: {
    width: 300,
    height: 200,
    position: 'relative',
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "#fff",
    borderColor: '#b637ab',
  },
  step5ModalArrow: {
    position: 'absolute',
    top: -26,
    left: 130,
  },
  guideTitle: {
    fontSize: 16,
    marginTop: 20,
  },
  guideDescription: {
    fontSize: 14,
    marginTop: 20,
  },
  close: {
    position: 'absolute',
    top: 'auto',
    bottom: 20,
    right: 20,
    zIndex: 9,
  },
  closeText: {
    color: '#b637ab',
  },
});

export default AddFriendScreen;