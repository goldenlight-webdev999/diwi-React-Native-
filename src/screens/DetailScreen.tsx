import React, { FC, useEffect, useState } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDate } from '../helpers/helper';
import { deleteItem, getItem } from '../services/api';
import Spinner from 'react-native-loading-spinner-overlay';

const DetailScreen: FC<any>=({ route, navigation }) => {
  //const item: ItemDataType = route.params;
  const action: ActionType = {
    type: 'More',
    label: '...'
  }

  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')

  const [openPicModal, setOpenPicModal] = useState(false)
  const [openMoreModal, setOpeMoreModal] = useState(false)

  const dispatch = useDispatch();
  const initem = useSelector((state: any) => state.itemReducer.item)
  const [item, setItem] = useState(initem)
  //console.log('-----Detail---------', item)
  const friends: FriendType[] = item.friends

  const onMore = () => {
    setOpeMoreModal(true)
  }

  const onDelete = async() => {
    setOpeMoreModal(false)
    setIsLoading(true)
    setLoadingText('Deleting')

    if (item.media.id) {
      /**
       * Delete Look's media
       */
      //console.log(`Deleting media: ${item.media.id}`)
      try {
        const response = await deleteItem(item.media.id, 'media')
        //console.log("response.data", response.data)
      } catch (error) {
        console.log(`Failed to delete media with id ${item.media.id}: ${error}`)
      }
    }

    /**
     * Delete Look
     */
     console.log(`Deleting Look: ${item.id}`)
    try {
      const response = await deleteItem(item.id, 'look')
      //console.log("response.data", response.data)
      if (response.data && response.data.success) {
        setIsLoading(false)
        setLoadingText('')
        navigation.navigate('Home', {from: 'Detail', data: []})
      }
    } catch (error) {
      console.log(`Failed to delete Look with id ${item.id}: ${error}`)
    }
    setIsLoading(false)
    setLoadingText('')
    
  }

  const onViewImage = () => {
    setOpenPicModal(true)
  }

  const onEdit = () => {
    setOpeMoreModal(false)
    dispatch(
      itemReducer({item: item})
    );
    navigation.navigate('Edit', {item: item})
  }

  const getLookDetail = async() => {
    let look = initem
    const lookRes = await getItem(initem.id,'look')

    if (lookRes.data && lookRes.data.success) {
      look = lookRes.data.data
      setItem(look)
      dispatch(
        itemReducer({item: look})
      );
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLookDetail()
    });
    return unsubscribe;
  }, [navigation])

  return (
    <>
      <View>
        <Spinner
          visible={isLoading}
          textContent={`${loadingText}...`}
          textStyle={styles.spinnerTextStyle}
        />
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
                type={item.media.type}
                src={item.media.src}
                size='image'
              />
            </TouchableOpacity>
          </View>
          <View style={styles.infoWrapper}>
            <View style={styles.itemWrapper}>
              <Text style={styles.title}>{ item.title }</Text>
            </View>

            <View style={styles.itemWrapper}>
              <Icon style={styles.itemIcon} name="map-marker-outline" color={'#888'} size={30} />
              <Text style={styles.item}>{ item.location }</Text>
            </View>

            <View style={styles.itemWrapper}>
              <Icon style={styles.itemIcon} name="calendar-range" color={'#888'} size={30} />
              <Text style={styles.date}>{ formatDate(item.date) }</Text>
            </View>

            <View style={styles.itemWrapper}>
              <Icon style={styles.itemIcon} name="account-multiple-outline" color={'#888'} size={30} />
              <View style={styles.friendsWrapper}>
                {friends && friends.length > 0 && (
                  friends.map((f, index) => (
                    <View style={styles.friendItem} key={index}>
                      <Text> { f.name } </Text>
                    </View>
                  ))
                )}
              </View>
            </View>

            <View style={styles.itemWrapper}>
              <Icon style={styles.itemIcon} name="text-box-outline" color={'#888'} size={30} />
              <Text style={styles.item}>{ item.note }</Text>
            </View>
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
            type={item.media.type}
            src={item.media.src}
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
  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
    textAlign: 'center',
  },
  infoWrapper: {
    width: '100%',
    padding: 20,
  },
  itemWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
  },
  itemIcon: {

  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    width: '100%',
  },
  item: {
    width: '100%',    
  },
  date: {
    width: '100%',
  },
  friendsWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  friendItem: {
    backgroundColor: '#b637ab',
    color: 'white',
    margin: 5,
    padding: 5,
    borderRadius: 20,
  }
});

export default DetailScreen;