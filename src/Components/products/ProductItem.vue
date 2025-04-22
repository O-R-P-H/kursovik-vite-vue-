<script>
export default {
  name: "ProductItem",
  props: {
    product: {
      type: Object,
      required: true,
      validator(value) {
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
  },
  watch: {
    selected(newVal) {
      if (newVal) {
        console.log('Выбран продукт:', JSON.stringify(this.product, null, 2));
      }
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
    <div :title=product.name style="max-width: 75px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">{{ product.name }}</div>
    <div :title="product.count" style="display: flex; justify-content: center; width: 65px" >{{ product.count }}</div>
    <div :title="product.group" style="max-width: 75px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">{{ product.group }}</div>
    <div :title="product.number">{{ product.number }}</div>
    <div :title="product.manufacturer" style="max-width: 140px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">{{ product.manufacturer.name }}</div>
    <div :title="product.price">{{ product.price }}</div>
  </div>
</template>

<style scoped>
.main_wrapper {
  margin-bottom: 10px;
  padding: 38px;
  padding-right: 52px !important;
  display: flex;
justify-content: space-between;
  background-color: #D9D9D9;
  border-radius: 27px;
  width: 910px;
  height: max-content;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.main_wrapper:hover {
  cursor: pointer;
  background-color: #d0d0d0;
  box-shadow: 0 3px 8px rgba(0,0,0,0.15);
}

.main_wrapper.selected {
  margin-top:5px ;
  background-color: #c4c4c4;
  border: 2px solid #000000;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transform: translateY(-5px);
  z-index: 1;
}

.main_wrapper p,div {
  font-family: 'Inter-mf', sans-serif;
  font-size: 20px;
  font-weight: 200;
  margin: 0;
}
</style>
