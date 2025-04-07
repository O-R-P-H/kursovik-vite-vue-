<script setup>
// Your setup script here
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.fullPath" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
  opacity: 0;
}
.fade-enter-to{
  transition: opacity 0.3s;
  opacity: 1;
} .fade-leave-to /* .fade-leave-active в <2.1.8 */ {
    transition: opacity 0.3s;
    opacity: 0;
  }


/* Your global styles here */
</style>
