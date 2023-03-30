import { defineStore } from 'pinia';
import api from '../utils/api'

export const useRoomStore = defineStore({
  id: 'room',
  state: () => ({
    currentRoomId: null,
  }),
  actions: {

    async createRoom(name, userCreate, idUsers) {
      try {
        const response = await api.post('rooms', 
        {
          name: name,
          userCreate: userCreate,
          idUsers: idUsers,
          privateRoom: false,
        },
        );

        return response.data;

      } catch (error) {
        console.error(error);
      }
    },

    async fetchRooms() {
      try {
        const response = await api.get('rooms');

        return response.data;

      } catch (error) {
        console.error(error);
      }
    }
  },
  mutations: {  },
});