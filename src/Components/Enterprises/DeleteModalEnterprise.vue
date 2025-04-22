<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Подтверждение удаления</h2>
      <p v-if="enterprisesToDelete.length === 1">
        Вы действительно хотите удалить предприятие "{{ enterprisesToDelete[0].name }}"?
      </p>
      <div v-else>
        <p>Вы действительно хотите удалить следующие предприятия?</p>
        <ul>
          <li v-for="enterprise in enterprisesToDelete" :key="enterprise.id">
            {{ enterprise.name }}
          </li>
        </ul>
      </div>

      <div class="modal-actions">
        <button class="cancel-btn" @click="closeModal">Отмена</button>
        <button class="confirm-btn" @click="confirmDelete" :disabled="isLoading">
          {{ isLoading ? 'Удаление...' : 'Удалить' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ManufacturerApi } from "@/api/manufacturerApi/index.js";

export default {
  props: {
    enterprisesToDelete: {
      type: Array,
      required: true,
      validator: value => value.every(item => item && item.id)
    }
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const isLoading = ref(false);

    const closeModal = () => {
      emit('close');
    };

    const confirmDelete = async () => {
      isLoading.value = true;
      try {
        const idsToDelete = props.enterprisesToDelete.map(e => e.id);

        // Используем Promise.allSettled вместо Promise.all
        const results = await Promise.allSettled(
            idsToDelete.map(id => ManufacturerApi.delete(id))
        );

        // Проверяем результаты
        const hasErrors = results.some(result => {
          if (result.status === 'rejected') {
            // Игнорируем 404 ошибки, так как они могут означать успешное удаление
            if (result.reason.response?.status !== 404) {
              console.error('Ошибка при удалении:', result.reason);
              return true;
            }
          }
          return false;
        });

        if (hasErrors) {
          throw new Error('Не удалось удалить некоторые предприятия');
        }

        emit('confirm');
        closeModal();
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert(error.message || 'Не удалось удалить предприятия');
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isLoading,
      closeModal,
      confirmDelete
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

ul {
  max-height: 200px;
  overflow-y: auto;
  padding-left: 20px;
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
  background-color: #E43131;
  color: white;
}

.confirm-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
