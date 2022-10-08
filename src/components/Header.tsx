import React, { FC, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  FlatList
} from 'react-native';
import { searchPlaceholder } from '../services/constants';
import { dataToFilter } from '../services/mockup';
import { FilterDataType, HeaderType } from '../services/models';

const Header: FC<HeaderType>=(props) => {
  const { title, hasSearch } = props
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState(():FilterDataType[]=>[]);
  const [masterDataSource, setMasterDataSource] = useState(():FilterDataType[]=>[]);

  useEffect(() => {
    const data = dataToFilter
    setMasterDataSource(data)
  }, []);

  const searchFilterFunction = (text: string) => {
    // Check if searched text is not blank
    if (text) {
      
      const newData = masterDataSource.filter(function (item) {
        
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemView = ( item: FilterDataType ) => {
    return (
      // Flat List Item
      <Text style={styles.itemStyle} onPress={() => getItem(item)}>
        {item.id}
        {'.'}
        {item.title.toUpperCase()}
      </Text>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const getItem = (item: FilterDataType) => {
    // Function for click on an item
    //alert('Id : ' + item.id + ' Title : ' + item.title);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleStyle}>{title}</Text>
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
          {/* <FlatList
            data={filteredDataSource}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
          /> */}
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
  titleStyle: {
    color: 'white',
    paddingTop:20,
    paddingBottom:10
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
});

export default Header;