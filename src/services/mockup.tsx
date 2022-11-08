import { FaqItemType, FeedType, FriendType, ItemDataType } from "./models";

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
    media: {
      id: '1',
      type: 'photo',
      name: '',
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
    media: {
      id: '2',
      type: 'photo',
      name: '',
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
    media: {
      id: '2',
      name: '',
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

export const feedsMockupData: FeedType[] = [
  {
    id: "1",
    title: 'Festive frocks and party playtforms',
    date: "October 7, 2022",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    picUrl: "https://loremflickr.com/320/240/paris,girl/"
  },
  {
    id: "2",
    title: 'Q & A: Pamela munson x atlantic-pacific',
    date: "October 6, 2021",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    picUrl: "https://loremflickr.com/320/240/paris,girl/"
  },
  {
    id: "3",
    title: 'Comming soon: Pamela munson x atlantic-pacific',
    date: "April 8, 2022",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    picUrl: "https://loremflickr.com/320/240/paris,girl/"
  },
  {
    id: "4",
    title: 'Comming soon: Pamela munson x atlantic-pacific',
    date: "September 5, 2022",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    picUrl: "https://loremflickr.com/320/240/paris,girl/"
  },
  {
    id: "5",
    title: 'Comming soon: Pamela munson x atlantic-pacific',
    date: "February 6, 2022",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    picUrl: "https://loremflickr.com/320/240/paris,girl/"
  },
]

