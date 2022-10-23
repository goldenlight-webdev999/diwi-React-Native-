import React, { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import { friendSearchText, headerTitle, initFriendsData, initItemsData, keySearchText, newToOldText, searchNoResult } from '../services/constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeScreenDataType, ItemDataType, RootStackParamList, SearchResultType } from '../services/models';
import { itemReducer } from "../helpers/redux/itemSlice";
import {itemsData} from '../services/mockup';
import CustomImage from '../components/CustomImage';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheetComponent from '../components/BottomSheetComponent';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: FC<HomeScreenProps> = (props) => {

  const params: HomeScreenDataType = props.route.params

  const from = (params && params.from) ? params.from : ''
  const data = (params && params.data) ? params.data : []

  const dispatch = useDispatch();
  const items = (data && data.length > 0) ? data : itemsData
  
  //console.log("Home, items", items)
  //console.log("from", from)
  
  const [searchFriendData, setSearchFriendData] = useState(initFriendsData);
  const [searchKeyData, setSearchKeyData] = useState(initItemsData);
  const [hasSearchData, setHasSearchData] = useState(false);
  const [searchText, setSearchText] = useState('');
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

  const onGoDetail = (item: ItemDataType) => {
    dispatch(
      itemReducer({item: item})
    );
    props.navigation.navigate('Detail')
  }

  const onSearchResult = () => {
    props.navigation.navigate('SearchResult', {searchKey: searchText, dataType: 'keyData', itemData: searchKeyData, friendData: []})
  }

  useEffect(() => {
    if (from === 'SearchResult') {
      setSearchText('')
    }
  }, [from]);

  return (
    <View
      style={styles.page}
    >
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
          {items.map((item, index) => (
            <TouchableOpacity
              style={styles.itemWrapper}
              onPress={() => onGoDetail(item)}
              key={index}
            >
              <CustomImage
                isImage={true}
                type={item.pic.type}
                src={item.pic.src}
                size='thumbnail'
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
      <BottomSheetComponent />
      
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default HomeScreen;