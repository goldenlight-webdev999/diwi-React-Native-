import React, { FC, useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import { friendSearchText, headerTitle, initFriendsData, initItemsData, keySearchText, newToOldText, searchNoResult } from '../services/constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ItemDataType, RootStackParamList, searchResultScreenDataType, SearchResultType } from '../services/models';
import { itemReducer } from "../helpers/redux/itemSlice";

import {itemsData} from '../services/mockup'
import CustomImage from '../components/CustomImage';

type SearchResultScreenProps = NativeStackScreenProps<RootStackParamList, "SearchResult">;

const SearchResultScreen: FC<SearchResultScreenProps> = (props) => {
  /**
   * Input params
   */
  const params: searchResultScreenDataType = props.route.params
  const { searchKey, dataType, itemData, friendData } = params

  console.log(params)

  const dispatch = useDispatch();

  const item = useSelector((state: any) => state.itemReducer.item)

  const initSearchText = searchKey;
  const [searchFriendData, setSearchFriendData] = useState(initFriendsData);
  const [searchKeyData, setSearchKeyData] = useState(initItemsData);
  const [searchText, setSearchText] = useState('');
  const onSearch = (result: SearchResultType) => {
    
    const {key, friendData, keyData} = result
    setSearchText(key)
    if (key !== '') {
      setSearchFriendData(friendData)
      setSearchKeyData(keyData)

    } else {
      props.navigation.navigate('Home', {from: 'SearchResult', data:[]})
    }
  }

  const onDetail = (item: ItemDataType) => {
    dispatch(
      itemReducer({item: item})
    );
    props.navigation.navigate('Detail')
  }

  useEffect(() => {
  }, []);

  return (
    <View >
      <Header
        title={headerTitle}
        hasSearch={true}
        initSearchText={initSearchText}
        onSearch={onSearch}
        onBack={() => {}}
        onSave={() => {}}
        onMore={() => {}}
      />
      {dataType === 'friendData' ? (
        <View>
          <View style={styles.navContainer}>
            <Text style={styles.textStyle}>{`Friend: ${searchKey}, `} {newToOldText}</Text>
            <Icon name="arrow-down" color={'#888'} size={20} />
          </View>
          <View style={styles.searchResultsWrapper}>
            <View>
              {friendData && friendData.length > 0 && (
                <View style={styles.friendDataWrapper}>
                  {friendData.map((item, index) => (
                    <Text key={index}>{item.name}</Text>
                    // <TouchableOpacity style={styles.itemWrapper} onPress={() => props.navigation.navigate('Detail')} key={index}>
                    //   <Image style={styles.image} source={item.pic}></Image>
                    // </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.navContainer}>
            <Text style={styles.textStyle}>{`Matching ${searchKey}, `} {newToOldText}</Text>
            <Icon name="arrow-down" color={'#888'} size={20} />
          </View>
          <View style={styles.searchResultsWrapper}>
            <View>
              {itemData && itemData.length > 0 && (
                <View style={styles.friendDataWrapper}>
                  {itemData.map((item, index) => (
                    <TouchableOpacity style={styles.itemWrapper} onPress={() => onDetail(item)} key={index}>                      
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
            </View>
          </View>
        </View>
      ) }
      
    </View>
  );
};

const styles = StyleSheet.create({  
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
  image: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
  }
});

export default SearchResultScreen;