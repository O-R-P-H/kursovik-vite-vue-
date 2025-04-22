<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Редактирование прайс-листа</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Название продукта:</label>
          <input v-model="formData.productName" required>
        </div>

        <div class="form-group">
          <label>Группа:</label>
          <input v-model="formData.group" required>
        </div>

        <div class="form-group">
          <label>Цена:</label>
          <input v-model="formData.price" type="text" required>
          <span v-if="priceError" class="error-message">{{ priceError }}</span>
        </div>

        <div class="form-group">
          <label>Производитель:</label>
          <input v-model="formData.manufacturer" required>
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
import { PriceListApi } from "@/api/priceListApi";
import { ManufacturerApi } from "@/api/manufacturerApi";

export default {
  props: {
    priceListToEdit: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        productName: '',
        group: '',
        price: '',
        manufacturer: ''
      },
      priceError: null,
      isLoading: false
    };
  },
  created() {
    this.initializeForm();
  },
  methods: {
    initializeForm() {
      this.formData = {
        productName: this.priceListToEdit.productName || '',
        group: this.priceListToEdit.group || '',
        price: this.priceListToEdit.price || '',
        manufacturer: this.getManufacturerName(this.priceListToEdit.manufacturer)
      };
    },

    getManufacturerName(manufacturer) {
      return typeof manufacturer === 'string'
          ? manufacturer
          : manufacturer?.name || '';
    },

    validatePrice() {
      const priceValue = this.formData.price;
      if (!/^[0-9]+([.,][0-9]{1,2})?$/.test(priceValue)) {
        this.priceError = 'Введите корректное числовое значение';
        return false;
      }
      this.priceError = null;
      return true;
    },

    closeModal() {
      this.$emit('close');
    },

    async submitForm() {
      if (!this.validatePrice()) return;

      this.isLoading = true;

      try {
        const formattedPrice = this.formData.price.replace(',', '.');

        const updatedData = {
          productName: this.formData.productName,
          group: this.formData.group,
          price: formattedPrice,
          manufacturer: this.formData.manufacturer // Отправляем как строку
        };

        const updatedPriceList = await PriceListApi.update(
            this.priceListToEdit.id,
            updatedData
        );

        this.$emit('price-list-updated', {
          ...updatedPriceList,
          manufacturer: this.formData.manufacturer // Сохраняем как строку
        });

        this.closeModal();
      } catch (error) {
        console.error('Ошибка при обновлении прайс-листа:', error);
        alert(error.response?.data?.message || 'Ошибка при обновлении');
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
/* Ваши стили остаются без изменений */
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
  background: #33C760;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: red;
  font-size: 12px;
}
</style>
