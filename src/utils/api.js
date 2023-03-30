import axios from 'axios';
// import { get } from 'lodash';
import config from '../config/index';
import Cookies from 'js-cookie';


const instance = axios.create({
  baseURL: `${config.apiUrl}/api/`,
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('yconnect_access_token');
    if (token) {
      config.headers["Authorization"] = "Bearer " + JSON.parse(token).token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// instance.interceptors.response.use({}, async (error) => {
//   const { response } = error;
//   const originalRequest = error.config;

//   if (response.status === 403) {
//     originalRequest.headers = {
//       'Content-Type': 'application/json',
//     };
//     const res = await instance.post('/accounts/token', { refresh_token: get(localStorage, 'mydevops_token') });
//     if (res.status === 201) {
//       return axios(originalRequest);
//     }
//   }
//   return Promise.reject(error);
// });

export default instance;
