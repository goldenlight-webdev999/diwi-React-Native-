import React, { FC, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { initFriendsData, initItemsData, initSearchResult, searchPlaceholder } from '../services/constants';
import { ItemDataType, HeaderType, SearchResultType, FriendType } from '../services/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

const screen = Dimensions.get('window')

const Header: FC<HeaderType>=(props) => {
  const storeAllFriends = useSelector((state: any) => state.friendsReducer.friends)
  const storeItems: ItemDataType[] = useSelector((state: any) => state.totalItemsReducer.items)
  
  const { title, hasSearch, back, action, initSearchText, onSearch, onBack, onMore, onSave } = props
  const [search, setSearch] = useState('');

  const [filteredDataSource, setFilteredDataSource] = useState(initSearchResult);
  const [masterDataSource, setMasterDataSource] = useState(storeItems);
  const [friendsDataSource, setFriendsDataSource] = useState(storeAllFriends);

  const searchFilterFunction = (searchText: string) => {
    // Check if searched text is not blank
    if (searchText) {
      
      /**
       * Search from friends
       */
      const friendData = friendsDataSource.filter(function (item: FriendType) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : '';
        const searchKey = searchText.toUpperCase();
        return itemData.indexOf(searchKey) > -1;
      });


      /**
       * Search from titles, locations, notes
       */
      const keyData = masterDataSource.filter(function (item) {
        const titleData = item.title
          ? item.title.toUpperCase()
          : '';
        const locationData = item.title
          ? item.location.toUpperCase()
          : '';
        const noteData = item.title
          ? item.note.toUpperCase()
          : '';
        const searchKey = searchText.toUpperCase();
        return ( titleData.indexOf(searchKey) > -1 ) || ( locationData.indexOf(searchKey) > -1 ) || ( noteData.indexOf(searchKey) > -1 );
      });

      const newData = {
        key: searchText,
        friendData,
        keyData
      }
      setFilteredDataSource(newData);
      setSearch(searchText);
      onSearch(newData);
    } else {
      setFilteredDataSource(initSearchResult);
      setSearch('');
      onSearch(initSearchResult)
    }
  };

  useEffect(() => {

    if (initSearchText) {
      setSearch(initSearchText)
    }
  }, []);

  useEffect(() => {
    setMasterDataSource(storeItems)
    setFriendsDataSource(storeAllFriends)
  }, [storeAllFriends, storeItems]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#b637ab'} />
      <View style={styles.topStyle}>
        {back && (
          <TouchableOpacity style={styles.backStyle} onPress={onBack}>
            <Icon name="chevron-left" color={'#fff'} size={20} />
          </TouchableOpacity>
        )}
        <Text style={styles.titleStyle}>{title}</Text>
        {action?.type === 'Save' && action?.label && (
          <TouchableOpacity style={styles.changeStyle} onPress={onSave}>
            <Text style={styles.actionStyle}>{action?.label}</Text>
          </TouchableOpacity>
        )}
        {action?.type === 'More' && (
          <TouchableOpacity style={styles.changeStyle} onPress={onMore}>
            <Icon name="dots-horizontal" color={'#fff'} size={20} />
          </TouchableOpacity>
        )}
        
      </View>
      
      {hasSearch && (
        <View style={{ width:'100%' }}>
          <TextInput
            style={styles.textInputStyle}
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid="transparent"
            placeholder={searchPlaceholder}
            placeholderTextColor={"#ccc"}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#b637ab',
    width:'100%',
    padding:10,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },  
  itemStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
    backgroundColor: '#b637ab',
    borderRadius: 20,
  },
  topStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  backStyle: {
    width: 60,
    color: 'white',
    padding: 5,
  },
  changeStyle: {

  },
  backTextStyle: {
    color: 'white',
  },
  actionStyle: {
    width: 60,
    color: 'white',
  },
  titleStyle: {
    color: 'white',
    width: screen.width - 120,
    textAlign: 'center',
  },
});

export default Header;