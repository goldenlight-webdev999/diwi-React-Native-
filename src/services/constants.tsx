import { FriendType, ItemDataType, MediaParamType, MediaType, SearchResultType } from "./models"
import { Dimensions, Platform } from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

//export const SERVER_API_URL = "http://172.16.1.127:3000/api"
//export const SERVER_CONTENT_URL = "http://172.16.1.127:3000/public/uploads/"

export const apikey = "MyKey"
export const apisecret = "yz&WaCs_!QL)xP#r19RW4Nh6VikA"

export const newToOldText = "newest to oldest"
export const oldtoNewText = "oldes to newest"
export const friendSearchText = "One of your friends"
export const keySearchText = "Search titles, locations, and notes"

export const headerTitle = "Did I wear it?"
export const searchPlaceholder = "Search by Friend or Keyword"

export const searchNoResult = "No looks found"

export const getFormObj = () => {
  let formData = new FormData()
  //formData.append("apikey", apikey)
  //formData.append("apisecret", apisecret)

  return formData
};

export const initItemsData: ItemDataType[] = []

export const initSearchResult: SearchResultType = {
  key: '',
  friendData: [],
  keyData: [],
}

export const initItem: ItemDataType = {
  id: '',
  title: '',
  location: '',
  date: '',
  friends: [],
  note: '',
  media: {
    id: '',
    name: '',
    type: 'photo',
    src: '',
  },
}

export const initFriend: FriendType = {
  id: '',  
  name: '',
}

export const initMedia: MediaType = {  
  id: '',
  name: '',
  type: 'photo',
  src: '',
}

export const initFriendsData: FriendType[] = []

export const itialCaptureParams: MediaParamType = {
  path: '',
  type: 'photo',
}

/** Camera */
export const CONTENT_SPACING = 15;

const SAFE_BOTTOM =
  Platform.select({
    ios: StaticSafeAreaInsets.safeAreaInsetsBottom,
  }) ?? 0;

export const SAFE_AREA_PADDING = {
  paddingLeft: StaticSafeAreaInsets.safeAreaInsetsLeft + CONTENT_SPACING,
  paddingTop: StaticSafeAreaInsets.safeAreaInsetsTop + CONTENT_SPACING,
  paddingRight: StaticSafeAreaInsets.safeAreaInsetsRight + CONTENT_SPACING,
  paddingBottom: SAFE_BOTTOM + CONTENT_SPACING,
};

// The maximum zoom _factor_ you should be able to zoom in
export const MAX_ZOOM_FACTOR = 20;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select<number>({
  android: Dimensions.get('screen').height - StaticSafeAreaInsets.safeAreaInsetsBottom,
  ios: Dimensions.get('window').height,
}) as number;

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;