export type RootNameType = 'Home' | 'Settings' | 'Detail' | 'Edit' | 'SearchResult' | 'Friends' | 'AddFriend' | 'Faq' | 'Camera' | 'Capture' | 'New' | 'Media'
export type CaptureType = 'video' | 'photo'
export type ImageSizeType = 'thumbnail' | 'image'
export type SearchDataType = 'friendData' | 'keyData'

export interface ActionType {
  type: 'Save' | 'More',
  label?: string
}
export interface HeaderType {
  title: string,
  hasSearch?: boolean,
  back?: boolean,
  action?: ActionType,
  initSearchText?: string,
  onSearch: (params: any) => any,
  onBack: (params: any) => any,
  onMore: (params: any) => any,
  onSave: (params: any) => any,
}

export interface PicType {
  type: CaptureType,
  src: any,
}

export interface FaqItemType {
  question: string,
  answer: string,
}

export interface CustomImageType {
  isImage: boolean,
  type: CaptureType,
  src: string,
  size: ImageSizeType,
  //onClick: (params: any) => any,
}

export interface ItemDataType {
  id: string,
  title: string,
  location: string,
  date: string,
  friends: FriendType[],
  note: string,
  pic: PicType,
}

export interface searchResultScreenDataType {
  searchKey: string,
  dataType: SearchDataType,
  itemData: ItemDataType[],
  friendData: FriendType[],
}

export interface SearchResultType {
  key: string,
  friendData: FriendType[],
  keyData: ItemDataType[],
}

export interface HomeScreenDataType {
  from: RootNameType,
  data: ItemDataType[],
}

export interface FriendType {
  id: string,
  name: string,
}

export interface MediaParamType {
  path: string,
  type: CaptureType,
}

export interface CameraType {
  type: CaptureType,
}

/**
 * For Navigation
 */
export type RootStackParamList = {
  Home: HomeScreenDataType;
  Settings: undefined;
  Detail: undefined;
  Edit: undefined;
  SearchResult: searchResultScreenDataType;
  Friends: FriendType;
  AddFriend: undefined;
  Faq: undefined;
  Camera: CameraType;
  Capture: MediaParamType;
  New: MediaParamType;
  Media: MediaParamType;
};