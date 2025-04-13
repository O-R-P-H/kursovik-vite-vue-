



<script>
export default {
  props: {
    productsToDelete: {
      type: Array,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmDelete() {
      this.$emit('confirm');
    }
  }
}
</script>
<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Подтверждение удаления</h2>
      <div class="products-list">
        <div v-for="product in productsToDelete" :key="product.id" class="product-item">
          <p><strong>Название:</strong> {{ product.name }}</p>
          <p><strong>Группа:</strong> {{ product.group }}</p>
          <p><strong>Артикул:</strong> {{ product.number }}</p>
        </div>
      </div>
      <div class="modal-actions">
        <button class="cancel-btn" @click="closeModal">Cancel</button>
        <button class="confirm-btn" @click="confirmDelete">Ok</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
p{
  font-family: 'Inter-mf', sans-serif;
}
::-webkit-scrollbar{
  background-color: #D9D9D9;
  margin-left: 10px;
  width: 10px;
  height: 7px;
  border-radius: 30px;
}
::-webkit-scrollbar-thumb{
  height: 7px;
  background-color: #757575;
  border-radius: 30px;
  -webkit-border-radius: 10px;}
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
  max-height: 183px;
  overflow-y: auto;
}

.modal-content h2 {
  font-family: 'Inter-mf', sans-serif;
  margin-top: 0;
  color: #E43131;
}

.products-list {
  margin: 20px 0;
}

.product-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.product-item:last-child {
  border-bottom: none;
}

.modal-actions {
  display: flex;
  justify-content:space-between;
  gap: 10px;
}

.cancel-btn {
  height: 35px;
  font-family: 'Inter-mf', sans-serif;
  padding: 8px 16px;
  background: #ccc;
  border: none;
  border-radius:25px;
  cursor: pointer;
}

.confirm-btn {
  width: 100px;
  height: 35px;
  font-family: 'Inter-mf', sans-serif;
  padding: 8px 16px;
  background: #E43131;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
}

.confirm-btn:hover {
  background: #c12b2b;
}
</style>
