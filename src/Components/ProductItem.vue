<script>
export default {
  name: "ProductItem",
  props: {
    product: {
      type: Object,
      required: true,
      validator(value) {
        // Проверяем, что объект продукта содержит обязательные поля
        return (
            'id' in value &&
            'name' in value &&
            'count' in value &&
            'group' in value &&
            'number' in value &&
            'manufacturer' in value &&
            'price' in value
        );
      }
    },
    selected: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<template>
  <div
      class="main_wrapper"
      :class="{ 'selected': selected }"
      @click="$emit('select')"
  >
    <p>{{ product.name }}</p>
    <p>{{ product.count }}</p>
    <p>{{ product.group }}</p>
    <p>{{ product.number }}</p>
    <p>{{ product.manufacturer }}</p>
    <p>{{ product.price }}</p>
  </div>
</template>
<style scoped>
.main_wrapper{
  margin-bottom: 10px;
  padding: 38px;
  padding-right: 52px !important;
  display: flex;
  justify-content: space-between;
  background-color: #D9D9D9;;
  border-radius: 27px;
  width: 910px;
  height: 100px;
}
.main_wrapper p{
  font-family: 'Inter-mf', sans-serif;
  font-size: 20px;
  font-weight: 200;
}
</style>
