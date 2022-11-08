import axios from "axios";
import { RequestContentType } from "./models";

export const getAxios = (contentType?: RequestContentType) => {
	let axiosInstance

	const headers = {
		'Content-Type': ( contentType && contentType === 'form') ? 'multipart/form-data' : 'application/json',
		Accept: 'application/json',
	}

	axiosInstance = axios.create({
		headers,
		timeout: 50000 * 4,
	})

	axiosInstance.interceptors.response.use(
		function (response) {
			return Promise.resolve(response)
		},
		function (error) {
			return Promise.reject(error)
		}
	)

	return axiosInstance
}

export const post = (uri: string, data: any, contentType?: RequestContentType) => {
  return new Promise((resolve, reject) => {
    getAxios(contentType)
      .post(uri, data)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const get = (uri: string) => {  
  return new Promise((resolve, reject) => {
    getAxios()
      .get(uri)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log(error)
        reject(error);
      });
  });
};

export const put = (uri: string, data: any ,contentType?: RequestContentType) => {  
  return new Promise((resolve, reject) => {
    getAxios(contentType)
      .put(uri, data)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const del = (uri: string) => {
  return new Promise((resolve, reject) => {
    getAxios()
      .delete(uri)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};