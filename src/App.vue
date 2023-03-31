<template>
  <v-app class="l-appLayout">
    <AppBar />
    <div id="app">
      <div class="layout-body">
        <RouterView :key="$route.path" />
      </div>
      <div class="layout-footer"></div>
    </div>
  </v-app>
</template>

<script>
import AppBar from './components/layouts/AppBar.vue'
// import AppNav from "./components/AppNav.vue";

export default {
  components: {
    AppBar
  }
}
</script>

<style scoped>
#app {
  margin-top: 7vh !important;
}
</style>
