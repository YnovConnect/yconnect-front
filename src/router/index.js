import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AccountCreateView from '../views/AccountCreateView.vue'
import ErrorView from '../views/ErrorView.vue'
import Cookies from 'js-cookie';
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: ErrorView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        const isAuthenticated = checkAuthorization() // Check if user is authorized
        if (isAuthenticated) {
          next() // User is authorized, proceed to the page
        } else {
          next('/login') // User is not authorized, redirect to login page
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: (to, from, next) => {
        const isAuthenticated = checkAuthorization() // Check if user is authorized
        if (isAuthenticated) {
          next('/') // User is not authorized, redirect to home page
        } else {
          next()
        }
      }
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: AccountCreateView,
      beforeEnter: (to, from, next) => {
        const isAuthenticated = checkAuthorization() // Check if user is authorized
        if (isAuthenticated) {
          next('/') // User is not authorized, redirect to home page
        } else {
          next()
        }
      }
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: (to, from, next) => {
        Cookies.remove('yconnect_access_token');
        const authStore = useAuthStore()
        authStore.$reset()
        next('/login')
      }
    }
  ]
})

function checkAuthorization() {
  const authStore = useAuthStore()

  if(Cookies.get('yconnect_access_token')) {
    
    if(authStore.user.length === 0) {
      authStore.user = JSON.parse(Cookies.get('yconnect_access_token')).user
    }
    return true
  } else {
    return false
  }
  // return Cookies.get('yconnect_access_token') ? true : false; // return true if user is authorized, false otherwise
}

export default router
