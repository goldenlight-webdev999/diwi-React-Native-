import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import Reanimated, {
  cancelAnimation,
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedGestureHandler,
  useSharedValue,
  withRepeat,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Camera, PhotoFile, VideoFile } from 'react-native-vision-camera';

interface Props extends ViewProps {
  camera: React.RefObject<Camera>;
  onMediaCaptured: (media: PhotoFile | VideoFile, type: 'photo' | 'video') => void;

  minZoom: number;
  maxZoom: number;
  cameraZoom: Reanimated.SharedValue<number>;

  flash: 'off' | 'on';

  enabled: boolean;
}

const _VideoButton: React.FC<Props> = ({
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
  //const isRecording = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const recordingProgress = useSharedValue(0);  
 
  const onStoppedRecording = useCallback(() => {
    setIsRecording(false);
    console.log('stopped recording video!');
  }, [recordingProgress]);
  const stopRecording = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      console.log('calling stopRecording()...');
      await camera.current.stopRecording();
      console.log('called stopRecording()!');
    } catch (e) {
      console.error('failed to stop recording!', e);
    }
  }, [camera]);
  const startRecording = useCallback(() => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      console.log('calling startRecording()...');
      camera.current.startRecording({
        flash: flash,
        onRecordingError: (error) => {
          console.error('Recording failed!', error);
          onStoppedRecording();
        },
        onRecordingFinished: (video) => {
          console.log(`Recording successfully finished! ${video.path}`);
          onMediaCaptured(video, 'video');
          onStoppedRecording();
        },
      });
      // TODO: wait until startRecording returns to actually find out if the recording has successfully started
      console.log('called startRecording()!');
      setIsRecording(true);
    } catch (e) {
      console.error('failed to start recording!', e, 'camera');
    }
  }, [camera, flash, onMediaCaptured, onStoppedRecording]);
 

  return (
    <>
      {!isRecording ? (
        <View style={styles.iconBtnWrapper}>
        <TouchableOpacity style={styles.iconBtn} onPress={startRecording}>
          <Icon name="circle-outline" color={'#fff'} size={40} />
        </TouchableOpacity>
      </View>
      ) : (
        <View style={styles.iconBtnWrapper}>
          <TouchableOpacity style={styles.iconBtn} onPress={stopRecording}>
            <Icon name="circle-slice-8" color={'red'} size={40} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export const VideoButton = React.memo(_VideoButton);

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
