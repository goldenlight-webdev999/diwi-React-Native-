import React, { FC } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const CaptureScreen: FC=(props) => {
  const onPressRetake = () => {

  }
  const onPressUseContent = () => {
    
  }
  const onPressImage = () => {
    
  }
  const onPressVideo = () => {
    
  }
  const onPressPicture = () => {
    
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="image" color={'#fff'} size={100} />
      </View>
      <View style={styles.buttonsWrapper}>        
        <Pressable style={styles.retakeBtn} onPress={onPressRetake}>
          <Text style={styles.retakeText}>{'Retake'}</Text>
        </Pressable>
        <Pressable style={styles.useBtn} onPress={onPressUseContent}>
          <Text style={styles.useText}>{'Use Content'}</Text>
        </Pressable>
      </View>
      <View style={styles.iconBtnWrapper}>        
        <Pressable style={styles.iconBtn} onPress={onPressImage}>
          <Icon name="image" color={'#fff'} size={30} />
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={onPressVideo}>
          <Icon name="image" color={'#fff'} size={30} />
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={onPressPicture}>
          <Icon name="image" color={'#fff'} size={30} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    height: '100%',
  },
  content: {
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
    bottom: 40,
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
});

export default CaptureScreen;