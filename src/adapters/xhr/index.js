import Axios from "axios";

function returnAxiosInstance() {
  return Axios.create(initializers);
}

export function get(url){
  const axios = returnAxiosInstance();
  return axios.get(url);
}

export function post(url, requestData){
  const axios = returnAxiosInstance();
  return axios.post(url, requestData);
}
