import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useIsFocused } from '@react-navigation/native';
import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  NativeSyntheticEvent,
  ImageLoadEventData,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Video, { LoadError, OnLoadData } from 'react-native-video';
import { Camera, CameraPermissionStatus, PhotoFile, VideoFile } from 'react-native-vision-camera';
import { StatusBarBlurBackground } from '../components/StatusBarBlurBackground';
import { useIsForeground } from '../hooks/useIsForeground';
import { CaptureType, ItemDataType } from '../services/models';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { itemReducer } from '../helpers/redux/itemSlice';
import { initItem } from '../services/constants';
import { block } from 'react-native-reanimated';
import { checkStorage, saveStorage } from '../helpers/helper';

const marginTop = (Platform.OS !== 'ios') ? 40 : 80;

const requestSavePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  if (permission == null) return false;
  let hasPermission = await PermissionsAndroid.check(permission);
  if (!hasPermission) {
    const permissionRequestResult = await PermissionsAndroid.request(permission);
    hasPermission = permissionRequestResult === 'granted';
  }
  return hasPermission;
};

const isVideoOnLoadEvent = (event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>): event is OnLoadData =>
  'duration' in event && 'naturalSize' in event;

const CaptureScreen: FC<any>=({ route, navigation }) => {
  //const { path, type } = route.params;
  const inItem: ItemDataType = useSelector((state: any) => state.itemReducer.item)
  const item: ItemDataType = inItem ? inItem : initItem
  
  const inPath = route.params.path
  const inType = route.params.type
  const from = (route.params.from) ? route.params.from : ''
 
  const [path, setPath] = useState(inPath);
  const [type, setType] = useState(inType);

  const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
  const isForeground = useIsForeground();
  const isScreenFocused = useIsFocused();
  const isVideoPaused = !isForeground || !isScreenFocused;
  const [savingState, setSavingState] = useState<'none' | 'saving' | 'saved'>('none');

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

  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);

  // -------Guide modals----------
  const [openStep2Modal, setOpenStep2Modal] = useState(false)
  const [openStep3Modal, setOpenStep3Modal] = useState(false)

  
  /**
   * Camera -------------
   */
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>();
  //const [microphonePermission, setMicrophonePermission] = useState<CameraPermissionStatus>();
  
  const hasPicturePermission = () => {
    console.log('cameraPermission', cameraPermission)
  }

  const hasVideoPermission = () => {
    console.log('cameraPermission', cameraPermission)
  }

  // -----------------------

  const [openErrorModal, setOpeErrorModal] = useState(false)
  const [cameraPermissionModal, setCameraPermissionModal] = useState(false)

  const dispatch = useDispatch()
  
  const onRetake = () => {
    navigation.navigate('Home', {from: 'Capture', data:[]})
  }

  const initializeItem = () => {
    let newItem = initItem
    console.log(initItem)
    newItem.media.type = type
    newItem.media.src = path
    newItem.friends = []

    dispatch(
      itemReducer({newItem})
    )
  }
  
  const onUseContent = () => {
    
    if (!path) {
      setOpeErrorModal(true)
      return
    }
    
    if (from && from === 'Edit') {
      let newItem = item
      newItem.media.type = type
      newItem.media.src = `file://${path}`
      //newItem.friends = []

      dispatch(
        itemReducer({newItem})
      )

      navigation.navigate('Edit', {
        from: 'Capture',
        lookId: item.id,
        media: {
          path: path.startsWith('file://') ? path : `file://${path}`,
          type,
        }
      });
    } else {
      initializeItem()

      navigation.navigate('New', {
        from: 'Capture',
        media: {
          path,
          type,
        }
      });
    }
    
  }
  
  const getCameraPermission = async () => {
    if (cameraPermission === 'authorized') {
      return cameraPermission
    }
    const newCameraPermission = await Camera.requestCameraPermission()
    console.log(`newCameraPermission: ${newCameraPermission}`)
    setCameraPermission(newCameraPermission)
    return newCameraPermission
    
  }

  const onCapture = async (type: CaptureType) => {
    const permission = await getCameraPermission()
    console.log(`Camera permission: ${permission}`)
    if (permission === 'authorized') {
      navigation.navigate('Camera', {type, from})
    }
        
  }

  const onFile = async () => {    
    ImagePicker.openPicker({
    }).then((media) => {
      
      const newPath = media.path
      const newType = media.mime.includes('video') ? 'video' : 'photo'

      setPath(newPath)
      setType(newType)
      
      navigation.navigate('Capture', {
        from: 'Capture',
        path: newPath,
        type: newType,
      });
    }).catch(err => {
      console.log(err)
    });    
    
  }

  const showTutorModals = async () => {

    if (from === 'Camera' || from === 'Capture') {
      const isVisited = await checkStorage('step3')
      if (!isVisited) {
        setOpenStep3Modal(true)        
      }
    } else {
      const isVisited = await checkStorage('step2')
      if (!isVisited) {
        setOpenStep2Modal(true)
      }
    }
  }

  const onCloseStep2Modal = () => {
    setOpenStep2Modal(false)
    saveStorage('step2')
  }

  const onCloseStep3Modal = () => {
    setOpenStep3Modal(false)
    saveStorage('step3')
  }
 
  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
    setPath(inPath)
    setType(inType)
  }, []);

  useEffect(() => {

    showTutorModals()
    
    setPath(route.params.path)
    setType(route.params.type)
  }, [route.params]);

  // useEffect(() => {    
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     console.log('----------Capture------------')
  //     console.log('from', from)
  //     console.log(route.params)
  //     setPath(inPath)
  //     setType(inType)
  //   });
  //   return unsubscribe;
  // }, [navigation])

  
  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          {path ? (
            <>
              <View 
                style={styles.capturedView}
              >
                {type === 'photo' && (
                  <Image source={source} style={StyleSheet.absoluteFill} resizeMode="cover" onLoadEnd={onMediaLoadEnd} onLoad={onMediaLoad} />
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
              </View>
            </>
          ) : (
            <View style={styles.noCaptureView}>
              <TouchableOpacity onPress={onFile}>
                <Icon name="image" color={'#fff'} size={100} />
              </TouchableOpacity>
            </View>
          )}
          
        </View>
        <View style={styles.buttonsWrapper}>        
          <TouchableOpacity style={styles.retakeBtn} onPress={onRetake}>
            <Text style={styles.retakeText}>{'Retake'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.useBtn} onPress={onUseContent}>
            <Text style={styles.useText}>{'Use Content'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.iconBtnWrapper}>        
          <TouchableOpacity style={styles.iconBtn} onPress={onFile}>
            <Icon name="image" color={'#fff'} size={30} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => onCapture('video')}>
            <Icon name="video" color={'#fff'} size={30} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => onCapture('photo')}>
            <Icon name="camera" color={'#fff'} size={30} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={openErrorModal}
        animationIn='fadeIn'
        animationOut='fadeOut'
      >
        <View style={styles.errorModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalText}>At least one photo/video must be selected</Text>
          </View>
          <View style={styles.modalBtnWrapper}>
            <TouchableOpacity onPress={() => {setOpeErrorModal(false)}}>
              <Text style={styles.cancelBtn}>OK</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </Modal>
      <Modal
        isVisible={cameraPermissionModal}
        animationIn='fadeIn'
        animationOut='fadeOut'
      >
        <View style={styles.errorModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Camera Persmission</Text>
            <Text style={styles.modalText}>You have no camera perssion on this app. Please click below to set the permission</Text>
          </View>
          <View style={styles.modalBtnWrapper}>
            <TouchableOpacity onPress={()=>setCameraPermissionModal(false)}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </Modal>

      <Modal
        isVisible={openStep2Modal}
        animationIn='fadeIn'
        animationOut='fadeOut'
        hasBackdrop={false}
        style={styles.step2ModalWrapper}
      >
        <View style={styles.guideWrapper}>
          <TouchableOpacity
            onPress={onCloseStep2Modal}
            style={styles.close}
          >
            <View style={styles.closeBtn}>
              <Text style={styles.closeText}> { 'Dismiss' } </Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.guideTitle}> { 'Step 2: Get your look' } </Text>
          <View style={styles.guideDescription}>
            <Text> {'- Select a picture from your camera roll'} </Text>
            <Text> {'- Take a video'} </Text>
            <Text> {'- Take a picture'} </Text>
          </View>
          <View style={styles.step2ModalArrow}>
            <Icon name="menu-down" color={'#b637ab'} size={40} />
          </View>
          
        </View>
      </Modal>

      <Modal
        isVisible={openStep3Modal}
        animationIn='fadeIn'
        animationOut='fadeOut'
        hasBackdrop={false}
        style={styles.step3ModalWrapper}
      >
        <View style={styles.guideWrapper}>
          <TouchableOpacity
            onPress={onCloseStep3Modal}
            style={styles.close}
          >
            <View style={styles.closeBtn}>
              <Text style={styles.closeText}> { 'Dismiss' } </Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.guideTitle}> Step 3: User Content \ Retake </Text>
          <Text style={styles.guideDescription}> { 'If you are happy with it, USE CONTENT, if not then RETAKE' } </Text>
          <View style={styles.step3ModalArrow}>
            <Icon name="menu-down" color={'#b637ab'} size={40} />
          </View>
          
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#000',
    height: '100%',
  },  
  content: {
    marginTop: marginTop,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '62%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  capturedView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',    
  },
  noCaptureView: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 20,
  },
  iconBtnWrapper: {
    position: 'absolute',
    bottom: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 20,
  },
  retakeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#000",
    borderColor: '#b637ab',
    borderWidth: 1,
    marginRight: 10,    
  },
  useBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#b637ab",
    marginLeft: 10,
  },
  iconBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    width: 50,
    height: 50,
    backgroundColor: "#b637ab",
    marginLeft: 10,
    marginRight: 10,
  },
  retakeText: {
    color: '#b637ab',
    textTransform: 'uppercase',    
  },
  useText: {
    color: '#fff',
    textTransform: 'uppercase',
  },
  types: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  modalContent: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderBottomWidth: 1,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  modalText: {
    textAlign: 'center',
    color: '#000',
  },
  modalBtnWrapper: {
    width: '100%',
  },
  cancelBtn: {
    color: 'blue',
    fontSize: 20,
    fontWeight: '600',
    width: '100%',
    padding: 20,
    textAlign: 'center',
  },
  step2ModalWrapper: {
    justifyContent: "flex-end",
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 190 : 160,
  },
  step3ModalWrapper: {
    justifyContent: "center",
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 60 : -50,
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
  step2ModalArrow: {
    position: 'absolute',
    bottom: -25,
    left: 55,
  },
  step3ModalArrow: {
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
  closeBtn: {
    padding: 10,
    
  },
});

export default CaptureScreen;