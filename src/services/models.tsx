export interface actionType {
  type: string,
  label?: string
}
export interface HeaderType {
  title: string,
  hasSearch?: boolean,
  back?: boolean,
  action?: actionType,
  initSearchText?: string,
  onSearch: (params: any) => any,
  onBack: (params: any) => any,
}

export interface ItemDataType {
  id: string,
  title: string,
  location: string,
  date: string,
  friend: string,
  note: string,
  pic: any,
}

export interface searchResultScreenDataType {
  searchKey: string,
  dataType: 'friendData' | 'keyData',
  data: ItemDataType[],
}

export interface searchResultType {
  key: string,
  friendData: ItemDataType[],
  keyData: ItemDataType[],
}

export interface homeScreenDataType {
  from: string,
}

/**
 * For Navigation
 */
export type RootStackParamList = {
  Home: homeScreenDataType;
  Settings: undefined;
  Capture: undefined;
  Detail: ItemDataType;
  SearchResult: searchResultScreenDataType;
};