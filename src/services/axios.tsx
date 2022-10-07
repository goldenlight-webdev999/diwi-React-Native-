import axios from "axios";

export const getAxios = () => {
  let axiosInstance;

  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  };

  axiosInstance = axios.create({
    headers,
    timeout: 50000,
  });

  axiosInstance.interceptors.response.use(
    function (response) {
      return Promise.resolve(response);
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const post = (uri: string, data: any) => {
  return new Promise((resolve, reject) => {
    getAxios()
      .post(uri, data)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
