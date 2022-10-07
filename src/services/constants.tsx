export const server_domain = "https://www.yyy.com/?api";
export const apikey = "ssssssssssssssss";
export const apisecret = "xxxxxxxx";

export const getFormObj = () => {
  let formData = new FormData();
  formData.append("apikey", apikey);
  formData.append("apisecret", apisecret);

  return formData;
};
