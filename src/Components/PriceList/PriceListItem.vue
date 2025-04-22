<script>
export default {
  name: "PriceListItem",
  props: {
    priceList: {
      type: Object,
      required: true,
      validator(value) {
        return (
            'id' in value &&
            'manufacturer' in value &&
            'productName' in value &&
            'group' in value &&
            'price' in value
        );
      }
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    manufacturerName() {
      // Обрабатываем manufacturer, который может быть как объектом, так и строкой
      return typeof this.priceList.manufacturer === 'string'
          ? this.priceList.manufacturer
          : this.priceList.manufacturer?.name || 'Не указан';
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
    <div :title="manufacturerName" style="max-width: 140px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">
      {{ manufacturerName }}
    </div>
    <div :title="priceList.productName" style="max-width: 150px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">
      {{ priceList.productName }}
    </div>
    <div :title="priceList.group" style="max-width: 100px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">
      {{ priceList.group }}
    </div>
    <div :title="priceList.price" style="width: 100px; text-align: center">
      {{ priceList.price }}
    </div>
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
