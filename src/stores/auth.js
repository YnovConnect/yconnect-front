import { defineStore } from 'pinia';
import axios from 'axios';

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
        console.log(values);
        const response = await axios.post('https://yconnect-api.codemates.fr/api/login', 
        {
          email: values.email, 
          password: values.password,
        });
        return response.data;
      } catch (error) {
        console.error(error);
      } 
    },
    logout() {
      // Votre logique de déconnexion ici
    },
  },
});
