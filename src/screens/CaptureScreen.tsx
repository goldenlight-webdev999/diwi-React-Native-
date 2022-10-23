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
import { CaptureType } from '../services/models';


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
  const { path, type } = route.params;
  console.log(`Here is "CaptureScreen" path:${path}, type:${type}`)
  const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
  const isForeground = useIsForeground();
  const isScreenFocused = useIsFocused();
  const isVideoPaused = !isForeground || !isScreenFocused;
  const [savingState, setSavingState] = useState<'none' | 'saving' | 'saved'>('none');

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
    setHasMediaLoaded(true);
  }, []);
  const onMediaLoadError = useCallback((error: LoadError) => {
    console.log(`failed to load media: ${JSON.stringify(error)}`);
  }, []);

  const onSavePressed = useCallback(async () => {
    try {
      setSavingState('saving');

      const hasPermission = await requestSavePermission();
      if (!hasPermission) {
        Alert.alert('Permission denied!', 'Vision Camera does not have permission to save the media to your camera roll.');
        return;
      }
      await CameraRoll.save(`file://${path}`, {
        type: type,
      });
      setSavingState('saved');
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      setSavingState('none');
      Alert.alert('Failed to save!', `An unexpected error occured while trying to save your ${type}. ${message}`);
    }
  }, [path, type]);

  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);

  const screenStyle = useMemo(() => ({ opacity: hasMediaLoaded ? 1 : 0 }), [hasMediaLoaded]);

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
  
  const onRetake = () => {
    navigation.navigate('Home', {from: 'Capture', data:[]})
  }
  
  const onUseContent = () => {
    if (!path) {
      setOpeErrorModal(true)
      return
    }

    navigation.navigate('New', {
      path: path,
      type: type,
    });
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
      navigation.navigate('Camera', {type})
    }
        
  }

  const onFile = () => {
    console.log('Open File')
  }

 
  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
    //Camera.getMicrophonePermissionStatus().then(setMicrophonePermission);
  }, []);

  
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
              <StatusBarBlurBackground />
            </>
          ) : (
            <View style={styles.noCaptureView}>
              <Icon name="image" color={'#fff'} size={100} />
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
    marginTop: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '62%',
  },
  capturedView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
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
});

export default CaptureScreen;