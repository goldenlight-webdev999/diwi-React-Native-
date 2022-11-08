export type RootNameType = 'Home' | 'Settings' | 'Detail' | 'Edit' | 'SearchResult' | 'Friends' | 'AddFriend' | 'Faq' | 'Camera' | 'Capture' | 'New' | 'Media' | 'Login' | 'Signup' | 'ForgotPassword'
export type CaptureType = 'video' | 'photo'
export type ImageSizeType = 'thumbnail' | 'image'
export type SearchDataType = 'friendData' | 'keyData'
export type RequestContentType = 'form' | 'json'
export type kindsType = 'look' | 'friend' | 'media' | 'user'

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

export interface MediaType {
  id: string,
  name: string,
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
  media: MediaType,
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

export interface FriendsParamType {
  new?: FriendType,
  media?: MediaParamType,
  from?: RootNameType,
}

export interface NewParamType {
  media: MediaParamType,
  friends?: FriendType[],
  from?: RootNameType,
}

export interface CameraType {
  type: CaptureType,
}

export interface UserType {
  user_id: string,
  email: string | null,
  name?: any,
  phonNumber?: any,
}

export interface authUserType {
  user: UserType,
  isAuth: boolean,
}

export interface FeedType {
  id: string | null,
  title?: string | null,
  date?: string | null,
  description?: string | null,
  picUrl: string,
}

/**
 * For Navigation
 */
export type RootStackParamList = {
  Home: HomeScreenDataType;
  Settings: undefined;
  Detail: undefined;
  Edit: ItemDataType;
  SearchResult: searchResultScreenDataType;
  Friends: FriendsParamType;
  AddFriend: undefined;
  Faq: undefined;
  Camera: CameraType;
  Capture: MediaParamType;
  New: NewParamType;
  Media: MediaParamType;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};