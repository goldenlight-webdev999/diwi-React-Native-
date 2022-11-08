import React, { FC, useCallback, useState } from 'react';
import {
  StyleSheet,  
  Image,
  View,
  NativeSyntheticEvent,
  ImageLoadEventData,
  Text
} from 'react-native';
import { CustomImageType } from '../services/models';
import Video, { LoadError, OnLoadData } from 'react-native-video';


const CustomImage: FC<CustomImageType>=(props) => {
  const { isImage, type, src, size } = props

  const [hasMediaLoaded, setHasMediaLoaded] = useState(false);

  const source = {uri: src}

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
  
  const isVideoOnLoadEvent = (event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>): event is OnLoadData =>
    'duration' in event && 'naturalSize' in event;

  return (
    <>
      {source && source.uri ? (
        <View>
          {type === 'photo' ? (
            <Image
              style={ size==='thumbnail' ? styles.thumbImage : styles.image}
              source={source}
              onLoadEnd={onMediaLoadEnd}
              onLoad={onMediaLoad}
            />
          ) : (
            <Video
              source={source}
              style={size==='thumbnail' ? styles.thumbVideo: styles.video}
              paused={true}
              controls={!isImage}
              onReadyForDisplay={onMediaLoadEnd}
              onLoad={onMediaLoad}
              onError={onMediaLoadError}
            />
          )}
        </View>
      ) : (
        <View style={ size==='thumbnail' ? styles.thumbImage : styles.image}>

        </View>
      )}
    </>
    
  );
};

const styles = StyleSheet.create({  
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  thumbImage: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    backgroundColor: '#000',
  },
  thumbVideo: {
    width: 100,
    height: 90,
    backgroundColor: '#000',
  },
});

export default CustomImage;