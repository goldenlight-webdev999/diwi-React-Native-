import React, { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import { friendSearchText, getFormObj, headerTitle, initFriendsData, initItemsData, initMedia, keySearchText, newToOldText, searchNoResult, SERVER_API_URL, SERVER_CONTENT_URL } from '../services/constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FriendType, HomeScreenDataType, ItemDataType, MediaType, RootStackParamList, SearchResultType } from '../services/models';
import { itemReducer } from "../helpers/redux/itemSlice";
import CustomImage from '../components/CustomImage';
import BottomSheetComponent from '../components/BottomSheetComponent';
import { getAllItems } from '../services/api';
import { totalItemsReducer } from '../helpers/redux/totalItemsSlice';
import { userReducer } from '../helpers/redux/userSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import { checkStorage, removeStorage, saveStorage } from '../helpers/helper';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: FC<HomeScreenProps> = (props) => {

  const params: HomeScreenDataType = props.route.params

  const from = (params && params.from) ? params.from : ''
  const data = (params && params.data) ? params.data : []

  const dispatch = useDispatch();
  // ------From Mockup-----------
  //const items = (data && data.length > 0) ? data : itemsData

  // ------From Store-----------
  const inItems: ItemDataType[] = useSelector((state: any) => state.totalItemsReducer.items)
  const user: any = useSelector((state: any) => state.userReducer.user)

  const [items, setItems] = useState(inItems);  
  const [searchFriendData, setSearchFriendData] = useState(initFriendsData);
  const [searchKeyData, setSearchKeyData] = useState(initItemsData);
  const [hasSearchData, setHasSearchData] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')

  // -------Guide modals----------
  const [openStep1Modal, setOpenStep1Modal] = useState(false)
  const [openDoneModal, setOpenDoneModal] = useState(false)

  const onSearch = (result: SearchResultType) => {
    const {key, friendData, keyData} = result
    setSearchText(key)
    if (key !== '') {
      /**
       * Set friend data search
       */
      setSearchFriendData(friendData)

      /**
       * Set key data ( title, location, note) search
       */
      setSearchKeyData(keyData)

      setHasSearchData(true)
    } else {
      setSearchFriendData(initFriendsData)
      setSearchKeyData(initItemsData)
      setHasSearchData(false)
    }
  }

  const getAllLooks = async () => {
    setIsLoading(true)
    setLoadingText('Loading')
    const response = await getAllItems('look', user.uid)
    
    if (response.data && response.data.data) {
      setItems(response.data.data)
      dispatch(
        totalItemsReducer({items: response.data.data})
      );
    }

    setIsLoading(false)
    setLoadingText('')

    showTutorModals()
  }

  const onGoDetail = (item: ItemDataType) => {
    dispatch(
      itemReducer({item: item})
    );
    props.navigation.navigate('Detail')
  }

  const onSearchResult = () => {
    props.navigation.navigate('SearchResult', {searchKey: searchText, dataType: 'keyData', itemData: searchKeyData, friendData: []})
  }

  const showTutorModals = async () => {

    // removeStorage('step1')
    // removeStorage('step2')
    // removeStorage('step3')
    // removeStorage('step4')
    // removeStorage('step5')
    // removeStorage('step6')
    // removeStorage('done')
    // return

    if (from === 'New') {
      const isVisited = await checkStorage('done')
      if (!isVisited) {
        setOpenDoneModal(true)        
      }
    } else {
      const isVisited = await checkStorage('step1')
      if (!isVisited) {
        setOpenStep1Modal(true)        
      }
    }
  }

  const onCloseStep1Modal = () => {
    setOpenStep1Modal(false)
    saveStorage('step1')
  }

  const onCloseDoneModal = () => {
    setOpenDoneModal(false)
    saveStorage('done')
  }
  

  useEffect(() => {
    if (from === 'SearchResult') {
      setSearchText('')
    }
  }, [from]);

  useEffect(() => {
    getAllLooks()
  }, [props.route]);

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     showTutorModals()
  //   });
  //   return unsubscribe;
  // }, [props.navigation])
 

  return (
    <View
      style={styles.page}
    >
      <Spinner
        visible={isLoading}
        textContent={`${loadingText}...`}
        textStyle={styles.spinnerTextStyle}
      />
      <Header
        title={headerTitle}
        hasSearch={true}
        onSearch={onSearch}
        onBack={() => {}}
        onSave={() => {}}
        onMore={() => {}}
      />
      <View style={styles.navContainer}>
        <Text style={styles.textStyle}>All looks, {newToOldText}</Text>
        <Icon name="arrow-down" color={'#888'} size={20} />
      </View>
      {hasSearchData ? (
        <View style={styles.searchResultsWrapper}>
          {(searchFriendData.length > 0 || searchKeyData.length > 0) ? (
            <View>
              {searchFriendData.length > 0 && (
                <View style={styles.friendDataWrapper}>
                  {searchFriendData.map((item, index) => (
                    <View key={index}>
                      <TouchableOpacity
                        style={styles.friendItemWrapper}
                        onPress={onSearchResult}
                      >
                        <Text style={styles.searchedTextStyle}>{item.name}</Text>
                        <Text style={styles.textStyle}>{friendSearchText}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {searchKeyData.length > 0 && (
                <View style={styles.keyDataWrapper}>
                  <TouchableOpacity
                    style={styles.friendItemWrapper}
                    onPress={onSearchResult}
                  >
                    <Text style={styles.searchedTextStyle}>{searchText}</Text>
                    <Text style={styles.textStyle}>{keySearchText}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.noFoundWrapper}>
              <Text style={styles.textStyle}>{searchNoResult}</Text>
            </View>
          )}
        </View>        
      ) : (
        <View style={styles.container}>        
          {items.length>0 && items.map((item, index) => (
            <TouchableOpacity
              style={styles.itemWrapper}
              onPress={() => onGoDetail(item)}
              key={index}
            >
              <CustomImage
                isImage={true}
                type={item.media.type}
                src={item.media.src}
                size='thumbnail'
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
      <BottomSheetComponent />

      <Modal
        isVisible={openStep1Modal}
        animationIn='fadeIn'
        animationOut='fadeOut'
        hasBackdrop={false}
        style={styles.step1ModalWrapper}
      >
        <View style={styles.guideWrapper}>
          <TouchableOpacity
            onPress={onCloseStep1Modal}
            style={styles.close}
          >
            <View>
              <Text style={styles.closeText}> { 'Dismiss' } </Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.guideTitle}> { 'Step 1: Getting Started' } </Text>
          <Text style={styles.guideDescription}> { 'Take a picture. Create a look!!' } </Text>
          <View style={styles.step1ModalArrow}>
            <Icon name="menu-down" color={'#b637ab'} size={40} />
          </View>
          
        </View>
      </Modal>

      <Modal
        isVisible={openDoneModal}
        animationIn='fadeIn'
        animationOut='fadeOut'
        hasBackdrop={false}
        style={styles.doneModalWrapper}
      >
        <View style={styles.guideWrapper}>
          <TouchableOpacity
            onPress={onCloseDoneModal}
            style={styles.close}
          >
            <View>
              <Text style={styles.closeText}> { 'Dismiss' } </Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.guideTitle}> { 'Done!' } </Text>
          <Text style={styles.guideDescription}> { 'You have created a new look. Now you can answer DIWI?' } </Text>          
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
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 10,
    zIndex: 1,
  },
  itemWrapper: {
    padding: 5,
    margin: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  friendItemWrapper: {
    paddingVertical: 5,
  },
  searchResultsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 10,
  },
  friendDataWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
  },
  keyDataWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
  },
  noFoundWrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  textStyle: {
    color: '#888',
  },
  searchedTextStyle: {
    color: '#b637ab',
  },
  step1ModalWrapper: {
    justifyContent: "flex-end",
    alignItems: 'flex-start',
    marginBottom: Platform.OS === 'ios' ? 110 : 80,
  },
  doneModalWrapper: {
    justifyContent: "center",
    alignItems: 'center',
  },
  guideWrapper: {
    width: 300,
    height: 200,
    position: 'relative',
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "#fff",
    borderColor: '#b637ab',
  },
  step1ModalArrow: {
    position: 'absolute',
    bottom: -25,
    left: 10,
  },
  doneModalArrow: {
    position: 'absolute',
    bottom: -25,
    left: 10,
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
    color: '#b637ab'
  },
  closeBtn: {
    padding: 10,
  },
});

export default HomeScreen;