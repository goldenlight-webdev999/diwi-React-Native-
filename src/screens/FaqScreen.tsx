import React, { FC } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import FaqItem from '../components/FaqItem';
import Header from '../components/Header';
import { faqData } from '../services/mockup';

const FaqScreen: FC=(props) => {  
  return (
    <View style={styles.page}>
      <Header
        title={"FAQ"}
        back={false}
        onSearch={() => {}}
        onBack={() => {}}
        onSave={() => {}}
        onMore={() => {}}
      />
      <View style={styles.container}>
        <View style={styles.wrapper}>
          {faqData.map((faq, index) => (
            <FaqItem
              question={faq.question}
              answer={faq.answer}
              key={index}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapper: {
    width: '100%',
    padding: 20,
  },
  
});

export default FaqScreen;