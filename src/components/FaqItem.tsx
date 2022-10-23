import React, { FC, useState } from 'react';
import {
  StyleSheet,  
  Image,
  View,
  TouchableWithoutFeedback,
  Text
} from 'react-native';
import { FaqItemType } from '../services/models';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const FaqItem: FC<FaqItemType>=(props) => {
  const { question, answer } = props
  const [isExpanded, setIsExpanded] = useState(false);

 

  return (
    <View style={styles.wrapper}>
      <TouchableWithoutFeedback onPress={() => { setIsExpanded(!isExpanded) }}>
        <View
          style={styles.questionWrapper}
        >
          <Text style={styles.questionText}>{question}</Text>        
          <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} color={'#ccc'} size={30} />
          
        </View>
      </TouchableWithoutFeedback>
      
      {isExpanded && (
        <Text style={styles.answer}>{answer}</Text>
      )}
      
    </View>
    
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 5,
  },
  questionWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderWidth: 1,
  },
  questionText: {
    padding: 10,
  },
  answer: {
    backgroundColor: '#eee',
    padding: 10,
  },
  btn: {

  },
});

export default FaqItem;