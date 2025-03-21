<script>
import router from "@/router/router.js";
import ProductItem from "@/Components/ProductItem.vue";

export default {
  components: {ProductItem},
  methods: {
    routerPushtoHome() {
      router.push({path: "/"})
    }
  }
}
</script>

<template>
  <div>
    <H1 class="title">Products</H1>
    <div class="search_box">
      <input type="text" class="search">
    </div>
    <div class="titling">
      <div class="titling_item">
        <p>Name</p>
        <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
      </div>
      <div class="titling_item">
        <p>Count</p>
        <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
      </div>
      <div class="titling_item">
        <p>Group</p>
        <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
      </div>
      <div class="titling_item">
        <p>Number</p>
        <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
      </div>
      <div class="titling_item">
        <p>Manufacturer</p>
        <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
      </div>
      <div class="titling_item">
        <p>Price</p>
        <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
      </div>
    </div>
    <div class="wrapper">
      <ProductItem></ProductItem>
    </div>
    <button style="height: 50px;width: 250px;background-color: red;border-radius: 25px" @click="routerPushtoHome">На
      главную
    </button>

  </div>
</template>

<style scoped>
.title {
  margin-top: 50px;
  margin-left: 60px;
  font-size: 36px;
  font-weight: 600;
  font-family: 'Inter-mf', sans-serif;
}

.search {
  width: 910px;
  height: 44px;
  background-color: #D9D9D9;
  border-radius: 87px;

}

.search_box {
  margin-top: 8px;
  margin-left: 60px;
}
.titling{
  margin-top: 15px;
  margin-left: 60px;
  display:flex;
  width: 910px;
  justify-content: space-around;
}
.titling_item{
  display: flex;
  font-size: 20px;
  font-weight: 600;
  font-family: 'Inter-mf', sans-serif;
}
.wrapper{
  margin-left: 60px;
  margin-top: 15px;
}
</style>
