import axios from 'axios'
let Api = axios.create({
    baseURL: "http://localhost/auxicam-back/public/api/"
  });
  
  Api.defaults.withCredentials = true;
  
  export default Api;