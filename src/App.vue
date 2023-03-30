<template>
  <header>
    <div class="layout">
      <div class="layout-body">
        <RouterView :key="$route.path" />
      </div>
      <div class="layout-footer"></div>
    </div>
  </header>
</template>

<script setup>
// import AppNav from "./components/AppNav.vue";
</script>

<style scoped>
</style>
