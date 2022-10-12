import React, { FC, useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import { friendSearchText, headerTitle, initItemsData, keySearchText, newToOldText, searchNoResult } from '../services/constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { homeScreenDataType, ItemDataType, RootStackParamList, searchResultType } from '../services/models';

import {itemsData} from '../services/mockup'

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: FC<HomeScreenProps> = (props) => {

  const params: homeScreenDataType = props.route.params

  const from = (params && params.from) ? params.from : ''

  console.log(from)

  const items = itemsData
  const [searchFriendData, setSearchFriendData] = useState(initItemsData);
  const [searchKeyData, setSearchKeyData] = useState(initItemsData);
  const [hasSearchData, setHasSearchData] = useState(false);
  const [searchText, setSearchText] = useState('');
  const onSearch = (result: searchResultType) => {
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
      setSearchFriendData(initItemsData)
      setSearchKeyData(initItemsData)
      setHasSearchData(false)
    }
  }

  useEffect(() => {
    if (from === 'SearchResultScreen') {
      setSearchText('')
    }
  }, [from]);

  return (
    <SafeAreaView >
      <Header title={headerTitle} hasSearch={true} onSearch={onSearch} onBack={() => {}}></Header>
      <View style={styles.navContainer}>
        <Text style={styles.textStyle}>All looks, {newToOldText}</Text>
        <Icon name="home" color={'#888'} size={20} />
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
                        onPress={() => props.navigation.navigate('SearchResult', {searchKey: item.friend, dataType: 'friendData', data: searchFriendData})}
                      >
                        <Text style={styles.searchedTextStyle}>{item.friend}</Text>
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
                    onPress={() => props.navigation.navigate('SearchResult', {searchKey: searchText, dataType: 'keyData', data: searchKeyData})}
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
            <TouchableOpacity style={styles.itemWrapper} onPress={() => props.navigation.navigate('Detail', item)} key={index}>
              <Image style={styles.image} source={item.pic}></Image>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
    </SafeAreaView>
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

export default HomeScreen;