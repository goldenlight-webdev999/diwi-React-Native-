import React, { FC } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Header from '../components/Header';
import { actionType, ItemDataType } from '../services/models';


const ItemScreen: FC<any>=({ route, navigation }) => {
  const item: ItemDataType = route.params;
  const action: actionType = {
    type: 'Edit',
    label: '...'
  }

  return (
    <SafeAreaView>
      <Header title={"Look"} back={true} action={action} onSearch={() => {}} onBack={() => navigation.navigate('Home', {from: 'Detail'})}></Header>
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image style={styles.image} source={item.pic}></Image>
        </View>
        <View style={styles.infoWrapper}>
          <Text>{ item.title }</Text>
          <Text>{ item.location }</Text>
          <Text>{ item.date }</Text>
          <Text>{ item.friend }</Text>
          <Text>{ item.note }</Text>
        </View>
      </View>      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageWrapper: {
    width: '100%',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    resizeMode: 'cover',
  },
  infoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default ItemScreen;