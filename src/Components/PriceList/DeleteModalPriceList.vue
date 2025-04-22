<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Подтверждение удаления</h2>

      <div v-if="priceListsToDelete.length === 1">
        <p>Вы действительно хотите удалить прайс-лист продукта
          <strong>"{{ priceListsToDelete[0].productName }}"</strong>
          компании <strong>"{{ getManufacturerName(priceListsToDelete[0].manufacturer) }}"</strong>?
        </p>
      </div>

      <div v-else>
        <p>Вы действительно хотите удалить следующие прайс-листы?</p>
        <ul class="delete-list">
          <li v-for="priceList in priceListsToDelete" :key="priceList.id">
            Продукт: <strong>{{ priceList.productName }}</strong>,
            Компания: <strong>{{ getManufacturerName(priceList.manufacturer) }}</strong>
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
import { PriceListApi } from "@/api/priceListApi";

export default {
  props: {
    priceListsToDelete: {
      type: Array,
      required: true,
      validator: value => value.every(item => item && item.id && item.productName && item.manufacturer)
    }
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const isLoading = ref(false);

    const getManufacturerName = (manufacturer) => {
      return typeof manufacturer === 'string'
          ? manufacturer
          : manufacturer?.name || 'Неизвестная компания';
    };

    const closeModal = () => {
      emit('close');
    };

    const confirmDelete = async () => {
      isLoading.value = true;
      try {
        const idsToDelete = props.priceListsToDelete.map(e => e.id);

        const results = await Promise.allSettled(
            idsToDelete.map(id => PriceListApi.delete(id))
        );

        const hasErrors = results.some(result => {
          if (result.status === 'rejected' && result.reason.response?.status !== 404) {
            console.error('Ошибка при удалении:', result.reason);
            return true;
          }
          return false;
        });

        if (hasErrors) {
          throw new Error('Не удалось удалить некоторые прайс-листы');
        }

        emit('confirm');
        closeModal();
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert(error.message || 'Не удалось удалить прайс-листы');
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isLoading,
      getManufacturerName,
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
  width: 600px;
  max-width: 90%;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}

.delete-list {
  max-height: 200px;
  overflow-y: auto;
  padding-left: 20px;
  list-style-type: none;
}

.delete-list li {
  margin-bottom: 10px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
}

button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
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

strong {
  font-weight: 600;
}
</style>
