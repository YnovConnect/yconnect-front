<template>
  <v-app-bar class="appBar" app flat>
    <v-toolbar-title>
      <img v-if="isMobile" src="../../../public/icons/512x512.png" alt="logo" width="35" />
      <img v-else src="@/assets/logo.svg" alt="logo" width="200" />
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <template v-if="auth">
      <v-btn v-if="!isMobile" text color="black" @click="$router.push({ name: 'logout' })">
        Déconnexion
      </v-btn>
      <v-btn v-else icon color="black" class="pt-0" @click="$router.push({ name: 'logout' })">
        <img src="@/assets/logout.svg" alt="logo" width="25" />
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
export default {
  name: 'App',
  components: {},

  data() {
    return {
      themeMode: ''
    }
  },

  computed: {
    isMobile() {
      return this.$vuetify.display.mobile
    },

    auth() {
      const authStore = useAuthStore()
      return authStore.user._id ? true : false
    }
  }
}
</script>

<style>
.appBar {
  background-color: transparent !important;
}
</style>