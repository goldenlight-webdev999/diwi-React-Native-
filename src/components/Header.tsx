import React, { FC, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { initItemsData, initSearchResult, searchPlaceholder } from '../services/constants';
import { itemsData } from '../services/mockup';
import { ItemDataType, HeaderType, searchResultType } from '../services/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const screen = Dimensions.get('window')

const Header: FC<HeaderType>=(props) => {
  
  const { title, hasSearch, back, action, initSearchText, onSearch, onBack } = props
  const [search, setSearch] = useState('');

  const [filteredDataSource, setFilteredDataSource] = useState(initSearchResult);
  const [masterDataSource, setMasterDataSource] = useState(initItemsData);

  useEffect(() => {
    const data = itemsData
    setMasterDataSource(data)
    if (initSearchText) {
      setSearch(initSearchText)
    }
  }, []);

  useEffect(() => {
    //console.log(filteredDataSource)
  }, [filteredDataSource]);

  const searchFilterFunction = (searchText: string) => {
    // Check if searched text is not blank
    if (searchText) {
      
      /**
       * Search from friends
       */
      const friendData = masterDataSource.filter(function (item) {
        const itemData = item.friend
          ? item.friend.toUpperCase()
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

  return (
    <View style={styles.container}>
      <View style={styles.topStyle}>
        {back && (
          <TouchableOpacity style={styles.backStyle} onPress={onBack}>
            <Text style={styles.backTextStyle}>Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.titleStyle}>{title}</Text>
        {action?.type === 'Save' ? (
          <Text style={styles.actionStyle}>{action?.label}</Text>
        ) : (
          <Icon name="dots-horizontal" color={'#fff'} size={20} />
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
    paddingTop:20,
    paddingBottom:10,
  },
  backStyle: {
    width: 60,
    color: 'white',
    padding: 5,
  },
  backTextStyle: {
    color: 'white',
  },
  actionStyle: {
    width: 30,
    color: 'white',
  },
  titleStyle: {
    color: 'white',
    width: screen.width - 120,
    textAlign: 'center',
  },
});

export default Header;