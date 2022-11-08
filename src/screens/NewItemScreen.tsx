import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
  Dimensions,
  Image,
  ImageLoadEventData,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
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
import Header from '../components/Header';
import { ActionType, FriendType, ItemDataType, MediaType } from '../services/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { itemReducer } from "../helpers/redux/itemSlice";
import { userReducer } from "../helpers/redux/userSlice";
import { friendsData, itemsData } from '../services/mockup';
import CustomImage from '../components/CustomImage';
import uuid from 'react-native-uuid';
import { initFriend, initItem, itialCaptureParams, SERVER_API_URL } from '../services/constants';
import moment from 'moment'
import Video, { LoadError, OnLoadData } from 'react-native-video';
import { useIsForeground } from '../hooks/useIsForeground';
import { StackActions, useIsFocused } from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { createItem } from '../services/api';
import Spinner from 'react-native-loading-spinner-overlay';
import { checkStorage, formatDate, formatDateServer, saveStorage } from '../helpers/helper';
import DatePicker from 'react-native-date-picker';

const screenWidth = Dimensions.get('window').width;

const isVideoOnLoadEvent = (event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>): event is OnLoadData =>
  'duration' in event && 'naturalSize' in event;

const NewItemScreen: FC<any>=({ route, navigation }) => {
  const from = (route.params.from) ? route.params.from : ''
  const inItem: ItemDataType = useSelector((state: any) => state.itemReducer.item)
  const item: ItemDataType = inItem ? inItem : initItem
  const user: any = useSelector((state: any) => state.userReducer.user)
  //const { path, type } = route.params.media
  const type = (route.params.media && route.params.media.type) ? route.params.media.type : item.media.type
  const path = (route.params.media && route.params.media.path) ? route.params.media.path : item.media.src
  const inFriends: FriendType[] = (item && item.friends) ? item.friends : []

  const name = type + "_" + path.substring(path.lastIndexOf('/')+1)
  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);
  
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [friends, setFriends] = useState(inFriends)
  const [date, setDate] = useState(new Date())
  const [note, setNote] = useState('')

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // -------Guide modals----------
  const [openStep4Modal, setOpenStep4Modal] = useState(false)
  
  const [openStep6Modal, setOpenStep6Modal] = useState(false)
  
  const action: ActionType = {
    type: 'Save',
    label: 'Save'
  }

  const dispatch = useDispatch();

  const onAddFriend = () => {
    const pushAction = StackActions.push('Friends', {from: 'New', media:{type, path}})
    navigation.dispatch(pushAction);
  }

  const onDeleteFriend = (id: string) => {
    const newFriends = friends.filter(f => (f.id !== id))
    setFriends(newFriends)
  }

  const uploadMedia = async () => {    

    const formData = new FormData()

    formData.append("name", name);
    formData.append("user_id", user.uid);
    formData.append("type", type);
    
    formData.append('file', {
      uri: source.uri,
      type: (type === 'photo') ? 'image/jpeg' : 'video/mp4',
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

  const createNewLook = async(data: any) => {
    
    try {
      const response = await createItem('look', data)
      if (response.data && response.data.success) {
        return response.data.data
      }
    } catch (error) {
      console.log(error)
    }
    return null
    
  }

  const onSave = async() => {
    
    if (!(title && location )) {
      console.log('Fill in title and location!')
      return
    }
    const friendIds = JSON.stringify(friends.map(f => f.id))

    let newLook = {
      title,
      location,
      date: formatDateServer(date),
      friends: friendIds,
      note,
      media: '',
      user_id: user.uid,
    }

    setIsLoading(true)

    if (source && source.uri) {

      const mediaResponse = await uploadMedia()

      if (mediaResponse) {
        newLook.media = mediaResponse.id
      } else {
        console.log('Failed to upload the media')
      }
      
    }

    try {
      const newLookResponse = await createNewLook(newLook)
      
      if (newLookResponse) {

        const newItems = [...itemsData, newLookResponse]
        dispatch(
          itemReducer({item: newLookResponse})
        );

        setIsLoading(false)

        navigation.navigate('Home', {from: "New", data: newItems})

      }
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
    
  }

  const onCloseStep4Modal = () => {
    setOpenStep4Modal(false)
    saveStorage('step4')
  }

  const onCloseStep6Modal = () => {
    setOpenStep6Modal(false)
    saveStorage('step6')
  }

  const showTutorModals = async () => {

    const isVisitedStep4 = await checkStorage('step4')
    if (!isVisitedStep4) {
      setOpenStep4Modal(true)
      
    } else {
      const isVisitedStep6 = await checkStorage('step6')
      if (!isVisitedStep6) {
        setOpenStep6Modal(true)
        
      }
    }
  }

  const onBack = () => {    
    navigation.navigate('Capture', {
      from: 'New',
      path,
      type,
    });
  }

  const isForeground = useIsForeground();
  const isScreenFocused = useIsFocused();
  const isVideoPaused = !isForeground || !isScreenFocused;
  const onMediaLoad = useCallback((event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>) => {
    if (isVideoOnLoadEvent(event)) {
      // console.log(
      //   `Video loaded. Size: ${event.naturalSize.width}x${event.naturalSize.height} (${event.naturalSize.orientation}, ${event.duration} seconds)`,
      // );
    } else {
      //console.log(`Image loaded. Size: ${event.nativeEvent.source.width}x${event.nativeEvent.source.height}`);
    }
  }, []);
  const onMediaLoadEnd = useCallback(() => {
    //console.log('media has loaded.');
  }, []);
  const onMediaLoadError = useCallback((error: LoadError) => {
    //console.log(`failed to load media: ${JSON.stringify(error)}`);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setFriends(item.friends)
      showTutorModals()
    });
    return unsubscribe;
  }, [navigation])


  return (
    <>
      <KeyboardAvoidingView behavior="position">
        <Spinner
          visible={isLoading}
          textContent={'Saving...'}
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
          title={"New Look"}
          back={true}
          action={action}
          onSearch={() => {}}
          onSave={onSave}
          onMore={() => {}}
          onBack={onBack }
        />
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <View style={styles.imageWrapper}>
              <>
                {type === 'photo' && (
                  <Image source={source} style={StyleSheet.absoluteFill} resizeMode="contain" onLoadEnd={onMediaLoadEnd} onLoad={onMediaLoad}/>
                )}
                {type === 'video' && (
                  <Video
                    source={source}
                    paused={isVideoPaused}
                    style={StyleSheet.absoluteFill}
                    resizeMode="contain"
                    posterResizeMode="cover"
                    allowsExternalPlayback={false}
                    automaticallyWaitsToMinimizeStalling={false}
                    disableFocus={true}
                    repeat={true}
                    useTextureView={false}
                    controls={false}
                    playWhenInactive={true}
                    ignoreSilentSwitch="ignore"
                    onReadyForDisplay={onMediaLoadEnd}
                    onLoad={onMediaLoad}
                    onError={onMediaLoadError}
                  />
                )}
              </>
            </View>
            <View style={styles.infoWrapper}>
              <TextInput
                style={styles.formTitleFieldStyle}
                onChangeText={(text) => setTitle(text)}
                underlineColorAndroid="transparent"
                value={title}
                placeholder={'title'}
              />
              <View style={styles.itemWrapper}>
                <Icon style={styles.itemIcon} name="map-marker-outline" color={'#888'} size={30} />
                <TextInput
                  style={styles.formFieldStyle}
                  onChangeText={(text) => setLocation(text)}
                  underlineColorAndroid="transparent"
                  value={location}
                  placeholder={'location'}
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
                  placeholder={'note'}
                />
              </View>

            </View>
          </View>

          <Modal
            isVisible={openStep4Modal}
            animationIn='fadeIn'
            animationOut='fadeOut'
            hasBackdrop={false}
            style={styles.step4ModalWrapper}
          >
            <View style={styles.guideWrapper}>
              <TouchableOpacity
                onPress={onCloseStep4Modal}
                style={styles.close}
              >
                <View>
                  <Text style={styles.closeText}> { 'Dismiss' } </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.guideTitle}> Step 4: Information \ Friends </Text>
              <Text style={styles.guideDescription}> { 'Add all the information about what you are wearing. Also Add any friends that are with you. All information will be searchable.' } </Text>
              <View style={styles.step4ModalArrow}>
                <Icon name="menu-down" color={'#b637ab'} size={40} />
              </View>
              
            </View>
          </Modal>

          <Modal
            isVisible={openStep6Modal}
            animationIn='fadeIn'
            animationOut='fadeOut'
            hasBackdrop={false}
            style={styles.step6ModalWrapper}
          >
            <View style={styles.guideWrapper}>
              <TouchableOpacity
                onPress={onCloseStep6Modal}
                style={styles.close}
              >
                <View>
                  <Text style={styles.closeText}> { 'Dismiss' } </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.guideTitle}> { "Step 6: Save" } </Text>
              <Text style={styles.guideDescription}> { "Save it!" } </Text>
              <View style={styles.step6ModalArrow}>
                <Icon name="menu-up" color={'#b637ab'} size={40} />
              </View>
              
            </View>
          </Modal>

        </KeyboardAwareScrollView>
        
      </KeyboardAvoidingView>
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
    alignItems: 'center'
  },
  imageWrapper: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
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
  step4ModalWrapper: {
    justifyContent: "flex-start",
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 90 : 60,
  },
  guideWrapper: {
    width: 300,
    height: 250,
    position: 'relative',
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "#fff",
    borderColor: '#b637ab',
  },
  step4ModalArrow: {
    position: 'absolute',
    bottom: -25,
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
  step6ModalWrapper: {
    justifyContent: "flex-start",
    alignItems: 'flex-end',
    marginTop: Platform.OS === 'ios' ? 115 : 80,
  },
  step6ModalArrow: {
    position: 'absolute',
    top: -26,
    right: 10,
  },  
});

export default NewItemScreen;