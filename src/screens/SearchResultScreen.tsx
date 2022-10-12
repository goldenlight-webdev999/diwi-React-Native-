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
import { ItemDataType, RootStackParamList, searchResultScreenDataType, searchResultType } from '../services/models';

import {itemsData} from '../services/mockup'

type SearchResultScreenProps = NativeStackScreenProps<RootStackParamList, "SearchResult">;

const SearchResultScreen: FC<SearchResultScreenProps> = (props) => {
  /**
   * Input params
   */
  const params: searchResultScreenDataType = props.route.params
  const { searchKey, dataType, data } = params

  console.log(params)

  const initSearchText = searchKey;
  const [searchFriendData, setSearchFriendData] = useState(initItemsData);
  const [searchKeyData, setSearchKeyData] = useState(initItemsData);
  const [searchText, setSearchText] = useState('');
  const onSearch = (result: searchResultType) => {
    
    const {key, friendData, keyData} = result
    setSearchText(key)
    if (key !== '') {
      setSearchFriendData(friendData)
      setSearchKeyData(keyData)

    } else {
      props.navigation.navigate('Home', {from: 'SearchResultScreen'})
    }
  }

  useEffect(() => {
  }, []);

  return (
    <SafeAreaView >
      <Header title={headerTitle} hasSearch={true} initSearchText={initSearchText} onSearch={onSearch} onBack={() => {}}></Header>
      <View style={styles.navContainer}>
        {dataType === 'friendData' ? (
          <Text style={styles.textStyle}>{`Friend: ${searchKey}, `} {newToOldText}</Text>
        ) : (
          <Text style={styles.textStyle}>{`Matching ${searchKey}, `} {newToOldText}</Text>
        )}

        <Icon name="home" color={'#888'} size={20} />
      </View>
      <View style={styles.searchResultsWrapper}>
        <View>
          {data && data.length > 0 && (
            <View style={styles.friendDataWrapper}>
              {data.map((item, index) => (
                <TouchableOpacity style={styles.itemWrapper} onPress={() => props.navigation.navigate('Detail', item)} key={index}>
                  <Image style={styles.image} source={item.pic}></Image>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      
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

export default SearchResultScreen;