import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Image,
  Pressable,
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
import { itemReducer } from "../helpers/redux/itemSlice";
import { ActionType, FriendType, ItemDataType } from '../services/models';
import CustomImage from '../components/CustomImage';


const DetailScreen: FC<any>=({ route, navigation }) => {
  //const item: ItemDataType = route.params;
  const action: ActionType = {
    type: 'More',
    label: '...'
  }

  const [openPicModal, setOpenPicModal] = useState(false)
  const [openMoreModal, setOpeMoreModal] = useState(false)

  const dispatch = useDispatch();
  const item = useSelector((state: any) => state.itemReducer.item)
  //console.log('-----Detail---------', item)
  const friends: FriendType[] = item.friends

  const onMore = () => {
    setOpeMoreModal(true)
  }

  const onDelete = () => {
    setOpeMoreModal(false)
    navigation.navigate('Home', {from: 'Detail', data: []})
  }

  const onViewImage = () => {
    setOpenPicModal(true)
  }

  const onEdit = () => {
    setOpeMoreModal(false)
    dispatch(
      itemReducer({item: item})
    );
    navigation.navigate('Edit')
  }

  return (
    <>
      <View>
        <Header
          title={"Look"}
          back={true}
          action={action}
          onSearch={() => {}}
          onSave={() => {}}
          onMore={onMore}
          onBack={() => navigation.navigate('Home', {from: 'Detail', data: []})}
        />
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            <TouchableOpacity
              onPress={onViewImage}
            >
              <CustomImage
                isImage={true}
                type={item.pic.type}
                src={item.pic.src}
                size='image'
              />
            </TouchableOpacity>
          </View>
          <View style={styles.infoWrapper}>
            <Text>{ item.title }</Text>
            <Text>{ item.location }</Text>
            <Text>{ item.date }</Text>
            <View style={styles.friendsWrapper}>
              {friends && friends.length > 0 && (
                friends.map((f, index) => (
                  <Text style={styles.friendItem} key={index}> { f.name } </Text>
                ))
              )}
            </View>
            
            <Text>{ item.note }</Text>
          </View>
        </View>
      </View>
      <Modal
        isVisible={openPicModal}
        animationIn='fadeIn'
        animationOut='fadeOut'
        onSwipeComplete={() => setOpenPicModal(false)}
        swipeDirection='right'
      >
        <TouchableWithoutFeedback onPress={() => {  }}>
          <CustomImage
            isImage={false}
            type={item.pic.type}
            src={item.pic.src}
            size='image'
          />
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        isVisible={openMoreModal}
        animationIn='slideInUp'
        animationOut='slideOutDown'
      >
        <View style={styles.moreModal}>
          <TouchableOpacity style={styles.btnWrapper} onPress={onEdit}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnWrapper} onPress={onDelete}>
            <Text style={styles.deleteBtn}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnWrapper} onPress={() => {setOpeMoreModal(false)}}>
            <Text style={styles.cancelBtn}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  imageInner: {
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
  },
  moreModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWrapper: {
    borderRadius: 25,
    backgroundColor: '#fff',
    overflow: 'hidden',
    paddingVertical: 10,
    width: '100%',
    marginVertical: 5,
  },
  editBtn: {
    backgroundColor: '#fff',
    color: 'blue', 
    textAlign: 'center',
  },
  deleteBtn: {
    backgroundColor: '#fff',
    color: 'red',
    textAlign: 'center',
  },
  cancelBtn: {
    backgroundColor: '#fff',
    color: 'blue',    
    textAlign: 'center',
  },
  infoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendsWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  friendItem: {
    backgroundColor: 'green',
    color: 'white',
    margin: 5,
    padding: 5,
    borderRadius: 5,
  }
});

export default DetailScreen;