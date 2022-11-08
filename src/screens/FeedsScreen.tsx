import React, { FC, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from "react-native-modal";
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import { ActionType, FeedType } from '../services/models';
import Spinner from 'react-native-loading-spinner-overlay';
import { feedsMockupData } from '../services/mockup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomImage from '../components/CustomImage';


const FeedsScreen: FC<any>=({ route, navigation }) => {

  const user: any = useSelector((state: any) => state.userReducer.user)
  const action: ActionType = {
    type: 'Save',
    label: ''
  }

  const [feeds, setFeeds] = useState([] as FeedType[])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const [openFeedModal, setOpenFeedModal] = useState(false)
  const [selectedFeed, setSelectedFeed] = useState({} as FeedType)

  const getFeeds = () => {
    const feedsData = feedsMockupData
    setFeeds(feedsData)
  }
  
  const onViewFeed = (feed: FeedType) => {
    setSelectedFeed(feed)
    setOpenFeedModal(true)
  }

  useEffect(() => {
    getFeeds()
  }, []);
  
  return (
    <View style={styles.page}>
      <Header
        title={"Your DIWI Feed"}
        back={false}
        action={action}
        onSearch={() => {}}
        onBack={() => {}}
        onSave={() => {}}
        onMore={() => {}}
      />
      <Spinner
        visible={isLoading}
        textContent={`${loadingText}...`}
        textStyle={styles.spinnerTextStyle}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {feeds && feeds.length > 0 && (
          feeds.map((f, index) => (
            <View key={index}>
              <View style={styles.feedDetail} key={index}>
                <View style={styles.feedDetailImage}>
                  <TouchableOpacity
                    onPress={() => onViewFeed(f)}
                  >
                    <CustomImage
                      isImage={true}
                      type={'photo'}
                      src={f.picUrl}
                      size='image'
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.feedDetailTitle}> { f.title } </Text>
              </View>
            </View>
          ))
        )}        
      </ScrollView>
      <Modal
        isVisible={openFeedModal}
        animationIn='fadeIn'
        animationOut='fadeOut'
      >
        <View style={styles.feedItem}>
          <TouchableOpacity
            onPress={() => setOpenFeedModal(false)}
          >
            <View style={styles.feedClose} >
              <Icon name="close" color={'#888'} size={20} style={styles.closeBtn} />
            </View>
          </TouchableOpacity>
          <Text style={styles.feedDate}> { selectedFeed.date } </Text>
          <Text style={styles.feedTitle}> { selectedFeed.title } </Text>
          <View style={styles.feedImage}>
            <CustomImage
              isImage={true}
              type={'photo'}
              src={selectedFeed.picUrl}
              size='image'
            />
          </View>
          <Text style={styles.feedDescription}> { selectedFeed.description } </Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  page: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    overflow: 'hidden',
  },
  feedDetail: {
    width: '100%',
    marginVertical: 10,
    padding: 20,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  feedDetailImage: {
    height: 200,
    width: '50%',
  },
  feedDetailTitle: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
    width: '50%',
    paddingLeft: 10,
  },
  feedItem: {
    width: '100%',
    backgroundColor: '#fff',
    marginVertical: 10,
    textAlign: 'center',
    position: 'relative',
  },
  feedClose: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  closeBtn: {
    padding: 10,
  },
  feedDate: {
    marginTop: 20,
    textAlign: 'center',
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 10,
  },
  feedImage: {
    height: 300,
    marginTop: 20,
  },
  feedDescription: {
    textAlign: 'center',
    padding: 20,
  },
  
});

export default FeedsScreen;