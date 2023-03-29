import { defineStore } from 'pinia';
import api from '../utils/api'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({

  }),
  actions: {
    async listAllUser() {
      try {
        const response = await api.get('users');

        return response.data;

      } catch (error) {
        console.error(error);
      }
    },
  },
  mutations: {

  },
});