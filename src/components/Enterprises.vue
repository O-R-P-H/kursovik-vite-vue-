<script>
import router from "@/router/router.js";

export default {
  methods:{
    routerPushtoHome(){
      router.push({path:"/"})
    }
  }
}

</script>

<template>
  <div>
    <H1>Предприятия</H1>
    <button style="height: 50px;width: 250px;background-color: red;border-radius: 25px" @click="routerPushtoHome">На главную</button>

  </div>

</template>

<style scoped>

</style>
