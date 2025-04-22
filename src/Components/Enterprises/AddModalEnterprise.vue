<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Добавление предприятия</h2>
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
          <label>Адрес:</label>
          <input
              v-model.trim="formData.address"
              required
              maxlength="200"
          >
        </div>

        <div class="form-group">
          <label>Телефон:</label>
          <input
              v-model.trim="formData.phone"
              required
              maxlength="20"
          >
        </div>

        <div class="form-group">
          <label>ФИО Директора:</label>
          <input
              v-model.trim="formData.directorName"
              required
              maxlength="100"
          >
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="closeModal">Отмена</button>
          <button type="submit" class="confirm-btn" :disabled="isLoading">
            {{ isLoading ? 'Сохранение...' : 'Добавить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ManufacturerApi } from "@/api/manufacturerApi/index.js";

export default {
  emits: ['close', 'enterprise-added'],
  setup(props, { emit }) {
    const formData = ref({
      name: '',
      address: 'Не указан',
      phone: 'Не указан',
      directorName: 'Не указан'
    });
    const isLoading = ref(false);
    const errors = ref([]);

    const validateForm = () => {
      errors.value = [];

      if (!formData.value.name || formData.value.name.length > 100) {
        errors.value.push('Название должно быть от 1 до 100 символов');
      }

      if (formData.value.address.length > 200) {
        errors.value.push('Адрес должен быть до 200 символов');
      }

      if (formData.value.phone.length > 20) {
        errors.value.push('Телефон должен быть до 20 символов');
      }

      if (formData.value.directorName.length > 100) {
        errors.value.push('ФИО директора должно быть до 100 символов');
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
        const newEnterprise = await ManufacturerApi.create(formData.value);
        emit('enterprise-added', newEnterprise);
        closeModal();
      } catch (error) {
        console.error('Ошибка при добавлении:', error);
        alert(error.response?.data?.message || 'Не удалось добавить предприятие');
      } finally {
        isLoading.value = false;
      }
    };

    return {
      formData,
      isLoading,
      closeModal,
      submitForm
    };
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
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

button {
  padding: 8px 15px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f0f0f0;
}

.confirm-btn {
  background-color: #33C760;
  color: white;
}

.confirm-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}
</style>
