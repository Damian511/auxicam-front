import axios from 'axios'
let Api = axios.create({
    baseURL: "http://172.16.100.200/auxicam-back/public/api/"
  });
  
  Api.defaults.withCredentials = true;
  
  export default Api;