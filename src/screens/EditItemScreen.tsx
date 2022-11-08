import React, { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Animated,
  View
} from 'react-native';
import Modal from "react-native-modal";
import Header from '../components/Header';
import { ActionType, FriendType, ItemDataType } from '../services/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { itemReducer } from "../helpers/redux/itemSlice";
import { userReducer } from "../helpers/redux/userSlice";
import { friendsData } from '../services/mockup';
import CustomImage from '../components/CustomImage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { createItem, deleteItem, updateItem } from '../services/api';
import { totalItemsReducer } from '../helpers/redux/totalItemsSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import { StackActions } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker'
import { formatDate, formatDateServer } from '../helpers/helper';
import { initItem, initMedia } from '../services/constants';

const EditItemScreen: FC<any>=({ route, navigation }) => {
  const inItem: ItemDataType = useSelector((state: any) => state.itemReducer.item)
  const item: ItemDataType = inItem ? inItem : initItem
  const user: any = useSelector((state: any) => state.userReducer.user)

  const items: ItemDataType[] = useSelector((state: any) => state.totalItemsReducer.items)
  const screenWidth = Dimensions.get('window').width;

  const from = (route.params && route.params.from) ? route.params.from : ''

  const inMediaType = item.media && item.media.type ? item.media.type : 'photo'
  const inMediaSrc = item.media && item.media.src ? item.media.src : ''

  
  const [mediaType, setMediaType] = useState(inMediaType)
  const [mediaSrc, setMediaSrc] = useState(inMediaSrc)
  const [title, setTitle] = useState(item.title)
  const [location, setLocation] = useState(item.location)
  const [friends, setFriends] = useState(item.friends as FriendType[])
  //const [date, setDate] = useState(item.date)
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(item.note)
  const [allFriends, setAllFriends] = useState(friendsData)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const [lookId, setLookId] = useState(item.id)

  
  
  const action: ActionType = {
    type: 'Save',
    label: 'Save'
  }

  const dispatch = useDispatch();

  const onAddFriend = () => {
    //navigation.navigate('Friends')

    const pushAction = StackActions.push('Friends')
    navigation.dispatch(pushAction);
  }

  const onDeleteFriend = async(id: string) => {

    const newFriends = friends.filter(f => (f.id !== id))
    setFriends(newFriends)

  }

  const uploadMedia = async (name: string) => {    

    const formData = new FormData()

    formData.append("name", name);
    formData.append("user_id", user.uid);
    formData.append("type", mediaType);
    
    formData.append('file', {
      uri: mediaSrc,
      type: (mediaType === 'photo') ? 'image/jpeg' : 'video/mp4',
      name: name,
    });    

    try {
      const mediaResponse = await createItem('media', formData, 'form')      
      
      if (mediaResponse.data && mediaResponse.data.success) {
        return mediaResponse.data.data
      }
      
    } catch (error) {
      console.log(error)
    }

    return false
  }

  const onSave = async() => {

    let newMediaId = item.media.id
    let newMediaName = item.media.name

    setIsLoading(true)
    setLoadingText('Saving')

    if (!mediaSrc) {
      newMediaId = ''
      newMediaName = ''
    } else if (mediaSrc.startsWith('file://')) {
      newMediaName = mediaType + "_" + mediaSrc.substring(mediaSrc.lastIndexOf('/')+1)
      const mediaResponse = await uploadMedia(newMediaName)

      if (mediaResponse) {
        newMediaId = mediaResponse.id
      } else {
        console.log('Failed to upload the media')
      }
    }

    const newItem: ItemDataType = {
      id: lookId,
      title,
      location,
      date: formatDate(date),
      friends,
      note,
      media: {
        id: newMediaId,
        name: newMediaName,
        type: mediaType,
        src: mediaSrc,
      },
    }

    // Call save API endpoint
    const friendIds = JSON.stringify(friends.map(f => f.id))
    
    const formData = {
      title,
      location,
      date: formatDateServer(date),
      friends: friendIds,
      note,
      media: newMediaId,
    }

    
    const response = await updateItem(lookId, 'look', formData)
    console.log('response', response.data)
    if (response.data && response.data.success) {

      dispatch(
        itemReducer({item: newItem})
      );

      let newItems: ItemDataType[] = []
      
      items.forEach(i => {
        if (i.id === newItem.id) {
          newItems = [...newItems, newItem]          
        } else {
          newItems = [...newItems, i]
        }
      });

      dispatch(
        totalItemsReducer({items: newItems})
      );

      setIsLoading(false)
      setLoadingText('')

      navigation.navigate('Detail')
    }
    setIsLoading(false)
    setLoadingText('')
  }

  const onBack = () => {

    dispatch(
      itemReducer({item: item})
    );
    navigation.navigate('Detail')
  }

  const onCaptureMedia = () => {
    navigation.navigate('Capture', {
      from: 'Edit',
      path: '',
      type: '',
    });
    
  }

  const onDeleteMedia = () => {
    let newItem: ItemDataType = item
    newItem.media = {  
      id: '',
      name: item.media.name,
      type: 'photo',
      src: '',
    }
    
    setMediaSrc('')

    dispatch(
      itemReducer({item: newItem})
    );

  }

  const onBookmark = () => {

  }

  useEffect(() => {    
    const unsubscribe = navigation.addListener('focus', () => {      
      setTitle(item.title)
      setLocation(item.location)
      setFriends(item.friends)
      setDate(new Date(item.date))
      setNote(item.note)
      setAllFriends(friendsData)
    });
    return unsubscribe;
  }, [navigation])

  useEffect(() => {
    console.log('---This is Edit Screen--------from-', from, route.params)
    if (from === 'Capture') {
      setMediaType(route.params.media.type)
      setMediaSrc(route.params.media.path)
      setLookId(route.params.lookId)
    } else {
      setMediaType(item.media.type)
      setMediaSrc(item.media.src)
    }
  }, [route.params]);


  // useEffect(() => {    
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     console.log('-------from----------', from, route.params)
  //     if (from === 'Capture') {
  //       setMediaType(route.params.media.type)
  //       setMediaSrc(route.params.media.src)
  //     } else {
  //       setMediaType(item.media.type)
  //       setMediaSrc(item.media.src)
  //     }
  //     });
  //     return unsubscribe;
  //   }, [navigation])

  const styles = StyleSheet.create({
    spinnerTextStyle: {
      color: '#FFF'
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageWrapper: {
      width: '100%',
      height: 250,
      position: 'relative',
    },
    imageEditWrapper: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      paddingHorizontal: 20,
      height: 60,
      backgroundColor: '#000000b8',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    imageEditItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
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
      width: screenWidth - 80,
    },
    itemWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginVertical: 5,
      width: '100%',
    },
    itemIcon: {
  
    },
    formTitleFieldStyle: {
      height: 40,
      borderWidth: 1,
      marginTop: 5,
      marginBottom: 5,
      color: '#000',
      borderColor: '#ccc',
      backgroundColor: '#fff',
      borderRadius: 8,
      width: "100%",
    },
    formNoteFieldStyle: {
      height: 120,
      borderWidth: 1,
      marginTop: 5,
      marginBottom: 5,
      color: '#000',
      borderColor: '#ccc',
      backgroundColor: '#fff',
      borderRadius: 8,
      width: screenWidth - 110,
    },
    formFieldStyle: {
      paddingVertical: 10,
      color: '#000',
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#fff',
      borderRadius: 8,
      width: screenWidth - 110,
      paddingHorizontal: 15,
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

  return (
    <>
      <KeyboardAvoidingView behavior="position">
        <Spinner
          visible={isLoading}
          textContent={`${loadingText}...`}
          textStyle={styles.spinnerTextStyle}
        />
        <DatePicker
          modal
          mode='date'
          open={open}
          date={new Date()}
          onConfirm={(date) => {
            setOpen(false)
            setDate(date)
          }}
          onCancel={() => {
            setOpen(false)
          }}
        />
        <Header
          title={"Edit Look"}
          back={true}
          action={action}
          onSearch={() => {}}
          onSave={onSave}
          onMore={() => {}}
          onBack={onBack }
        />
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <View style={[styles.imageWrapper]}>
              <CustomImage
                type={mediaType}
                src={mediaSrc}
                isImage={false}
                size='image'
              />
              <View style={[styles.imageEditWrapper]}>
                <View style={[styles.imageEditItem]}>
                  <TouchableOpacity
                    onPress={onCaptureMedia}
                  >
                    <Icon style={styles.itemIcon} name="camera" color={'#fff'} size={30} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.imageEditItem]}>
                  <TouchableOpacity
                    onPress={onBookmark}
                  >
                    <Icon style={styles.itemIcon} name="bookmark" color={'#fff'} size={30} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onDeleteMedia}
                  >
                    <Icon style={styles.itemIcon} name="delete" color={'#fff'} size={30} />
                  </TouchableOpacity>

                </View>
              </View>
            </View>
            <View style={styles.infoWrapper}>            
              <TextInput
                style={styles.formTitleFieldStyle}
                onChangeText={(text) => setTitle(text)}
                underlineColorAndroid="transparent"
                value={title}
              />
              <View style={styles.itemWrapper}>
                <Icon style={styles.itemIcon} name="map-marker-outline" color={'#888'} size={30} />
                <TextInput
                  style={styles.formFieldStyle}
                  onChangeText={(text) => setLocation(text)}
                  underlineColorAndroid="transparent"
                  value={location}
                />
              </View>

              <View style={styles.itemWrapper}>
                <Icon style={styles.itemIcon} name="calendar-range" color={'#888'} size={30} />
                <Text
                  style={styles.formFieldStyle}
                  onPress={()=>{setOpen(true)}}
                >
                  {formatDate(date)}
                </Text>
              </View>

              <View>
                <View style={styles.itemWrapper}>
                  <Icon style={styles.itemIcon} name="account-multiple-outline" color={'#888'} size={30} />
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
                  </View>
                </View>
                <TouchableOpacity
                  onPress={onAddFriend}
                >
                  <Text style={styles.addFriendTextStyle}>Add a Friend +</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.itemWrapper}>
                <Icon style={styles.itemIcon} name="text-box-outline" color={'#888'} size={30} />
                <TextInput
                  style={styles.formFieldStyle}
                  onChangeText={(text) => setNote(text)}
                  underlineColorAndroid="transparent"
                  value={note}
                />
              </View>
            </View>
          </View>          
        </KeyboardAwareScrollView>
        
      </KeyboardAvoidingView>      
    </>
    
  );
};

export default EditItemScreen;