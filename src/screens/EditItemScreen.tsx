import React, { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { itemReducer } from "../helpers/redux/itemSlice";
import { friendsData } from '../services/mockup';
import CustomImage from '../components/CustomImage';


const EditItemScreen: FC<any>=({ route, navigation }) => {
  const item = useSelector((state: any) => state.itemReducer.item)
  
  const [pic, setPic] = useState(item.pic)
  const [title, setTitle] = useState(item.title)
  const [location, setLocation] = useState(item.location)
  const [friends, setFriends] = useState(item.friends as FriendType[])
  const [date, setDate] = useState(item.date)
  const [note, setNote] = useState(item.note)
  const [allFriends, setAllFriends] = useState(friendsData)
  
  const action: ActionType = {
    type: 'Save',
    label: 'Save'
  }

  const dispatch = useDispatch();

  const onAddFriend = () => {
    navigation.navigate('Friends', {new: null,} )
  }

  const onDeleteFriend = (id: string) => {
    const newFriends = friends.filter(f => (f.id !== id))
    setFriends(newFriends)
  }

  const onSave = () => {
    const newItem: ItemDataType = {
      id: item.id,
      title,
      location,
      date,
      friends,
      note,
      pic,
    }

    // Call save API endpoint

    // if success =>    
    dispatch(
      itemReducer({item: newItem})
    );

    navigation.navigate('Detail')
  }

  const onBack = () => {

    dispatch(
      itemReducer({item: item})
    );
    navigation.navigate('Detail')
  }

  useEffect(() => {  
    setPic(item.pic)
    setTitle(item.title)
    setLocation(item.location)
    setFriends(item.friends as FriendType[])
    setDate(item.date)
    setNote(item.note)
    setAllFriends(friendsData)
  }, [route])

  return (
    <>
      <View>
        <Header
          title={"Edit Look"}
          back={true}
          action={action}
          onSearch={() => {}}
          onSave={onSave}
          onMore={() => {}}
          onBack={onBack }
        />
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            <CustomImage
              type={item.pic.type}
              src={item.pic.src}
              isImage={false}
              size='image'
            />
          </View>
          <View style={styles.infoWrapper}>            
            <TextInput
              style={styles.formFieldStyle}
              onChangeText={(text) => setTitle(text)}
              underlineColorAndroid="transparent"
              value={title}
            />
            <TextInput
              style={styles.formFieldStyle}
              onChangeText={(text) => setLocation(text)}
              underlineColorAndroid="transparent"
              value={location}
            />
            <View style={styles.addFriendWrapper}>
              {friends && friends.length>0 && (
                friends.map((friend, index) => (
                  <View style={styles.formFriendWrapper} key={index}>                
                    <Text style={styles.friendText}>{friend.name}</Text>
                    <TouchableOpacity
                      onPress={() => onDeleteFriend(friend.id)}
                    >
                      <Icon name="close" color={'#fff'} size={20} style={styles.closeBtn} />
                    </TouchableOpacity>
                  </View>
                ))
              )}             
              
              <TouchableOpacity
                onPress={onAddFriend}
              >
                <Text style={styles.addFriendTextStyle}>Add a Friend +</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.formFieldStyle}
              onChangeText={(text) => setDate(text)}
              underlineColorAndroid="transparent"
              value={date}
            />
            <TextInput
              style={styles.formFieldStyle}
              onChangeText={(text) => setNote(text)}
              underlineColorAndroid="transparent"
              value={note}
            />            
          </View>
        </View>
      </View>      
    </>
    
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageWrapper: {
    width: '100%',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    resizeMode: 'cover',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: '#000',
  },
  moreModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  infoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '80%',
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
  formFriendWrapper: {    
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    color: '#fff',
    backgroundColor: '#4dabe9',
    borderRadius: 30,
    padding: 10,
  },
  friendText: {
    color: '#fff',
  },
  closeBtn: {
    marginLeft: 5,
  },
  addFriendTextStyle: {    
    borderColor: '#ccc',
    textDecorationLine: 'underline',
    marginLeft: 10
  },
  addFriendWrapper: {
    display:'flex',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default EditItemScreen;