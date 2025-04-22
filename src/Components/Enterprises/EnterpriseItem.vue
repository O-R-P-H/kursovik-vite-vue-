<script>
export default {
  name: "EnterpriseItem",
  props: {
    enterprise: {
      type: Object,
      required: true,
      validator(value) {
        return (
            'id' in value &&
            'name' in value &&
            'address' in value &&
            'phone' in value &&
            'directorName' in value
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
        console.log('Выбрано предприятие:', JSON.stringify(this.enterprise, null, 2));
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
    <div :title="enterprise.name" style="max-width: 150px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">
      {{ enterprise.name }}
    </div>
    <div :title="enterprise.address" style="max-width: 200px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">
      {{ enterprise.address }}
    </div>
    <div :title="enterprise.phone" style="max-width: 150px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">
      {{ enterprise.phone }}
    </div>
    <div :title="enterprise.directorName" style="max-width: 200px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">
      {{ enterprise.directorName }}
    </div>
  </div>
</template>

<style scoped>
.main_wrapper {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  padding: 38px;
  padding-right: 52px !important;
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
  margin-top: 5px;
  background-color: #c4c4c4;
  border: 2px solid #000000;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transform: translateY(-5px);
  z-index: 1;
}

.main_wrapper div {
  font-family: 'Inter-mf', sans-serif;
  font-size: 20px;
  font-weight: 200;
  margin: 0;
  padding: 0 10px;
}
</style>
