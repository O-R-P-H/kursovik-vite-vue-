<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Редактирование продукта</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Название:</label>
          <input
              v-model.trim="formData.name"
              required
              maxlength="100"
          >
        </div>

        <div class="form-group">
          <label>Количество:</label>
          <input
              v-model.number="formData.count"
              type="number"
              min="1"
              required
          >
        </div>

        <div class="form-group">
          <label>Группа:</label>
          <input
              v-model.trim="formData.group"
              required
              maxlength="50"
          >
        </div>

        <div class="form-group">
          <label>Артикул:</label>
          <input
              v-model.trim="formData.number"
              required
              maxlength="50"
          >
        </div>

        <div class="form-group">
          <label>Производитель:</label>
          <input
              v-model="manufacturerInput"
              required
              maxlength="100"
          >
        </div>

        <div class="form-group">
          <label>Цена:</label>
          <input
              v-model="formData.price"
              required
          >
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="closeModal">Отмена</button>
          <button type="submit" class="confirm-btn" :disabled="isLoading">
            {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue';
import { ProductApi } from "@/api/productApi/index.js";

export default {
  props: {
    productToEdit: {
      type: Object,
      required: true,
      validator: value => (
          value.id &&
          typeof value.name === 'string' &&
          typeof value.count === 'number' &&
          typeof value.group === 'string' &&
          typeof value.number === 'string' &&
          typeof value.price === 'string' &&
          value.manufacturer
      )
    }
  },
  emits: ['close', 'product-updated'],

  setup(props, { emit }) {
    const formData = ref({
      ...props.productToEdit,
      count: Number(props.productToEdit.count),
      price: String(props.productToEdit.price)
    });

    const manufacturerInput = computed({
      get() {
        return typeof formData.value.manufacturer === 'object'
            ? formData.value.manufacturer.name
            : formData.value.manufacturer;
      },
      set(value) {
        if (typeof formData.value.manufacturer === 'object') {
          formData.value.manufacturer.name = value;
        } else {
          formData.value.manufacturer = value;
        }
      }
    });

    const isLoading = ref(false);
    const errors = ref([]);

    watch(() => props.productToEdit, (newVal) => {
      formData.value = {
        ...newVal,
        count: Number(newVal.count),
        price: String(newVal.price)
      };
    }, { deep: true });

    const validateForm = () => {
      errors.value = [];

      if (!formData.value.name || formData.value.name.length > 100) {
        errors.value.push('Название должно быть от 1 до 100 символов');
      }

      if (!formData.value.count || formData.value.count < 1) {
        errors.value.push('Количество должно быть положительным числом');
      }

      if (!formData.value.group || formData.value.group.length > 50) {
        errors.value.push('Группа должна быть от 1 до 50 символов');
      }

      if (!formData.value.number || formData.value.number.length > 50) {
        errors.value.push('Артикул должен быть от 1 до 50 символов');
      }

      if (!manufacturerInput.value || manufacturerInput.value.length > 100) {
        errors.value.push('Производитель должен быть от 1 до 100 символов');
      }

      if (!formData.value.price || isNaN(parseFloat(formData.value.price))) {
        errors.value.push('Укажите корректную цену');
      }

      return errors.value.length === 0;
    };

    const closeModal = () => {
      emit('close');
    };

    const submitForm = async () => {
      if (!validateForm()) {
        alert(errors.value.join('\n'));
        return;
      }

      isLoading.value = true;
      try {
        const updatedProduct = await ProductApi.update(
            formData.value.id,
            {
              ...formData.value,
              manufacturer: manufacturerInput.value
            }
        );

        emit('product-updated', updatedProduct);
        closeModal();
      } catch (error) {
        console.error('Ошибка при обновлении:', error);
        alert(error.response?.data?.message || 'Не удалось обновить продукт');
      } finally {
        isLoading.value = false;
      }
    };

    return {
      formData,
      manufacturerInput,
      isLoading,
      closeModal,
      submitForm
    };
  }
}
</script>

<style scoped>
p,label,h2,button{
  font-family: 'Inter-mf', sans-serif;
}
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
  padding: 25px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
}

.modal-content h2 {

  margin-top: 0;
  color: #33C760;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  padding: 8px 16px;
  background: #ccc;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn {
  padding: 8px 16px;
  background-color: #199BEC;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn:hover {
  background-color: #1883c3;
}
</style>
