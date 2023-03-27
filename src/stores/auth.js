import { defineStore } from 'pinia';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', {
  
  actions: {
    async register(values) {
      try {
        const response = await axios.post('https://yconnect-api.codemates.fr/api/register', 
        {
          email: values.email, 
          password: values.password,
          firstname: values.first_name, 
          lastname: values.last_name, 
        });
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async login(values) {
      try {
        const response = await axios.post('https://yconnect-api.codemates.fr/api/login', 
        {
          email: values.email, 
          password: values.password,
        },
        );

        Cookies.set('yconnect_access_token', response.data.yconnect_access_token, { expires: 7 });
        return response.data;
      } catch (error) {
        console.error(error);
      } 
    },
    logout() {
      Cookies.remove('yconnect_access_token');
    },
  },
});
