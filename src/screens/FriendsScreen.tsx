import React, { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
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
import CheckBox from '@react-native-community/checkbox';
import Modal from "react-native-modal";
import Header from '../components/Header';
import { ActionType, FriendType, ItemDataType } from '../services/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { itemReducer } from "../helpers/redux/itemSlice";
import { friendsData } from '../services/mockup';
import { initFriend, initFriendsData } from '../services/constants';


const FriendsScreen: FC<any>=({ route, navigation }) => {
  const item = useSelector((state: any) => state.itemReducer.item)
  
  const initFriends: FriendType[] = item.friends
  const action: ActionType = {
    type: 'Save',
    label: 'Add'
  }

  const dispatch = useDispatch()
  
  const [allFriends, setAllFriends] = useState(initFriendsData)
  
  const [myFriends, setMyFriends] = useState(initFriends)
  const [searchText, setSearchText] = useState('')
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deleteFriend, setDeleteFriend] = useState(initFriend)

  const onSave = () => {
    let newItem: ItemDataType = item
    newItem.friends = myFriends

    updateState(newItem)
      .catch()
      .then(() =>
        navigation.navigate('Edit')
      )

    // Call save API endpoint

    // if success =>    
    // const a = dispatch(
    //   itemReducer({item: newItem})
    // )
    //console.log("a", a.payload.item.friends.length)
    //navigation.navigate('Edit')
  }

  const updateState = async (item: any) => {
    const a = dispatch(
      itemReducer({item: item})
    )
  }

  const onBack = () => {
    navigation.navigate('Edit')
  }

  const onAddNewFriend = () => {
    navigation.navigate('AddFriend')
  }

  const isChecked = (id: string) => {
    let result = false
    const filtered = myFriends.filter(f => f.id === id)
    if (filtered && filtered.length > 0) {
      result = true
    }
    return result
  }

  const onChangeCheck = (val: boolean, friend: FriendType) => {    
    let newFriends: FriendType[] = []
    if (val) {
      newFriends = [...myFriends, friend]
    } else {
      newFriends = myFriends.filter(f => f.id !== friend.id)
    }
    setMyFriends(newFriends)
  }

  const onModal = (friend: FriendType) => {
    setDeleteFriend(friend)
    setOpenDeleteModal(true)
  }

  const onDelete = () => {
    //Delete Friend

    const newAllFriends = allFriends.filter(f => f.id !== deleteFriend.id)
    setAllFriends(newAllFriends)
    setOpenDeleteModal(false)

  }

  useEffect(() => {
    const newFriend: FriendType = route.params.new;
    const initAllFriends: FriendType[] = (newFriend) ? [...friendsData, newFriend] : [...friendsData];
    setAllFriends(initAllFriends)
  }, [route])

  return (
    <>
      <View>
        <Header
          title={"Friends"}
          back={true}
          action={action}
          onSearch={() => {}}
          onSave={onSave}
          onMore={() => {}}
          onBack={onBack}
        />
        <View style={styles.container}>
          <View>
            <View style={{ width:'100%' }}>
              <TextInput
                style={ styles.searchField}
                onChangeText={(text) => setSearchText(text)}
                value={searchText}
                underlineColorAndroid="transparent"
                placeholder={'Search for a friend'}
                placeholderTextColor={"#ccc"}
              />
            </View>
          </View>
          <View style={styles.friendsWrapper}>
            {allFriends.map((friend, index) => (
              <View style={styles.friendItem} key={index}>
                <CheckBox
                  disabled={false}
                  value={isChecked(friend.id)}
                  onValueChange={(val) => onChangeCheck(val, friend)}
                />
                <Text>{friend.name}</Text>
                <TouchableOpacity
                  onPress={()=>onModal(friend)}
                  style={{}}
                >
                  <Icon name="delete" color={'#ccc'} size={20} />
                </TouchableOpacity>
                
              </View>
            ))}
          </View>
          <View style={styles.bottomWrapper}>
            <Text style={styles.bottomText}>1 Friend</Text>
            <TouchableOpacity onPress={onAddNewFriend} style={styles.bottomBtn}>
              <Icon name="account-plus" color={'#000'} size={20} />
            </TouchableOpacity>
          </View>
        </View>
          
      </View>
      <Modal
        isVisible={openDeleteModal}
        animationIn='slideInUp'
        animationOut='slideOutDown'
      >
        <View style={styles.moreModal}>
          <View style={styles.modalContent}>
            <Text style={styles.titleStyle}>{`Delete "${deleteFriend.name}"?`}</Text>
            <TouchableOpacity onPress={onDelete}>
              <Text style={styles.deleteBtn}>Delete</Text>
            </TouchableOpacity>
          </View>          
          <TouchableOpacity style={styles.cancelBtn} onPress={() => {setOpenDeleteModal(false)}}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
    
  );
};

const styles = StyleSheet.create({
  container: {    
    position: 'relative',
    width: '90%',
    height: '90%',
    marginLeft: '5%',
  },
  bottomWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    width: '100%',    
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,    
  },
  bottomText: {
    color: '#000',
  },
  bottomBtn: {
    marginLeft: 50,

  },
  searchField: {
    height: 40,
    borderBottomWidth: 1,
    paddingLeft: 20,
    margin: 5,
    color: '#000',
    backgroundColor: '#fff',
  },
  friendsWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  friendItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  moreModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 5,
    width: '90%',
  },
  titleStyle: {
    color: '#ccc',
    fontSize: 12,
    width: '100%',
    textAlign: 'center',
    marginTop: 5,
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  deleteBtn: {
    color: 'red',
    width: '100%',
    textAlign: 'center',
    paddingVertical: 10,
  },
  cancelBtn: {
    backgroundColor: '#fff',
    color: 'blue',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: '90%',
  },
  cancelBtnText: {
    backgroundColor: '#fff',
    color: 'blue',
    textAlign: 'center',
  },
});

export default FriendsScreen;