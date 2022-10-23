import { FaqItemType, FriendType, ItemDataType } from "./models";

export const itemsData: ItemDataType[] = [
  {
    id: "1",
    title: 'Hollywood bowl',
    location: 'Hollywood bowl',
    date: 'Sep 10, 2022',
    friends: [
      {
        id: "1",
        name: 'Arlene Armas',
      },
      {
        id: "2",
        name: 'Eric Armas',
      },
    ],
    note: 'Here goes not...',
    pic: {
      type: 'photo',
      //src: require('../assets/img/pic1.png'),
      src: "https://loremflickr.com/g/320/240/paris",
    },
  },
  {
    id: "2",
    title: 'Title 2',
    location: 'AAAAA',
    date: 'Oct 10, 2022',
    friends: [
      {
        id: "2",
        name: 'Eric Armas',
      },
      {
        id: "3",
        name: 'John Smith',
      },
    ],
    note: 'Here goes not...',
    pic: {
      type: 'photo',
      //src: require('../assets/img/pic2.png'),
      src: "https://loremflickr.com/g/320/240/family",
    },
  },
  {
    id: "3",
    title: 'Title 3',
    location: 'BBBB',
    date: 'Aug 1, 2022',
    friends: [
      {
        id: "1",
        name: 'Arlene Armas',
      },
      {
        id: "4",
        name: 'Sam Smith',
      },
    ],
    note: 'Here goes not...',
    pic: {
      type: 'video',
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
  },
]

export const friendsData: FriendType[] = [
  {
    id: "1",
    name: 'Arlene Armas',
  },
  {
    id: "2",
    name: 'Eric Armas',
  },
  {
    id: "3",
    name: 'John Smith',
  },
  {
    id: "4",
    name: 'Sam Smith',
  },
]

export const faqData: FaqItemType[] = [
  {
    question: "Question 1",
    answer: 'This is an answer for question 1.',
  },
  {
    question: "Question 2",
    answer: 'This is an answer for question 2.',
  },
  {
    question: "Question 3",
    answer: 'This is an answer for question 3.',
  },
  {
    question: "Question 4",
    answer: 'This is an answer for question 4.',
  },
  {
    question: "Question 5",
    answer: 'This is an answer for question 5.',
  },
  
]

