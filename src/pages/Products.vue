<script>
import router from "@/router/router.js";
import ProductItem from "@/Components/products/ProductItem.vue";
import {ProductApi} from "@/api/productApi/index.js";
import DeleteModalProducts from "@/Components/products/DeleteModalProducts.vue";
import AddModalProducts from "@/Components/products/AddModalProducts.vue";
import EditModalProducts from "@/Components/products/EditModalProducts.vue";

export default {
  components: {
    EditModalProducts,
    DeleteModalProducts, EditModal: EditModalProducts, AddModal: AddModalProducts, DeleteModal: DeleteModalProducts, ProductItem},
  data() {
    return {
      deleteModalIsOpend: false,
      addModalIsOpend: false,
      editModalIsOpend: false,
      products: [],
      searchQuery: '',
      selectedProducts: new Set()
    }
  },
  computed: {
    productToEdit() {
      if (this.selectedProducts.size !== 1) return null;
      const productId = Array.from(this.selectedProducts)[0];
      return this.products.find(p => p.id === productId);
    },
    filteredProducts() {
      return this.products.filter(product =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.group.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.number.includes(this.searchQuery)
      );
    },
    productsToDelete() {
      return this.products.filter(product =>
          this.selectedProducts.has(product.id))
    }
  },
  async created() {
    await this.loadProducts();
  },
  methods: {
    openEditModal() {
      if (this.selectedProducts.size !== 1) {
        alert('Пожалуйста, выберите ровно один продукт для редактирования');
        return;
      }
      this.editModalIsOpend = true;
    },

    closeEditModal() {
      this.editModalIsOpend = false;
    },

    handleProductUpdated(updatedProduct) {
      const index = this.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        // Для Vue 3 Composition API
        this.products[index] = updatedProduct;
        // Или для реактивности можно создать новый массив
        this.products = [
          ...this.products.slice(0, index),
          updatedProduct,
          ...this.products.slice(index + 1)
        ];
      }
      this.selectedProducts.clear();
    },
    async loadProducts() {
      try {
        const data = await ProductApi.getAll();
        this.products = data;
      } catch (error) {
        console.error('Error loading products:', error);
      }
    },
    routerPushtoHome() {
      router.push({path: "/"});
    },
    handleAddProduct() {
      router.push({path: "/products/new"});
    },
    openDeleteModal() {
      if (this.selectedProducts.size === 0) {
        alert('Пожалуйста, выберите хотя бы один продукт для удаления');
        return;
      }
      this.deleteModalIsOpend = true;
    },
    closeDeleteModal() {
      this.deleteModalIsOpend = false;
    },
    async confirmDelete() {
      try {
        const idsToDelete = Array.from(this.selectedProducts);
        await ProductApi.deleteMultiple(idsToDelete);

        this.products = this.products.filter(
            product => !idsToDelete.includes(product.id)
        );

        this.selectedProducts.clear();
        this.closeDeleteModal();
        alert('Продукты успешно удалены!');
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert('Произошла ошибка при удалении продуктов');
      }
    },
    openAddModal() {
      this.addModalIsOpend = true;
    },

    closeAddModal() {
      this.addModalIsOpend = false;
    },

    handleProductAdded(newProduct) {
      this.products.unshift(newProduct); // Добавляем новый продукт в начало списка
    },
    handleEditProduct() {
      if (this.selectedProducts.size !== 1) {
        alert('Please select exactly one product to edit');
        return;
      }
      const productId = Array.from(this.selectedProducts)[0];
      router.push({path: `/products/edit/${productId}`});
    },
    toggleProductSelection(productId) {
      if (this.selectedProducts.has(productId)) {
        this.selectedProducts.delete(productId);
      } else {
        this.selectedProducts.add(productId);
      }
    }
  }
}
</script>



<template>
  <div>
    <DeleteModalProducts
        v-if="deleteModalIsOpend"
        :productsToDelete="productsToDelete"
        @close="closeDeleteModal"
        @confirm="confirmDelete"
    />
    <EditModalProducts
        v-if="editModalIsOpend && productToEdit"
        :productToEdit="productToEdit"
        @close="closeEditModal"
        @product-updated="handleProductUpdated"
    />
    <AddModal
        v-if="addModalIsOpend"
        @close="closeAddModal"
        @product-added="handleProductAdded"
    />
    <div class="centring container">
      <div class="big_wrapper">
        <h1 class="title">Товары</h1>
        <div class="search_box">
          <input
              v-model="searchQuery"
              placeholder="Поиск"
              type="text"
              class="search"
          >
          <img class="search_button" src="../../public/img/lupa.svg" alt="Search">
        </div>
        <div class="titling">
          <div class="titling_item">
            <p>Название</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Кол-во</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Группа</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Штрихкод</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Производитель</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
          <div class="titling_item">
            <p>Цена</p>
            <img src="../../public/img/down_arrow.svg" alt="стрелочка вниз">
          </div>
        </div>
        <div class="wrapper">
          <ProductItem
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
              :selected="selectedProducts.has(product.id)"
              @select="toggleProductSelection(product.id)"
          />
        </div>
        <div class="button_wrapper">
          <div class="btn_subwrap">
            <button
                style="background-color: #33C760"
                class="buttons"
                @click="openAddModal"
            >
              добавить
            </button>
            <button
                style="background-color: #E43131"
                class="buttons"
                @click="openDeleteModal"
            >
              удалить
            </button>
            <button
                style="background-color: #199BEC"
                class="buttons"
                @click="openEditModal"
            >
              редактировать
            </button>
          </div>
          <button
              style="background-color: black !important;"
              class="buttons"
              @click="routerPushtoHome"
          >
            назад
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.centring{
  display: flex;
  justify-content: center;
}
.big_wrapper {
  flex-direction: column;
  display: flex;
  justify-content: center;
}

.title {
  margin-top: 20px;
  margin-left: 60px;
  font-size: 36px;
  font-weight: 600;
  font-family: 'Inter-mf', sans-serif;
}

.search {
  margin-left: 5px;
  padding-left: 20px;
  width: 910px;
  height: 44px;
  background-color: #D9D9D9;
  border-radius: 87px;

}

.search_box {
  display: flex;
  margin-top: 15px;
  margin-left: 60px;
  max-width: 945px
}

.search_button {
  position: relative;
  right: 50px;
}

.titling {
  margin-top: 15px;
  margin-left: 60px;
  display: flex;
  width: 910px;
  justify-content: space-around;
}

.titling_item {
  display: flex;
  font-size: 20px;
  font-weight: 600;
  font-family: 'Inter-mf', sans-serif;
}

.wrapper {
  width: 930px;
  margin-left: 60px;
  margin-top: 15px;
  max-height: 320px;
  overflow-y: scroll;
  scrollbar-track-color: #4E4D4D;
}
::-webkit-scrollbar{
  background-color: #D9D9D9;
  margin-left: 10px;
  width: 10px;
  border-radius: 30px;
}
::-webkit-scrollbar-thumb{
  background-color: #757575;
  border-radius: 30px;
  -webkit-border-radius: 10px;

}

input::placeholder {
  font-family: 'Inter-mf', sans-serif;
  margin-left: 20px;
}
.button_wrapper{
  justify-content: space-between;
  width: 910px;
  display: flex;
  margin-left: 60px;
  margin-top: 28px;
}
.btn_subwrap{
  display: flex;
  width: 450px;
  justify-content: space-between;
}
.btn_subwrap button {
  color: black !important;
}
.buttons {
  height: 45px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: transparent;
  border-radius: 25px;
  color: white;
  font-family: 'Inter-mf', sans-serif;
  font-size: 20px;
}
</style>
