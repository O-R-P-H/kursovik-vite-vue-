<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h2>Массовое обновление цен</h2>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="manufacturer">Производитель:</label>
          <select
              id="manufacturer"
              v-model="selectedManufacturer"
              :disabled="isUpdating"
          >
            <option value="" disabled selected>Выберите производителя</option>
            <option
                v-for="manufacturer in manufacturers"
                :key="manufacturer.id"
                :value="manufacturer.id"
            >
              {{ manufacturer.name }} ({{ manufacturer.priceLists ? manufacturer.priceLists.length : 0 }})
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="price">Новая цена:</label>
          <input
              id="price"
              v-model.number="selectedPrice"
              type="number"
              min="0"
              step="0.01"
              :disabled="isUpdating"
          >
        </div>
        <div v-if="isUpdating" class="progress-container">
          <div class="progress-bar" :style="{ width: updateProgress + '%' }"></div>
          <span class="progress-text">{{ Math.round(updateProgress) }}%</span>
        </div>
      </div>
      <div class="modal-footer">
        <button
            class="cancel-button"
            @click="$emit('close')"
            :disabled="isUpdating"
        >
          Отмена
        </button>
        <button
            class="confirm-button"
            @click="handleConfirm"
            :disabled="isUpdating || !selectedManufacturer || !selectedPrice"
        >
          {{ isUpdating ? 'Обновление...' : 'Обновить' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    manufacturers: {
      type: Array,
      required: true
    },
    isUpdating: {
      type: Boolean,
      default: false
    },
    updateProgress: {
      type: Number,
      default: 0
    },
    manufacturer: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      default: null
    }
  },
  emits: ['close', 'confirm', 'update:manufacturer', 'update:price'],
  data() {
    return {
      selectedManufacturer: this.manufacturer,
      selectedPrice: this.price
    }
  },
  watch: {
    manufacturer(newVal) {
      this.selectedManufacturer = newVal;
    },
    price(newVal) {
      this.selectedPrice = newVal;
    },
    selectedManufacturer(newVal) {
      this.$emit('update:manufacturer', newVal);
    },
    selectedPrice(newVal) {
      this.$emit('update:price', newVal);
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm');
    }
  }
}
</script>

<style scoped>
/* Стили остаются без изменений */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-body {
  padding: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group select,
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.progress-container {
  margin-top: 20px;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  position: relative;
}

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-size: 12px;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.cancel-button,
.confirm-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-button {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
}

.confirm-button {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.confirm-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>