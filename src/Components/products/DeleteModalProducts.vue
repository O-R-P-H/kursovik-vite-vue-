<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Корректировка количества товара</h2>
      <div class="product-info" v-if="productToEdit">
        <p><strong>Название:</strong> {{ productToEdit.name }}</p>
        <p><strong>Текущее количество:</strong> {{ productToEdit.count }}</p>
        <p><strong>Производитель:</strong> {{ manufacturerName }}</p>
      </div>

      <div class="edit-field">
        <label for="countToRemove">Количество для списания:</label>
        <input
            id="countToRemove"
            v-model.number="countToRemove"
            type="number"
            min="1"
            :max="productToEdit.count"
            step="1"
            @input="validateInput"
        >
        <span v-if="error" class="error-message">{{ error }}</span>
      </div>

      <div class="modal-actions">
        <button class="cancel-btn" @click="closeModal">Отмена</button>
        <button
            class="confirm-btn"
            @click="confirmRemove"
            :disabled="!!error || !countToRemove || isLoading"
        >
          {{ isLoading ? 'Сохранение...' : 'Подтвердить' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ProductApi } from "@/api/productApi/index.js";

export default {
  props: {
    productToEdit: {
      type: Object,
      required: true,
      validator: value => value && value.id && typeof value.count === 'number'
    }
  },
  emits: ['close', 'product-updated'],
  data() {
    return {
      countToRemove: null,
      error: null,
      isLoading: false
    }
  },
  computed: {
    manufacturerName() {
      if (!this.productToEdit.manufacturer) return 'Не указан';
      return typeof this.productToEdit.manufacturer === 'string'
          ? this.productToEdit.manufacturer
          : this.productToEdit.manufacturer.name;
    }
  },
  methods: {
    validateInput() {
      if (!this.countToRemove || this.countToRemove <= 0) {
        this.error = 'Введите положительное число';
      } else if (this.countToRemove > this.productToEdit.count) {
        this.error = `Нельзя списать больше ${this.productToEdit.count} шт.`;
      } else {
        this.error = null;
      }
    },
    closeModal() {
      this.$emit('close');
    },
    async confirmRemove() {
      if (this.error || !this.countToRemove) return;

      this.isLoading = true;
      try {
        const newCount = this.productToEdit.count - this.countToRemove;
        const updatedProduct = await ProductApi.update(this.productToEdit.id, {
          count: newCount
        });

        this.$emit('product-updated', updatedProduct);
        this.closeModal();
      } catch (err) {
        console.error('Ошибка при обновлении:', err);
        alert(err.response?.data?.message || 'Ошибка при списании товара');
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
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

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 512px;
  max-width: 90%;
}

.modal-content h2 {
  font-family: 'Inter-mf', sans-serif;
  margin-top: 0;
  color: #33C760;
}

.product-info {
  margin: 20px 0;
}

.product-info p {
  margin: 5px 0;
}

.edit-field {
  margin: 20px 0;
}

.edit-field label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.edit-field input {
  width: 100px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-message {
  display: block;
  color: #E43131;
  font-size: 0.8em;
  margin-top: 5px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  height: 35px;
  font-family: 'Inter-mf', sans-serif;
  padding: 8px 16px;
  background: #ccc;
  border: none;
  border-radius: 25px;
  cursor: pointer;
}

.confirm-btn {
  height: 35px;
  font-family: 'Inter-mf', sans-serif;
  padding-right: 20px;
  padding-left: 20px;
  background: #33C760;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
}

.confirm-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.confirm-btn:hover:not(:disabled) {
  background: #2aad52;
}
</style>
