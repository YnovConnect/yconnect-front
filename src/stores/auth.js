import { defineStore } from 'pinia'
import api from '../utils/api'
import Cookies from 'js-cookie'
import { useUserStore } from '../stores/user'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: []
  }),
  actions: {
    /**
     * Register a new user
     */
    async register(values) {
      try {
        const response = await api.post('register', {
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

    /**
     * Login a user
     */
    async login(values) {
      try {
        const response = await api.post('login', {
          email: values.email,
          password: values.password
        })

        Cookies.set(
          'yconnect_access_token',
          JSON.stringify({
            token: response.data.yconnect_access_token,
            user: response.data.user
          }),
          { expires: 7 }
        )

        // add this user in the state of auth store
        this.user = response.data.user

        return response.data
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * Logout a user
     */
    logout() {
      Cookies.remove('yconnect_access_token')

      const userStore = useUserStore()
      userStore.$reset()
    }
  },
  mutations: {
    reset(state) {
      Object.assign(state, state.$reset())
    }
  }
})
