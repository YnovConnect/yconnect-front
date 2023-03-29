import { defineStore } from 'pinia'
import axios from 'axios'
import config from '../config'
import api from '../utils/api'

export const useMessageStore = defineStore('message', () => {
  async function addMessage(datas) {
    try {
      const response = await api.post('/rooms/' + datas.roomId + '/messages', {
        content: datas.content,
        user: datas.user
      })

      console.log(response.data)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  return { addMessage }
})
