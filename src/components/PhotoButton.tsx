import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import Reanimated, { } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Camera, PhotoFile, TakePhotoOptions, TakeSnapshotOptions, VideoFile } from 'react-native-vision-camera';

interface Props extends ViewProps {
  camera: React.RefObject<Camera>;
  onMediaCaptured: (media: PhotoFile | VideoFile, type: 'photo' | 'video') => void;
  minZoom: number;
  maxZoom: number;
  cameraZoom: Reanimated.SharedValue<number>;
  flash: 'off' | 'on';
  enabled: boolean;
}

const _PhotoButton: React.FC<Props> = ({
  camera,
  onMediaCaptured,
  minZoom,
  maxZoom,
  cameraZoom,
  flash,
  enabled,
  style,
  ...props
}): React.ReactElement => {  
  const takePhotoOptions = useMemo<TakePhotoOptions & TakeSnapshotOptions>(
    () => ({
      photoCodec: 'jpeg',
      qualityPrioritization: 'speed',
      flash: flash,
      quality: 90,
      skipMetadata: true,
    }),
    [flash],
  );  

  //#region Camera Capture
  const takePhoto = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      console.log('Taking photo...');
      const photo = await camera.current.takePhoto(takePhotoOptions);
      onMediaCaptured(photo, 'photo');
    } catch (e) {
      console.error('Failed to take photo!', e);
    }
  }, [camera, onMediaCaptured, takePhotoOptions]);
  

  return (
    <View style={styles.iconBtnWrapper}>
      <TouchableOpacity style={styles.iconBtn} onPress={takePhoto}>
        <Icon name="camera" color={'#fff'} size={40} />
      </TouchableOpacity>
    </View>
  );
};

export const PhotoButton = React.memo(_PhotoButton);

const styles = StyleSheet.create({
  iconBtnWrapper: {
    position: 'absolute',
    bottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },  
  iconBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    width: 50,
    height: 50,
    backgroundColor: "transparent",
    marginLeft: 10,
    marginRight: 10,
  },
});
