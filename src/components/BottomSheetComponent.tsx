import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar
} from 'react-native';

import { FlatList } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import FaqScreen from '../screens/FaqScreen';

const windowHeight = Dimensions.get('window').height;


const BottomSheetComponent: FC=(props) => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null)

  // variables
  const snapPoints = useMemo(() => [20, '100%'], [])

  const [index, setIndex] = useState(0)

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    
  }, [])

  const onAnimate = useCallback((fromIndex: number, toIndex: number) => {
    setIndex(toIndex)    
  }, [])
 
  return (
    <View 
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: 0,
        zIndex: index === 1 ? 9 : -9,
      }}
    >
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onAnimate={onAnimate}
      >
        <View style={styles.contentContainer}>
          <FaqScreen />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({  
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 0,
  },
});

export default BottomSheetComponent;