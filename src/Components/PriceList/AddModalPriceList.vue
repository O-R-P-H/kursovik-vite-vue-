<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Добавление нового прайс-листа</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Производитель:</label>
          <input v-model="formData.manufacturer" required>
        </div>

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

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="closeModal">Отмена</button>
          <button type="submit" class="confirm-btn">Добавить</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { PriceListApi } from "@/api/priceListApi";

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      formData: {
        manufacturer: '',
        productName: '',
        group: '',
        price: ''
      },
      priceError: null
    };
  },
  methods: {
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
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        manufacturer: '',
        productName: '',
        group: '',
        price: ''
      };
      this.priceError = null;
    },
    async submitForm() {
      if (!this.validatePrice()) {
        return;
      }

      try {
        const formattedPrice = this.formData.price.replace(',', '.');

        const newPriceList = await PriceListApi.create({
          manufacturer: this.formData.manufacturer,
          productName: this.formData.productName,
          group: this.formData.group,
          price: formattedPrice
        });

        this.$emit('price-list-added', newPriceList);
        this.closeModal();
      } catch (error) {
        console.error('Ошибка при добавлении прайс-листа:', error);
        alert(`Ошибка: ${error.response?.data?.message || 'Неизвестная ошибка'}`);
      }
    }
  }
};
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
  background: #33C760;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn:hover {
  background: #2aad52;
}
</style>
