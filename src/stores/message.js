import { defineStore } from 'pinia'
import api from '../utils/api'

export const useMessageStore = defineStore('message', () => {
  async function addMessage(datas) {
    try {
      const response = await api.post('/rooms/' + datas.roomId + '/messages', {
        content: datas.content,
        user: datas.user
      })
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  async function getMessages(roomId) {
    try {
      const response = await api.get('/rooms/' + roomId.roomId + '/messages')
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  return { addMessage, getMessages }
})
