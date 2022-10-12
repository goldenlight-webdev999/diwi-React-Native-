import { ItemDataType, searchResultType } from "./models"

export const server_domain = "https://www.yyy.com/?api"
export const apikey = "ssssssssssssssss"
export const apisecret = "xxxxxxxx"

export const newToOldText = "newest to oldest"
export const oldtoNewText = "oldes to newest"
export const friendSearchText = "One of your friends"
export const keySearchText = "Search titles, locations, and notes"

export const headerTitle = "Did I wear it?"
export const searchPlaceholder = "Search by Friend or Keyword"

export const searchNoResult = "No looks found"

export const getFormObj = () => {
  let formData = new FormData()
  formData.append("apikey", apikey)
  formData.append("apisecret", apisecret)

  return formData
};

export const initItemsData: ItemDataType[] = []

export const initSearchResult: searchResultType = {
  key: '',
  friendData: [],
  keyData: [],
}