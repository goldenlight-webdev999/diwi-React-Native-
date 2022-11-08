import { get, post, put, del } from './axios'
import { SERVER_API_URL, getFormObj } from './constants'
import { kindsType, RequestContentType } from './models';

export const getAllItems = async (item: string, userId: string) => {
  const apiEndpoint = `${SERVER_API_URL}/${item}s?user_id=${userId}`
  let result = null
  try {
    const response: any = await get(apiEndpoint);
    result = response    
  } catch (err:any) {
    result = err
  }

  return result
};

export const getItem = async (id: string, type: kindsType) => {
  const apiEndpoint = `${SERVER_API_URL}/${type}s/${id}`
  let result = null
  try {
    const response: any = await get(apiEndpoint);
    result = response    
  } catch (err:any) {
    result = err
  }

  return result
};

export const updateItem = async (id: string, type: kindsType, data: any, contentType?: RequestContentType) => {
  const apiEndpoint = `${SERVER_API_URL}/${type}s/${id}`
  let result = null
  try {
    const response: any = await put(apiEndpoint, data, contentType);
    result = response    
  } catch (err:any) {
    result = err
    console.log(err)
  }

  return result
};

export const createItem = async (type: kindsType, data: any, contentType?: RequestContentType) => {
  const apiEndpoint = `${SERVER_API_URL}/${type}s`
  let result = null

  try {
    const response: any = await post(apiEndpoint, data, contentType);
    result = response    
  } catch (err:any) {
    result = err
  }

  return result
};

export const deleteItem = async (id: string, type: kindsType) => {
  const apiEndpoint = `${SERVER_API_URL}/${type}s/${id}`
  let result = null
  try {
    const response: any = await del(apiEndpoint);
    result = response    
  } catch (err:any) {
    result = err
  }

  return result
};
