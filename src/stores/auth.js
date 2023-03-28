import { defineStore } from 'pinia'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useUserStore } from '../stores/user'

export const useAuthStore = defineStore('auth', {
  actions: {
    async register(values) {
      try {
        const response = await axios.post('https://yconnect-api.codemates.fr/api/register', {
          email: values.email,
          password: values.password,
          firstname: values.first_name,
          lastname: values.last_name
        })
        return response.data
      } catch (error) {
        console.error(error)
      }
    },

    async login(values) {
      try {
        const response = await axios.post('https://yconnect-api.codemates.fr/api/login', {
          email: values.email,
          password: values.password
        })

        // console.log(response.data.user)
        Cookies.set(
          'yconnect_access_token',
          JSON.stringify({
            token: response.data.yconnect_access_token,
            user: response.data.user
          }),
          { expires: 7 }
        )
        const userStore = useUserStore()
        userStore.setLastname(response.data.user.lastname)
        userStore.setFirstname(response.data.user.firstname)
        userStore.setEmail(response.data.user.email)
        userStore.setBirthday(response.data.user.birthday)
        userStore.setIsDeleted(response.data.user.isDeleted)
        userStore.setId(response.data.user._id)

        return response.data
      } catch (error) {
        console.error(error)
      }
    },
    logout() {
      Cookies.remove('yconnect_access_token')

      const userStore = useUserStore()
      userStore.$reset()
    }
  }
})
