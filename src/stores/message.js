import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useMessageStore = defineStore('message', () => {
  // add message in room in bdd and return message
  async function addMessage(datas) {
    try {
      const response = await axios.post(
        'https://yconnect-api.codemates.fr/api/rooms/6422bed20078771bcf1d0270/messages',
        {
          content: datas.content,
          user: datas.user
        }
      )

      console.log(response.data)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  return { addMessage }
})
