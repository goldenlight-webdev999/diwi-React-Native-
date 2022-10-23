import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
  Image,
  ImageLoadEventData,
  NativeSyntheticEvent,
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
import { ActionType, FriendType, ItemDataType, PicType } from '../services/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { itemReducer } from "../helpers/redux/itemSlice";
import { friendsData, itemsData } from '../services/mockup';
import CustomImage from '../components/CustomImage';
import uuid from 'react-native-uuid';
import { initItem, itialCaptureParams } from '../services/constants';
import moment from 'moment'
import Video, { LoadError, OnLoadData } from 'react-native-video';
import { useIsForeground } from '../hooks/useIsForeground';
import { useIsFocused } from '@react-navigation/native';

const isVideoOnLoadEvent = (event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>): event is OnLoadData =>
  'duration' in event && 'naturalSize' in event;

const NewItemScreen: FC<any>=({ route, navigation }) => {
  //const item = useSelector((state: any) => state.itemReducer.item)
  const { path, type } = route.params;
  // console.log(`NewItemScreen-> path:${path}, type:${type}`)
  const inPic: PicType = {
    type: type,
    src: `file://${path}`
  }
  const [pic, setPic] = useState(inPic)
  const [title, setTitle] = useState(initItem.title)
  const [location, setLocation] = useState(initItem.location)
  const [friends, setFriends] = useState(initItem.friends)
  const [date, setDate] = useState(initItem.date)
  const [note, setNote] = useState(initItem.note)
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
    if (!(title && location )) {
      console.log('Fill in title and location!')
      return
    }
    const id = uuid.v4().toString();
    
    //const date = moment(d).format('MMM Do, YYYY')
    
    const newItem: ItemDataType = {
      id,
      title,
      location,
      date,
      friends,
      note,
      pic,
    }

    
    // Call save API endpoint

    // if success =>
    const newItems = [...itemsData, newItem]
    dispatch(
      itemReducer({item: newItem})
    );

    navigation.navigate('Home', {from: "New", data: newItems})
  }

  const onBack = () => {    
    navigation.navigate('Capture', {
      path: path,
      type: type,
    });
  }

  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);
  const isForeground = useIsForeground();
  const isScreenFocused = useIsFocused();
  const isVideoPaused = !isForeground || !isScreenFocused;
  const onMediaLoad = useCallback((event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>) => {
    if (isVideoOnLoadEvent(event)) {
      console.log(
        `Video loaded. Size: ${event.naturalSize.width}x${event.naturalSize.height} (${event.naturalSize.orientation}, ${event.duration} seconds)`,
      );
    } else {
      console.log(`Image loaded. Size: ${event.nativeEvent.source.width}x${event.nativeEvent.source.height}`);
    }
  }, []);
  const onMediaLoadEnd = useCallback(() => {
    console.log('media has loaded.');
  }, []);
  const onMediaLoadError = useCallback((error: LoadError) => {
    console.log(`failed to load media: ${JSON.stringify(error)}`);
  }, []);


  return (
    <>
      <View>
        <Header
          title={"New Look"}
          back={true}
          action={action}
          onSearch={() => {}}
          onSave={onSave}
          onMore={() => {}}
          onBack={onBack }
        />
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
                  resizeMode="cover"
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

export default NewItemScreen;